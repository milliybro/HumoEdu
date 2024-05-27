import { useState, useEffect, useCallback } from "react";
import { request } from "../../../request";
import { useAuth } from "../../../states/auth";
import { AccordionSectionProps } from "../../../types";

import "../../../components/accordion/accordion.scss";
import "./experience.scss";
import { useParams } from "react-router-dom";
import { Table } from "antd";
import example from "../../../assets/centreStudent.png"

const TeacherExperience = () => {
  const { groupId } = useParams();
  console.log(groupId, "ddf");

  const [experience, setExperience] = useState<AccordionSectionProps[]>([]);
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const getData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await request.get(`group/group/${groupId}/`);
      console.log(data, "data");

      setExperience(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    getData();
  }, [getData]);

  const students = experience?.student || [];
  const sciences = experience?.science || [];
  const branches = experience?.branch || [];
  const staffs = experience?.staff || []; // Ensure we have an array to iterate over
  const dataSource = students.map(student => ({
    id: student.id || '',
    image: student.image || '',
    name: student.first_name || '',
    lastName: student.last_name || '',
  }));

const columns = [
  {
    title: "T/r",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Image",
    dataIndex: "image",
    render: (image) => <img style={{width: "50px"}} className="antd-img" alt={image} src={image} />,
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
];


  return (
    <div className="experience_main">
      <div className="experience__list">
        <div className="exp_title">
          <h1 className="title">Guruh: {experience?.name}</h1>
        </div>
        <Table dataSource={dataSource} columns={columns} />
      </div>
      <div className="group-in-info">
        <h1>Guruh ma'lumotlari</h1>
        <div>
          <h3>Guruh: <span> {experience?.name}</span></h3>
          <h3>O'qituvchi: <span> {staffs[0]?.first_name} {staffs[0]?.last_name}</span></h3>
          <h3>Fan: <span>{sciences?.name}</span></h3>
          <h3>Fillial: <span>{branches?.name}</span></h3>
        </div>
      </div>
    </div>
  );
};

export default TeacherExperience;
