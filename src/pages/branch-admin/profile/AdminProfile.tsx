import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Input,
  Image,
  Upload,
  message,
  Form,
  Select,
  Row, Col,Checkbox
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Profile } from '../types';
import { request } from "../../../request";
import { useAuth } from "../../../states/auth";
import LoadingContents from "../../../components/loading/LoadingContents";
import moment from "moment";
import "./profile.scss";
import type { UploadProps } from "antd";
// import { values } from "@ant-design/plots/es/core/utils";

const { Option } = Select;

const AdminProfile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { teacherId, branchId } = useAuth();
    const [positions, setPositions] = useState([]);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchProfile();
    fetchPositions();
  }, [teacherId]);

  const fetchProfile = async () => {
    try {
      const { data } = await request.get(`account/staff-profile/${teacherId}/`);
      setProfile(data);
      form.setFieldsValue(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };
  const fetchPositions = async () => {
    try {
      const { data } = await request.get(`account/positions/`);
      setPositions(data.results);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  const handleModalOpen = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

 const handleUpdate = async (values: any) => {
   const updatedProfile = {
     ...values,
     user: {
       ...values.user,
       username: values.user.username,
       password1: values.user.password1 || undefined,
       password2: values.user.password2 || undefined,
     },
     branch: branchId,
     position: values.position,
   };

   try {
     await request.put(
       `account/staff-profile-update/${teacherId}/`,
       updatedProfile
     );
     message.success("Profil muvaffaqiyatli yangilandi");
     fetchProfile();
     handleModalClose();
   } catch (error) {
     console.error("Profilni yangilashda xatolik:", error);
     message.error("Profilni yangilashda xatolik");
   }
 };

  const handleUpload = async (options: any) => {
    const { onSuccess, onError, file } = options;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await request.put(
        `account/staff-profile-update-image/${teacherId}/`,
        formData
      );
      onSuccess(data);
      message.success(` Rasm muvaffaqiyatli yukladi `);
      fetchProfile();
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

  if (!profile) {
    return <LoadingContents />;
  }
  console.log(profile)
  return (
    <div className="mx-auto max-w-4xl p-6 bg-white rounded shadow-md flex items-center gap-[200px]">
      <div className="space-y-4 mb-6">
        <h1 className="text-2xl font-bold">Admin Profile</h1>
        <p>
          <strong>Familiya:</strong> {profile.last_name}
        </p>
        <p>
          <strong>Ism:</strong> {profile.first_name}
        </p>
        <p>
          <strong>Foydalanuvchi nomi:</strong> {profile.user?.username}
        </p>
        <p>
          <strong>Rol:</strong> {profile.user?.roles}
        </p>
        <p>
          <strong>Filial nomi:</strong> {profile.branch?.name}
        </p>
        <p>
          <strong>Filial manzili:</strong> {profile.branch?.address}
        </p>
        <p>
          <strong>Telefon raqami:</strong> {profile.phone_number}
        </p>
        <p>
          <strong>Maosh:</strong> {profile.salary}
        </p>
        <p>
          <strong>Tug'ilgan kun:</strong>{" "}
          {moment(profile.birthday).format("YYYY-MM-DD")}
        </p>
      </div>
      <div className="space-y-4 flex flex-col items-center gap-[170px]">
        <Image
          src={profile.image}
          alt="user image"
          width={150}
          height={150}
          style={{ objectFit: "cover", borderRadius: "50%" }}
          className="shadow-lg"
        />

        <div className="mt-6 flex gap-8">
          <Button type="primary" onClick={handleModalOpen}>
            Tahrirlash
          </Button>
          <Upload {...uploadProps} className="w-24">
            <Button icon={<UploadOutlined />}>Rasm yuklash</Button>
          </Upload>
        </div>
      </div>

      <Modal
        title="Profilni tahrirlash"
        open={modalVisible}
        onCancel={handleModalClose}
        onOk={() => form.submit()}
        width={1000}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={profile}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="last_name"
                label="Familiya"
                rules={[
                  { required: true, message: "Familiya kiritilishi kerak" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="first_name"
                label="Ism"
                rules={[{ required: true, message: "Ism kiritilishi kerak" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={["user", "username"]}
                label="Foydalanuvchi nomi"
                rules={[
                  {
                    required: true,
                    message: "Foydalanuvchi nomi kiritilishi kerak",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
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
            <Col span={8}>
              <Form.Item
                name="phone_number"
                label="Telefon raqami"
                rules={[
                  {
                    required: true,
                    message: "Telefon raqami kiritilishi kerak",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="salary"
                label="Maosh"
                rules={[{ required: true, message: "Maosh kiritilishi kerak" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="birthday"
                label="Tug'ilgan kun"
                rules={[
                  {
                    required: true,
                    message: "Tug'ilgan kun kiritilishi kerak",
                  },
                ]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="position"
                label="Lavozim"
                rules={[
                  { required: true, message: "Lavozim kiritilishi kerak" },
                ]}
              >
                <Select
                  mode="multiple"
                  value={profile.position.map((pos: any) => ({
                    value: pos.id,
                    label: pos.name,
                  }))}
                  // onChange={handleChange} 
                >
                  {positions.map((position: any) => (
                    <Option key={position.id} value={position.id}>
                      {position.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="status" valuePropName="checked">
            <Checkbox>Status</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminProfile;
