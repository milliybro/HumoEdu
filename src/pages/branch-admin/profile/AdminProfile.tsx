import React, { useState, useEffect  } from "react";
import { Button, Modal , Input, Space, Row, Col} from "antd";
import { Profile } from "../types";
import { request } from "../../../request";
import { useAuth } from "../../../states/auth";
import LoadingContents from "../../../components/loading/LoadingContents";
import moment from "moment";
import "./profile.scss";

const AdminProfile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await request.get(
          `account/staff-profiles/?user=${userId}`
        );
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

  const handleModalOpen = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleModalSave = async () => {
    try {
      await request.put(`account/student-profile-update/${userId}/`, {
        
      });
      console.log("Profile updated successfully");
      setModalVisible(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!profile) {
    return <LoadingContents />;
  }

  return (
    <div className="mx-auto max-w-4xl p-6 bg-white rounded shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Profile</h1>
        <img
          src={profile.image}
          alt="user image"
          className="w-12 h-12 rounded-full"
        />
      </div>
      <div className="space-y-4">
        <p>
          <strong>ID:</strong> {profile.id}
        </p>
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
      <div className="mt-6">
        <Button type="primary" onClick={handleModalOpen}>
          Tahrirlash
        </Button>
      </div>
      <Modal
        open={modalVisible}
        onCancel={handleModalClose}
        onOk={handleModalSave}
      >
        <Input value={profile?.first_name}   />
        <Input value={profile?.last_name} />
        <Input value={profile?.phone_number} />
      </Modal>
    </div>
  );
};

export default AdminProfile;
