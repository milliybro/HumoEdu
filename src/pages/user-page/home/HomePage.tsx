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
        <div className="container mx-auto px-4">
          <div className="nav__wrapper flex justify-between items-center py-4">
            <div className="first__nav">
              <h1 className="hero_name text-lg md:text-2xl cursor-pointer">
                <Link to="#">Xush kelibsiz, {userData?.first_name}!</Link>
              </h1>
              <h4 className="text-sm md:text-base mb-6">
                Talabalar portalida doimo ma'liumotlaringizni bilib turing
              </h4>
            </div>
            <div className="second__nav hidden md:block">
              <div className="flex">
                <img className="centreStudentLeft w-8" src={centreStudentLeft} alt="image" />
                <img className="centreStudent w-8" src={centreStudent} alt="image" />
                <img className="centreStudentRight w-8" src={centreStudentRight} alt="image" />
              </div>
            </div>
          </div>
       </div>
      </header>
    </Fragment>
  );
};

export default HomePage;
