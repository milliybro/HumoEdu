import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { request } from "../../../request";
import { useAuth } from "../../../states/auth";
import { AccountType } from "../../../types";
import avatar from "../../../assets/avatar-svgrepo-com.svg";
import { IMG_URL } from "../../../constants";
import { Button, Form, Input, Modal, Upload , Spin,message, Row, Col, DatePicker, Image} from "antd";
import type { UploadProps } from "antd/lib";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const Account = () => {
  const [userData, setUserData] = useState<AccountType | null>(null);
  const { teacherId, branchId} = useAuth();
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  
  const getAccount = useCallback(async () => {
    try {
      const res = await request.get(`account/student-profile/${teacherId}/`);
      setUserData(res.data);
      form.setFieldsValue({
        ...res.data,
        birthday: res.data.birthday ? dayjs(res.data.birthday) : null,
        end_at: res.data.end_at ? dayjs(res.data.end_at) : null,
      });
    } catch (err) {
      toast.error("Ma'lumot olishda xatolik");
    }
  }, [teacherId]);

 const handleUpload = async (options: any) => {
   const { onSuccess, onError, file } = options;

   const formData = new FormData();
   formData.append("image", file);

   try {
     const { data } = await request.put(
       `account/student-profile-update-image/${teacherId}/`,
       formData
     );
     onSuccess(data);
     message.success(` Rasm muvaffaqiyatli yukladi `);
     getAccount();
   } catch (error) {
     onError(error);
     message.error(`Rasmni yuklashda xatolik`);
   }
 };

 const uploadProps: UploadProps = {
   customRequest: handleUpload,
   onChange(info) {
     if (info.file.status !== "uploading") {
       console.log(info.file, info.fileList);
     }
   },
 };

  useEffect(() => {
    getAccount();
  }, [getAccount]);

   const handleEditProfile = () => {
     setIsModalVisible(true);
   };

   const handleUpdateProfile = async () => {
     try {
       const values = form.getFieldsValue();
       const updatedValues = {
         ...values,
         birthday: values.birthday
           ? dayjs(values.birthday).format("YYYY-MM-DD")
           : null,
         user: {
           ...values.user,
           roles: "student",
         },
         branch: branchId,
        //  position: [userData?.position[0].id],
       };
       await request.put(
         `account/student-profile-update/${teacherId}/`,
         updatedValues
       );
       setIsModalVisible(false);
       getAccount();
     } catch (error) {
       console.error("Error updating profile:", error);
     }
   };

   const toggleShowPasswords = () => {
     setShowPasswords(!showPasswords);
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
        <Image
          src={userData?.image}
          alt="user image"
          width={80}
          height={80}
          style={{ objectFit: "cover", borderRadius: "50%" }}
          className="shadow-lg"
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
        <Button type="primary" className="mr-3" onClick={handleEditProfile}>
          Profilni tahrirlash
        </Button>
        <Upload {...uploadProps} className="w-24">
          <Button icon={<UploadOutlined />}>Rasm yuklash</Button>
        </Upload>
        <Modal
          title="Profilni tahrirlash"
          open={isModalVisible}
          onOk={handleUpdateProfile}
          onCancel={() => setIsModalVisible(false)}
          width={1000}
        >
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="last_name" label="Familiya">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="first_name" label="Ism">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={["user", "username"]} label="Username">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              {showPasswords && (
                <>
                  <Col span={8}>
                    <Form.Item name={["user", "password1"]} label="Parol">
                      <Input.Password />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name={["user", "password2"]}
                      label="Parolni tasdiqlash"
                    >
                      <Input.Password />
                    </Form.Item>
                  </Col>
                </>
              )}
              <Col span={4}>
                <Form.Item name="phone_number1" label="Telefon raqam1">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="phone_number2" label="Telefon raqam2">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="birthday" label="Tug'ilgan sana">
                  <DatePicker />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Button type="primary" onClick={toggleShowPasswords}>
            {showPasswords ? "ortga" : "Parolni yangilash"}
          </Button>
        </Modal>
      </div>
    </section>
  );
};

export default Account;
