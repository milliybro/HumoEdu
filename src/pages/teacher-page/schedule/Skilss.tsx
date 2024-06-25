import { useState, useEffect, useCallback } from "react";
import { request } from "../../../request";
import { SkillsType } from "../../../types";
import { useAuth } from "../../../states/auth";
import { toast } from "react-toastify";
import "./skilss.scss";

const TeacherSkilss = () => {
  const [skill, setSkill] = useState<SkillsType[]>([]);
  const [sciences, setSciences] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();

  const getSkill = useCallback(async () => {
    try {
      setLoading(true);
      const res = await request.get(`group/lessonschedules/`);
      setSkill(res.data);
    } catch (err) {
      toast.error("Error");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const getScience = useCallback(async (groupId) => {
    try {
      setLoading(true);
      const res = await request.get(`/group/science/${groupId}/`);
      setSciences(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getSkill();
  }, [getSkill]);

  useEffect(() => {
    if (skill.length > 0) {
      getScience(skill[0].group.science.id);
    }
  }, [skill, getScience]);

  const groupedSkills: { [key: string]: SkillsType[] } = {};
  skill.forEach((res) => {
    res?.days.forEach((day) => {
      if (!groupedSkills[day]) {
        groupedSkills[day] = [];
      }
      groupedSkills[day].push(res);
    });
  });

  const daysOfWeek = [
    "Dushanba",
    "Seshanba",
    "Chorshanba",
    "Payshanba",
    "Juma",
    "Shanba",
    "Yakshanba",
  ];

  return (
    <div className="skill_wrapper mt-8 p-4">
      <h1 className="text-2xl mb-4 font-medium">Dars jadvali</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {daysOfWeek.map((day) => {
          const similarGroups = groupedSkills[day];
          const classesExist = similarGroups && similarGroups.length > 0;

          return (
            <div key={day} className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-2">{day}</h2>
              {classesExist ? (
                <div className="flex flex-col space-y-4">
                  {similarGroups
                    .sort((a, b) => {
                      return (
                        new Date("1970/01/01 " + a.start_time) -
                        new Date("1970/01/01 " + b.start_time)
                      );
                    })
                    .map((res, idx) => (
                      <div
                        key={`${day}-${idx}`}
                        className="bg-gray-100 p-4 rounded-lg"
                      >
                        <h3 className="text-lg font-medium">
                          Guruh nomi: {res.group.name}
                        </h3>
                        <p className="text-sm">
                          Kurs vaqti: {res.start_time.slice(0, 5)} -{" "}
                          {res.end_time.slice(0, 5)}
                        </p>
                        <p className="text-sm">Xona: {res?.room_name}</p>
                       
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500">Darslar yo'q.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherSkilss;
