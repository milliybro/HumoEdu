import { useState, useEffect, useCallback } from "react";
import { request } from "../../../request";
import { useAuth } from "../../../states/auth";
import { AccordionSectionProps } from "../../../types";
import "../../../components/accordion/accordion.scss";
import "./experience.scss";
import { useParams } from "react-router-dom";
import { Table, Image } from "antd";

const TeacherExperience = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [experience, setExperience] = useState<AccordionSectionProps | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();

  const getData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await request.get(`group/group/${groupId}/`);
      setExperience(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [userId, groupId]);

  useEffect(() => {
    getData();
  }, [getData]);

  const students = experience?.student || [];
  // const sciences = experience?.sciences || [];
  // const branches = experience?.branches || [];

  const dataSource = students.map((student) => ({
    id: student.id || "",
    image: student.image || "",
    name: student.first_name || "",
    lastName: student.last_name || "",
    phone_number1: student.phone_number1 || "",
    phone_number2: student.phone_number2 || "",
    balance: student.balance || "",
  }));

  const columns = [
    {
      title: "N",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (image: string) => (
        <Image
          style={{ width: "40px", height:"40px" }}
          className="antd-img rounded-full"
          alt="student"
          src={image}
        />
      ),
    },
    {
      title: "Ismi",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Familiyasi",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Tel 1",
      dataIndex: "phone_number1",
      key: "phone_number1",
    },
    {
      title: "Tel 2",
      dataIndex: "phone_number2",
      key: "phone_number2",
    },
    {
      title: "Hisobi",
      dataIndex: "balance",
      key: "balance",
    },
  ];

  return (
    <div className="experience_main mt-7 fixed w-5/6">
      <div className="experience__list">
        <div className="exp_title">
          <h1 className="text-bold text-gray-800 text-center fond-medium">
            {experience?.name}
          </h1>
        </div>
        <Table
          dataSource={dataSource}
          columns={columns}
          className="mt-2"
          loading={loading}
        />
      </div>
      <div className="group-in-info shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-white">
          Guruh ma'lumotlari
        </h1>
        <div className="space-y-2">
          <h3 className="text-xl font-medium">
            Guruh:{" "}
            <span className="font-normal text-gray-700">
              {experience?.name}
            </span>
          </h3>
          <h3 className="text-xl font-medium">
            O'qituvchi:{" "}
            <span className="font-normal text-gray-700">
              {experience?.teacher?.first_name} {experience?.teacher?.last_name}
            </span>
          </h3>
          {/* <h3 className="text-xl font-medium">
            Fan:{" "}
            <span className="font-normal text-gray-700">
              {sciences.map((science) => science?.name).join(", ")}
            </span>
          </h3> */}
         
          <h3 className="text-xl font-medium">
            Yordamchi o'qituvchi:{" "}
            <span className="font-normal text-gray-700">
              {experience?.sub_teacher
                ? experience?.sub_teacher
                : "Yordamchi o`qituvchi biriktirilmagan"}
            </span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default TeacherExperience;
