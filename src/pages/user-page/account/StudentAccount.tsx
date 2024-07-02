import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { request } from "../../../request";
import { useAuth } from "../../../states/auth";
import { AccountType } from "../../../types";
import avatar from "../../../assets/avatar-svgrepo-com.svg";
import { IMG_URL } from "../../../constants";
import { Button, Form, Input, Modal, Upload , Spin} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const Account = () => {
  const [userData, setUserData] = useState<AccountType | null>(null);
  const { teacherId, branchId } = useAuth();
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();

  const getAccount = useCallback(async () => {
    try {
      const res = await request.get(`account/student-profile/${teacherId}/`);
      setUserData(res.data);
    } catch (err) {
      toast.error("Ma'lumot olishda xatolik");
    }
  }, [teacherId]);

  const handleSubmit = async (values: any) => {
    console.log(values, "val");
    try {
      await request.put(`account/user-password-update/${teacherId}/`, {
        password: values.newpassword,
      });
      setPasswordModalOpen(false);
      toast.success("Parol muvaffaqiyatli yangilandi!");
    } catch (err) {
      toast.error("Parolni yangilashda xatolik");
    }
  };

  // const handleUpdate = async (values: any) => {
  //   console.log(values, "update");
  //   try {
  //     const branch  =  branchId;
  //     const UpdateData = {...values, branch}
  //     await request.put(`account/student-profile-update/${teacherId}/`, UpdateData);
  //     getAccount();
  //     setUpdateModalOpen(false);
  //     toast.success("Profil muvaffaqiyatli yangilandi!");
  //   } catch (err) {
  //     toast.error("Profilni yangilashda xatolik");
  //   }
  // };

  const handleImage = async (info) => {
    console.log(info, "info");

    try {
      if (info.file && info.file.status === "uploading") {
        toast.success(`${info.file.name} fayl muvaffaqiyatli yuklandi`);
        const imageUrl = info.file.response?.url;
        await request.put(
          `account/student-profile-update-image/${teacherId}/`,
          {
            image: imageUrl,
          }
        );
        getAccount(); // Profil rasmini yangilash
        setUpdateModalOpen(false);
      } else if (info.file && info.file.status === "error") {
        toast.error(`${info.file.name} faylni yuklashda xatolik.`);
      }
    } catch (err) {
      console.error("Profil rasmini yangilashda xatolik:", err);
      toast.error("Profil rasmini yangilashda xatolik");
    }
  };

  const props = {
    name: "file",
    action: `${IMG_URL}student-profile-update-image/${teacherId}`,
    headers: {
      authorization: "authorization-text",
    },
    onChange: handleImage,
    accept: ".jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.ico,.tif,.tiff",
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

  const [loading, setLoading] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const showPasswordModal = () => {
    form.resetFields();
    setPasswordModalOpen(true);
  };

 

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPasswordModalOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setPasswordModalOpen(false);
    form.resetFields();
  };

  const handleUpdateCancel = () => {
    setUpdateModalOpen(false);
    updateForm.resetFields();
  };

  if (!userData) {
    return <Spin size="small" className="flex flex-column  justify-center mt-72" />;
  }

  const {
    image,
    first_name,
    last_name,
    phone_number1,
    phone_number2,
    balance,
    user,
    branch,
    group,
    birthday,
    status,
  } = userData;

  return (
    <section className="px-6 md:px-12 mt-6 py-6 min-h-[30vh] md:h-[75%] flex flex-col justify-center items-center">
      <div className="flex justify-center items-center">
        <img
          src={image ? image : avatar}
          alt="Avatar"
          className="w-32 h-32 rounded-full border-4 border-white"
        />
      </div>
      <div className="mt-4 text-center">
        <h2 className="text-2xl font-bold">
          {first_name} {last_name}
        </h2>
      </div>
      <div className="mt-8 text-start">
        <p>
          <strong>Hisob:</strong> {balance}
        </p>
        <p>
          <strong>Foydalanuvchi:</strong> {user.username}
        </p>
        <p>
          <strong>Filial:</strong> {branch.name} - {branch.address}
        </p>
        <p>
          <strong>Guruhlar:</strong> {group.map((g) => g.name).join(", ")}
        </p>
        <p>
          <strong>Tug'ilgan kun:</strong>{" "}
          {new Date(birthday).toLocaleDateString()}
        </p>
        <p className="mt-2">
          <strong>telefon raqam 1:</strong> {phone_number1}
        </p>
        <p className="mt-2">
          <strong>telefon raqam 2:</strong> {phone_number2}
        </p>
        <p>
          <strong>Status:</strong> {status ? "Active" : "Inactive"}
        </p>
      </div>
      <div className="mt-8 flex justify-center items-center flex-wrap">
        <Button
          type="primary"
          onClick={showPasswordModal}
          className="mb-4 md:mb-0 md:mr-4"
        >
          Parolni o'zgartirish
        </Button>
        <Modal
          title="Parolni o'zgartirish"
          open={passwordModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Bekor qilish
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={() => form.submit()}
            >
              Saqlash
            </Button>,
          ]}
        >
          <Form form={form} onFinish={handleSubmit}>
            <Form.Item
              name="newpassword"
              label="Yangi parol"
              rules={[
                {
                  required: true,
                  message: "Iltimos, yangi parolni kiriting!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirm"
              label="Parolni tasdiqlang"
              dependencies={["newpassword"]}
              rules={[
                {
                  required: true,
                  message: "Iltimos, parolni qayta kiriting!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newpassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Kiritilgan parollar mos kelmadi!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Form>
        </Modal>
        <Upload {...props}>
          <Button className="mb-4" icon={<UploadOutlined />}>Rasmni yangilash</Button>
        </Upload>
      </div>
    </section>
  );
};

export default Account;
