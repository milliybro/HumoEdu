import { useCallback, useEffect, useState } from "react";
import { request } from "../../../request";
import { useAuth } from "../../../states/auth";
import { toast } from "react-toastify";

import EduCard, { EduCardProps } from "../../../components/educard/EduCard";

import "./education.scss";
const Education = () => {
  const [euducationData, setEducationData] = useState<EduCardProps[]>([]);
  const { userId } = useAuth();

  const getEducation = useCallback(async () => {
    try {
      const res = await request.get(`group/groups/`);
      console.log(res.data, "data");
      
      const data = res.data.results;
      setEducationData(data);
    } catch (err) {
      toast.error("Error getting education");
    } 
  }, [userId]);

  useEffect(() => {
    getEducation();
  }, [getEducation]);


  return (
    <section className="education">
        <div className="educationTitle">
          <h2>Mening guruhlarim ({euducationData.length})</h2>
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
              staff={res.staff}
              student={res.student}
              science={res.science}
              branch={res.branch}
              start_at={res.start_at}
              end_at={res.end_at}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
