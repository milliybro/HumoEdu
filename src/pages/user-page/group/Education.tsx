import { useCallback, useEffect, useState } from "react";
import { request } from "../../../request";
import { useAuth } from "../../../states/auth";
import { toast } from "react-toastify";

import EduCard, { EduCardProps } from "../../../components/educard/EduCard";
import { Spin } from "antd";

import "./education.scss";

const Education = () => {
  const [euducationData, setEducationData] = useState<EduCardProps[]>([]);
  const [loading, setLoading] = useState(false);
  const { teacherId } = useAuth();

  const getEducation = useCallback(async () => {
    try {
      setLoading(true);
      const res = await request.get(`group/groups/`);
      const data = res.data.results;
      setEducationData(data);
    } catch (err) {
      toast.error("Error getting education");
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    getEducation();
  }, [getEducation]);

  return (
    <section className="education">
      <div className="educationTitle">
        <h2>Mening guruhlarim ({euducationData.length})</h2>
      </div>
      <div className="education_main">
        {loading ? (
          <Spin
            size="small"
            className="flex justify-center items-center h-64 ml-96"
          />
        ) : (
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
        )}
      </div>
    </section>
  );
};

export default Education;
