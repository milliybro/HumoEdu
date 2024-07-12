import { useCallback, useEffect, useState } from "react";
import { request } from "../../../request";
import { useAuth } from "../../../states/auth";
import { toast } from "react-toastify";
import { Spin } from "antd";
import EduCard, { EduCardProps } from "../../../components/educard/EduCard";

import "./education.scss";
const TeacherEducation = () => {
  const [euducationData, setEducationData] = useState<EduCardProps[]>([]);
  const { branchId } = useAuth();
   
  const getEducation = useCallback(async () => {
    try {
      const res = await request.get(`group/groups/`);
      console.log(res.data, "data");

      const data = res.data.results;
      setEducationData(data);
    } catch (err) {
      toast.error("Error getting education");
    } 
  }, [branchId]);

  useEffect(() => {
    getEducation();
  }, [getEducation]);
   
  if (!euducationData) {
    return (
      <div>
        <Spin size="small" className="flex justify-center text-center mt-12" />
      </div>
    );
  }
  return (
    <section className="education mt-6">
      <div className="educationTitle">
        <h2 className="text-2xl text-[#925fe2]">
          Sizning guruhlaringiz soni <span>{euducationData.length}</span> ta
        </h2>
      </div>
      <div className="education_main">
        <div className="edu_cards">
          {euducationData.map((res) => (
            <EduCard
              _id={res._id}
              id={res.id}
              key={res._id}
              name={res.name}
              price={res.price}
              teacher={res.teacher}
              student={res.student}
              science={res.science}
              branch={res.branch}
              start_at={res.start_at}
              end_at={res.end_at}
              groupname={'guruh talabalari'}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeacherEducation;
