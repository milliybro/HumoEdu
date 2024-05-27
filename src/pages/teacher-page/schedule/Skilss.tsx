import { useState, useEffect, useCallback } from "react";
import { request } from "../../../request";
import { SkillsType } from "../../../types";
import { useAuth } from "../../../states/auth";
import { toast } from "react-toastify";

import "./skilss.scss";
import { Card, Col, Row } from "antd";

const TeacherSkilss = () => {
  const [skill, setSkill] = useState<SkillsType[]>([]);
  const [sciences, setSciences] = useState<any>(null); // Change to any
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();

  const getSkill = useCallback(async () => {
    try {
      setLoading(true);
      const res = await request.get(
        `group/lessonchedules/`
      );
      setSkill(res.data);
    } catch (err) {
      toast.error("Error");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const getScience = useCallback(
    async (groupId) => { // Accept groupId as parameter
      try {
        setLoading(true);
        const res = await request.get(`/group/science/${groupId}/`);
        setSciences(res.data);
      } catch (err) {
        toast.error("Error");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  

  // const getTeacher = useCallback(
  //   async (groupId) => { // Accept groupId as parameter
  //     try {
  //       setLoading(true);
  //       const res = await request.get(`/group/science/${groupId}/`);
  //       setSciences(res.data);
  //     } catch (err) {
  //       toast.error("Error");
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   []
  // );

  useEffect(() => {
    getSkill();
  }, [getSkill]);

  useEffect(() => {
    if (skill.length > 0) { // Check if skill is not empty
      getScience(skill[0].group.science.name); // Pass the groupId to getScience
    }
  }, [skill, getScience]);

  const groupedSkills: { [key: string]: SkillsType[] } = {};
  skill.forEach((res) => {
    res.deys.forEach((day) => {
      if (!groupedSkills[day]) {
        groupedSkills[day] = [];
      }
      groupedSkills[day].push(res);
    });
  });



  return (
    <div className="skill_wrapper">
      <h1>Dars jadvali</h1>
      <div className="skill_list">
        <div className="list__title"></div>
        <div className="list_col">
          {[
            "Dushanba",
            "Seshanba",
            "Chorshanba",
            "Payshanba",
            "Juma",
            "Shanba",
            "Yakshanba",
          ]
            .sort((a, b) => {
              // Custom sorting to ensure Sunday comes last
              if (a === "Sunday") return 1;
              if (b === "Sunday") return -1;
              return 0;
            })
            .map((day) => {
              if (day > 1) {
                return null; // If day is greater than 1, render nothing
              }

              const similarGroups = groupedSkills[day];
              const classesExist = similarGroups && similarGroups.length > 0;

              return (
                <Row gutter={24} key={day}>
                  {classesExist ? (
                    <Col
                      style={{ display: "flex", flexDirection: "column" }}
                      span={24}
                    >
                      <h2 style={{ marginBottom: "10px" }}>{day}</h2>
                      <div style={{ display: "flex", gap: "10px" }}>
                        {similarGroups
                          .sort((a, b) => {
                            // Sort by start_time in ascending order
                            return (
                              new Date("1970/01/01 " + a.start_time) -
                              new Date("1970/01/01 " + b.start_time)
                            );
                          })
                          .map((res, idx) => (
                            <Card
                              key={`${day}-${idx}`}
                              bordered={true}
                              style={{ marginBottom: 16, width: "50%" }}
                            >
                              <h3>Fan: {res.group.science.name}</h3> {/* Check if sciences is not null */}
                              <p>
                                {res.start_time.slice(0, 5)} -{" "}
                                {res.end_time.slice(0, 5)}
                              </p>
                              <h4>Xona: {res.room.name}</h4>
                              <h4>Ustoz: {res.group.staff[0].last_name} {res.group.staff[0].first_name} </h4>
                            </Card>
                          ))}
                      </div>
                    </Col>
                  ) : (
                    <Col span={24}>
                      <Card bordered={false} style={{ marginBottom: 16 }}>
                        <p>{day} kuni darslar yo'q.</p>
                      </Card>
                    </Col>
                  )}
                </Row>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default TeacherSkilss;
