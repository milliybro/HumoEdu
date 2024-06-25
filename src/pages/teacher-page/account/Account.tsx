import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { request } from "../../../request";
import { useAuth } from "../../../states/auth";
import { AccountType } from "../../../types";
import avatar from "../../../assets/avatar-svgrepo-com.svg";

import "./account.scss";
import { Button, Form, Input, Modal, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";



const TeacherAccount = () => {
  const [userData, setUserData] = useState<AccountType[]>([]);
  const { userId } = useAuth();
  console.log(userId);
  const [form] = Form.useForm();

  const getAccount = useCallback(async () => {
    try {
      const res = await request.get(`account/student-profile/${userId}/`);
      setUserData(res.data);
    } catch (err) {
      toast.error("Error");
    }
  }, [userId]);


  const handleSubmit = async (values: any) => {
    console.log(values, "val");
    try {
      await request.put(`account/user-password-update/${userId}/`, {
        password: values.newpassword,
      });
      setOpen(false);
      toast.success("Success!");
    } catch (err) {
      toast.error("Error sending message");
    }
  };

  const handleImage = async (info) => {
    console.log(info, "info");
    
    try {
      if (info.file.status === "done") {
        toast.success(`${info.file.name} file uploaded successfully`);
        // Assuming `info.file.response` contains the uploaded image URL
        const imageUrl = info.file.response.url; 
        await request.put(`/account/student-profile-update-image/${userId}/`, {
          image: imageUrl,
        });
        setOpen(false);
      } else if (info.file.status === "error") {
        toast.error(`${info.file.name} file upload failed.`);
      }
    } catch (err) {
      console.error("Error updating profile image:", err);
      toast.error("Error updating profile image");
    }
  };
  
  const props = {
    name: "file",
    action: `http://51.20.248.99:8000/api/v1/account/student-profile-update-image/${userId}`,
    headers: {
      authorization: "authorization-text",
    },
    onChange: handleImage,
    accept: ".jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.ico,.tif,.tiff", // Allow all image file types
  };

  const validatePassword = (_, value) => {
    const newPassword = form.getFieldValue("newpassword");
    if (value && value !== newPassword) {
      return Promise.reject(new Error("Qiymatlar mos emas!"));
    }
    return Promise.resolve();
  };

  useEffect(() => {
    getAccount();
  }, [getAccount]);

  const { image, first_name, last_name, phone_number1, phone_number2 } =
    userData;

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const showModal = () => {
    form.resetFields(); // Clear the form fields
    setOpen(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields(); // Clear the form fields
  };

  return (
    <section id="account" className="account">
      <div className="account__wrapper">
        <div className="user_account_header">
          <div className="user_photo">
            <div>
              <img src={image ? image : avatar} alt="" />
              <span>
                <Upload {...props}>
                  <Button onClick={handleImage} icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </span>
            </div>
          </div>
          <div className="user_info">
            <div className="between user_info-firstName">
              <h4>Ism:</h4>
              <h4>{first_name} </h4>
            </div>
            <div className="between user_info-lastName">
              <h4>Familiya:</h4>
              <h4> {last_name}</h4>
            </div>
            <div className="between user_info-phoneNumber">
              <h4>Telefon raqam:</h4>
              <h4>{phone_number1}</h4>
            </div>
            <div className="between user_info-otherphone">
              <h4>Telefon raqam:</h4>
              <h4> {phone_number2}</h4>
            </div>
            <Button onClick={showModal}>Tahrirlash</Button>
            <Modal
              className="account-modal"
              visible={open}
              title="Parol o'zgartirish"
              onCancel={handleCancel}
              footer={null} // Hide the footer (OK and Cancel buttons)
            >
              <Form form={form} name="changepwd" onFinish={handleSubmit}>
                <div>
                  <Form.Item
                    label="Yangi parol"
                    name="newpassword"
                    rules={[
                      {
                        required: true,
                        message: "Parolni kiriting!",
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item
                    label="Parolni takrorlang"
                    name="newpasswordrepeat"
                    rules={[
                      {
                        required: true,
                        message: "Parolni kiriting!",
                      },
                      { validator: validatePassword }, // Add the validator function here
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </div>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Saqlash
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeacherAccount;
