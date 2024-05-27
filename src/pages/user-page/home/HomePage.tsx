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

const HomePage = () => {
  const [top, setTop] = useState(false);
  const [skill, setSkill] = useState<SkillsType[]>([]);
  const [menuControl, setMenuControl] = useState(false);
  const [img, setImg] = useState("");
  //   const { skills, fetchSkills } = useSkillsStore();
  //   const [loading, setLoading] = useState(false);
  //   const experiences = useExperiencesStore((state) => state.experiences);
  //   const education = useEducationStore((state) => state.education);
  const fetchEducation = useEducationStore((state) => state.fetchEducation);
  const fetchExperiences = useExperiencesStore(
    (state) => state.fetchExperiences
  );
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

  const getData = async () => {
    try {
      // setLoading(true);
      const res = await request.get(`/account/student-profile/${userId}/`);
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
  console.log(skill, "s");

  useEffect(() => {
    getSchedules;
  }, [getSchedules]);

  useEffect(() => {
    getData();
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
    getData();
    fetchEducation();
    fetchExperiences();
  }, [fetchExperiences, fetchEducation]);

  const [weekday, setWeekday] = useState("");

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const weekdays = [
      "Yakshanba",
      "Dushanba",
      "Seshanba",
      "Chorshanba",
      "Payshanba",
      "Juma",
      "Shanba",
    ];
    setWeekday(weekdays[dayOfWeek]);
  }, []);

  return (
    <Fragment>
      <header id="header" className={`${top ? "header-top" : null}`}>
        <div className="container">
          <div className="nav__wrapper">
            <div className="first__nav">
              <h1 className="hero_name" onClick={toggleNavbar}>
                <Link to={"#"}>Xush kelibsiz, {userData?.first_name}!</Link>
              </h1>
              <h4>
                Talabalar portalida doimo ma'liumotlaringizni bilib turing
              </h4>
            </div>
            <div className="second__nav">
              <div>
                <img
                  className="centreStudentLeft"
                  src={centreStudentLeft}
                  alt=""
                />
                <img className="centreStudent" src={centreStudent} alt="" />
                <img
                  className="centreStudentRight"
                  src={centreStudentRight}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </header>
      <div
        className="mobile_menue_modal"
        style={{ display: `${menuControl ? "" : "none"}` }}
      >
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
    </Fragment>
  );
};

export default HomePage;
