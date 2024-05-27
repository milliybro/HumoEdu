import React, { useState, useEffect, useCallback } from "react";
import { request } from "../../request";
import { SkillsType } from "../../types";
import { useAuth } from "../../states/auth";
import { toast } from "react-toastify";
import { Card, Col, Row } from "antd";

const TodayLessons = ({ day }) => {
  const [skill, setSkill] = useState<SkillsType[]>([]);
  const [sciences, setSciences] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();

  const getSkill = useCallback(async () => {
    try {
      setLoading(true);
      const res = await request.get(`group/lessonchedules/`);
      setSkill(res.data);
    } catch (err) {
      toast.error("Error");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    getSkill;
  }, [getSkill]);

  console.log(skill, "fdg");
  

  return (
    <div className="skill_wrapper">
      <div className="skill_list">
        {/* <div className="list_col">
          {sciences && (
            <Row gutter={24}>
              <Col key={idx} span={24}>
                <Card bordered={true} style={{ marginBottom: 16 }}>
                  <h3>Fan: {res.name}</h3>
                  <p>
                    {res.start_time.slice(0, 5)} - {res.end_time.slice(0, 5)}
                  </p>
                  <h4>Xona: {res.room.name}</h4>
                  <h4>
                    Ustoz: {res.staff[0].last_name} {res.staff[0].first_name}
                  </h4>
                </Card>
              </Col>
            </Row>
          )}
          {!sciences && (
            <Card bordered={false} style={{ marginBottom: 16 }}>
              <p>No lessons for {day}.</p>
            </Card>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default TodayLessons;
