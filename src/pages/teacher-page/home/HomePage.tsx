import { Fragment, useCallback, useEffect, useState } from "react";
import { request } from "../../../request";
import { Link, NavLink } from "react-router-dom";
import close_icon from "../../../assets/default-page-icons/close.png";
import "./style.scss";
import { IMG_URL, USERID } from "../../../constants";
// import useSkillsStore from "../../../states/skillData";
import useExperiencesStore from "../../../states/experience";
import useEducationStore from "../../../states/education";
import { useAuth } from "../../../states/auth";
import centreStudent from "../../../assets/centreStudent.png";
import centreStudentLeft from "../../../assets/centreStudentLeft.png";
import centreStudentRight from "../../../assets/centreStudentRight.png";
import TodayLessons from "../../../components/todayLessons";
import { toast } from "react-toastify";

const TeacherHomePage = () => {
  const [top, setTop] = useState(false);
  const [skill, setSkill] = useState<SkillsType[]>([]);
  const [menuControl, setMenuControl] = useState(false);
  const [img, setImg] = useState("");
  //   const { skills, fetchSkills } = useSkillsStore();
  //   const [loading, setLoading] = useState(false);
  //   const experiences = useExperiencesStore((state) => state.experiences);
  //   const education = useEducationStore((state) => state.education);
  const fetchEducation = useEducationStore((state) => state.fetchEducation);
  const fetchExperiences = useExperiencesStore((state) => state.fetchExperiences);
  //   console.log(fetchSkills);

  const toggleNavbar = () => setTop(!top);

  const [userData, setUserData] = useState({
    birthday: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    first_name: "",
  });
  const { userId } = useAuth();

  const getProfile = async () => {
    try {
      // setLoading(true);
      const res = await request.get(`/account/staff-profiles/?user=${userId}`);
      setUserData(res.data);

      setImg(res.data.photo);
      // setAllMessages(res.data.data);
      // setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const getSchedules = async () => {
    try {
      const res = await request.get(`group/lessonchedules/`);
      setUserData(res.data);
      setImg(res.data.photo);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getSchedules;
  }, [getSchedules]);

  useEffect(() => {
    getProfile();
  }, []);

  const toggleMenu = () => setMenuControl(!menuControl);

  //   About
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const dob = new Date(birthDate);

    const yearsDiff = today.getFullYear() - dob.getFullYear();

    let age = "";

    if (yearsDiff > 0) {
      age += `${yearsDiff} y.o.`;
    }

    return age.trim();
  };

  useEffect(() => {
    getProfile();
    fetchEducation();
    fetchExperiences();
  }, [fetchExperiences, fetchEducation]);

  const [weekday, setWeekday] = useState("");

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const weekdays = ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];
    setWeekday(weekdays[dayOfWeek]);
  }, []);

  const Announcement = ({ message }) => (
    <div className="announcement">
      <p>{message}</p>
      <button>Join</button>
    </div>
  );

  const LeaderBoard = () => {
    const leaders = [
      { name: "Shyam Nithin", score: 60 },
      { name: "Nivin Kumar", score: 58 },
      { name: "Nivetha Dinesh", score: 50 },
      { name: "Rudhra Shankar", score: 49 },
    ];

    return (
      <div className="leader-board">
        <h2>Leader board</h2>
        {leaders.map((leader, index) => (
          <div key={index} className="leader">
            <span>{leader.name}</span>
            <span>{leader.score}</span>
          </div>
        ))}
      </div>
    );
  };

  const CompletionProgress = () => {
    const progress = [
      { subject: "Organic Chemistry", chapter: "Chapter 1", percentage: 70 },
      { subject: "States of matter", chapter: "Chapter 2", percentage: 50 },
      { subject: "Solutions", chapter: "Chapter 3", percentage: 30 },
      { subject: "Chemical changes", chapter: "Chapter 4", percentage: 80 },
    ];

    return (
      <div className="completion-progress">
        <h2>Completion progress</h2>
        {progress.map((item, index) => (
          <div key={index} className="progress-item">
            <span>
              {item.subject} ({item.chapter})
            </span>
            <progress value={item.percentage} max="100"></progress>
          </div>
        ))}
      </div>
    );
  };

  const Assignments = () => {
    const assignments = [
      { subject: "Chemistry", task: "Chapter 5", page: 10, time: "11:00 AM", status: "Pending" },
      { subject: "Physics", task: "Chapter 4", page: 18, time: "11:40 AM", status: "Pending" },
      { subject: "Biology", task: "Chapter 2", page: 12, time: "10:00 AM", status: "Completed" },
    ];

    return (
      <div className="assignments">
        <h2>Assignments</h2>
        {assignments.map((assignment, index) => (
          <div key={index} className={`assignment ${assignment.status.toLowerCase()}`}>
            <span>
              {assignment.subject} ({assignment.task})
            </span>
            <span>Page {assignment.page}</span>
            <span>{assignment.time}</span>
            <span>{assignment.status}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="home-main container">
      <div className="App">
        <Announcement message="Salom" />
        <div className="dashboard">
          <LeaderBoard />
          <CompletionProgress />
          <Assignments />
        </div>
      </div>
      <div className="schedule-table">
        <h2>June 2024</h2>
        <div>
          <button>dushanba 10</button>
          <button>dushanba 10</button>
          <button>dushanba 10</button>
          <button>dushanba 10</button>
        </div>
        <h2>schedule   see all</h2>
        <div>
          <p>1 | matematika 18:00-20:00</p>
          <p>1 | matematika 18:00-20:00</p>
          <p>1 | matematika 18:00-20:00</p>
          <p>1 | matematika 18:00-20:00</p>

        </div>
      </div>
      <div className="mobile_menue_modal" style={{ display: `${menuControl ? "" : "none"}` }}>
        <button onClick={toggleMenu} className="close_btn">
          <img src={close_icon} alt="" />
        </button>
        <ul>
          <li onClick={toggleNavbar}>
            <NavLink onClick={toggleMenu} to={"/"}>
              Home
            </NavLink>
          </li>
          <li onClick={toggleMenu}>
            <NavLink to={"/about"}>About</NavLink>
          </li>
          <li onClick={toggleMenu}>
            <NavLink to={"/resume"}>Resume</NavLink>
          </li>
          <li onClick={toggleMenu}>
            <NavLink to={"/portfolio"}>Portfolio</NavLink>
          </li>
          <li onClick={toggleMenu}>
            <NavLink to={"/contact"}>Contact</NavLink>
          </li>
        </ul>
      </div>
      <section id="about" className="about">
        <div className="schedule-home"></div>
      </section>
    </div>
  );
};

export default TeacherHomePage;
