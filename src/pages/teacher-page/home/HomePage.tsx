import { useEffect, useState } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useAuth } from "../../../states/auth";
import { TeacherProfile } from "../types";
import { request } from "../../../request";
import { Spin , Button, Image, message, Upload,Form, Row, Col, Input, Modal, DatePicker, Switch} from "antd";
import type { UploadProps } from 'antd';
import { UploadOutlined } from "@ant-design/icons";


dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(customParseFormat);

const TeacherHomePage: React.FC = () => {
  const { teacherId, branchId } = useAuth();
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [showPasswords, setShowPasswords] = useState(false);

  
  useEffect(() => {
    fetchTeacherData()
  }, [teacherId]);
    const fetchTeacherData = async () => {
      try {
        const response = await request.get<TeacherProfile>(
          `account/staff-profile/${teacherId}/`
        );
        setTeacher(response.data);
       form.setFieldsValue({
         ...response.data,
         birthday: response.data.birthday
           ? dayjs(response.data.birthday)
           : null,
         end_at: response.data.end_at ? dayjs(response.data.end_at) : null,
       });
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };
    console.log(teacher)
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
            roles: "teacher",
          },
          branch: branchId,
          position: [teacher?.position[0].id],
        };
        await request.put(`account/staff-profile-update/${teacherId}/`, updatedValues);
        setIsModalVisible(false);
        fetchTeacherData();
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    };

  if (!teacher) {
    return <div>
       <Spin size="small" className="flex justify-center text-center mt-12" />
    </div>;
  }


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
      fetchTeacherData();
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

  const toggleShowPasswords = () => {
    setShowPasswords(!showPasswords);
  };

  return (
    <div className="home-main bg-gray-100 p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">
          O'qituvchi ma'lumotlari
        </h1>
        <div className="flex items-center">
          <Image
            src={teacher.image}
            alt="user image"
            width={70}
            height={70}
            style={{ objectFit: "cover", borderRadius: "50%" }}
            className="shadow-lg"
          />

          <div className="ml-2">
            <p className="text-sm font-medium text-gray-600">{`${teacher.first_name} ${teacher.last_name}`}</p>
            <p className="text-xs text-gray-500 mb-2">
              {teacher.position[0].name}
            </p>
            <Upload {...uploadProps} className="w-12">
              <Button icon={<UploadOutlined />}>Rasm yuklash</Button>
            </Upload>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <p className="text-sm text-gray-600">Filial: {teacher.branch.name}</p>
        <p className="text-sm text-gray-600">
          Telefon nomer: {teacher.phone_number}
        </p>
        <p className="text-sm text-gray-600">Oylik moash: {teacher.salary}</p>
        <p className="text-sm text-gray-600">
          Tug'ulgan kun: {teacher.birthday}
        </p>
      </div>
      <div className="flex justify-end mt-2">
        <Button type="primary" onClick={handleEditProfile}>
          Profilni tahrirlash
        </Button>
      </div>
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
            <Col span={8}>
              <Form.Item name="phone_number" label="Telefon raqam">
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
  );
};

export default TeacherHomePage;
