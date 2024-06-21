import React, { useState, useEffect } from "react";
import { Input, Button, Form, DatePicker, Space, Row, Col } from "antd";
import { Profile } from "../types";
import { request } from "../../../request";
import { useAuth } from "../../../states/auth";
import LoadingContents from "../../../components/loading/LoadingContents";
import moment from "moment";
import './profile.scss'
// import { useNumberStore } from "../../../states/adminProfile";
const AdminProfile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const { userId } = useAuth();
  //////// branchidni storega saqlash /////////
  // const  setNumber  = useNumberStore((state)=>state.setNumber);
  // useEffect(()=>{
  //     if(profile?.branch?.id){
  //       setNumber(profile?.branch?.id);
  //     }
  // },[profile?.branch?.id])
 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await request.get(`account/staff-profiles/?user=${userId}`);
        setProfile(data.results[0]);
        console.log(data.results[0]);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const handleEdit = () => {
    setEditing(true);
  };

   const handleSave = async () => {
    //  try {
    //    const formData = new FormData();
    //    formData.append("last_name", profile?.last_name || "");
    //    formData.append("first_name", profile?.first_name || "");
    //    formData.append("birthday", profile?.birthday || "");
    //    formData.append("start_at", profile?.start_at || "");
    //    formData.append("end_at", profile?.end_at || "");

    //    await request.put(`account/student-profile-update/${userId}/`, formData);
    //    setEditing(false);
    //    console.log("Profil ma'lumotlari saqlandi");
    //  } catch (error) {
    //    console.error("Profil ma'lumotlarini saqlashda xatolik:", error);
    //  }
       setEditing(false);
   };

  if (!profile) {
    return (
      <div>
        <LoadingContents />
      </div>
    );
  }
  
  console.log(profile?.branch?.id);
  

  return (
    <div>
      <div className="wrapper-user">
        <h1>Admin Profile</h1>
        <div>
          <img src={profile.image} alt="user image" width={50} height={50} />
        </div>
      </div>
      <Space>
        <Form layout="vertical">
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="ID">
                <Input value={profile.id} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Familiya">
                <Input
                  value={profile.last_name}
                  disabled={!editing}
                  onChange={(e) =>
                    setProfile({ ...profile, last_name: e.target.value })
                  }
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Ism">
                <Input
                  value={profile.first_name}
                  disabled={!editing}
                  onChange={(e) =>
                    setProfile({ ...profile, first_name: e.target.value })
                  }
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Foydalanuvchi nomi">
                <Input value={profile.user?.username} disabled={!editing} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Rol">
                <Input value={profile.user?.roles} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Filial nomi">
                <Input value={profile.branch?.name} disabled={!editing} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Filial manzili">
                <Input value={profile.branch?.address} disabled={!editing} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Telefon raqami">
                <Input value={profile.phone_number} disabled={!editing} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Maosh">
                <Input value={profile.salary} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Tug'ilgan kun">
                <DatePicker
                  value={moment(profile.birthday)}
                  format="YYYY-MM-DD"
                  disabled={!editing}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Button
                style={{ marginTop: 30 }}
                type="primary"
                onClick={editing ? handleSave : handleEdit}
              >
                {editing ? "Saqlash" : "Tahrirlash"}
              </Button>
            </Col>
          </Row>
        </Form>
      </Space>
    </div>
  );
};

export default AdminProfile;
