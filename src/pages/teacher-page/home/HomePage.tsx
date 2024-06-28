import { useEffect, useState } from "react";
import { useAuth } from "../../../states/auth";
import { TeacherProfile } from "../types";
import { request } from "../../../request";
import { Spin } from "antd";
const TeacherHomePage: React.FC = () => {
  const { teacherId } = useAuth();
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await request.get<TeacherProfile>(
          `account/staff-profile/${teacherId}/`
        );
        setTeacher(response.data);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };

    if (teacherId) {
      fetchTeacherData();
    }
  }, [teacherId]);

  if (!teacher) {
    return <div>
       <Spin size="small" className="flex justify-center text-center mt-12" />
    </div>;
  }

  return (
    <div className="home-main bg-gray-100 p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">O'qituvchi ma'lumotlari</h1>
        <div className="flex items-center">
          <img
            src={teacher.image}
            alt="Teacher"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="ml-2">
            <p className="text-sm font-medium text-gray-600">{`${teacher.first_name} ${teacher.last_name}`}</p>
            <p className="text-xs text-gray-500">{teacher.position[0].name}</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <p className="text-sm text-gray-600">Filial: {teacher.branch.name}</p>
        <p className="text-sm text-gray-600">
          Telefon nomer: {teacher.phone_number}
        </p>
        <p className="text-sm text-gray-600">Oylik moash: {teacher.salary}</p>
        <p className="text-sm text-gray-600">Tug'ulgan kun: {teacher.birthday}</p>
      </div>
    </div>
  );
};

export default TeacherHomePage;
