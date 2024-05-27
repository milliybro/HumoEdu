import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../states/auth";
import { useCallback, useEffect, useState } from "react";
import { request } from "../../request";
import { IMG_URL, USERID } from "../../constants";


import bell from "../../assets/bell.png";
import avatar from "../../assets/avatar-svgrepo-com.svg";
import search from "../../assets/search-icon.png";

import "./Header.scss";

const TeacherHeader = () => {
  const navigate = useNavigate()
  const [openDropdown, setOpenDropdown] = useState(false);
  const [unansweredMessages, setUnansweredMessages] = useState(0);
  const { userId } = useAuth();
  const [userInfo, setUserInfo] = useState({
    last_name: "",
    first_name: "",
    user: {
      id: 1,
      username: "",
      password: "",
      roles: "",
      is_active: true,
      is_staff: false,
      is_superuser: false
    },
    branch: "",
    phone_number1: "",
    phone_number2: "",
    image: "",
    start_at: "",
    end_at: null,
  })
  const [userData, setUserData] = useState({
    birthday: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    email: "",
    info: "",
    photo: "",
  });

  const unresponseMessages = useCallback(async () => {
    try {
      const res = await request(
        `/account/staff-profiles/?user=${userId}`
      );
      setUserInfo(res.data.results[0])      
      const { pagination } = res.data;
      setUnansweredMessages(pagination.total)      
    } catch (err) {
      // toast.error("Failed to get unanswered messages");
    } 
  }, [userId]);


  const controlDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const { logout } = useAuth();
  const handleLogout = () => {
    if (confirm("Are you sure you want to log")) {
      logout(navigate);
      navigate('/login')
    }
  };

  const getData = async () => {
    try {
      const res = await request.get(`/account/student-profiles/?user=${userId}`);
      setUserData(res.data);
    } catch (err) {
      // toast.error("Failed to get user data");
    }
  };
  
  console.log(getData);
  

  useEffect(() => {
    getData();
    unresponseMessages()
  }, [unresponseMessages, unansweredMessages]);
  return (
    <header className="header">
      <span className="piece-of"></span>
      <div className="admin__container">
        <div className="main__search poppins-medium">
        Student 
        </div>
        <div className="account">
          <Link to={"/account"} className="accountim" onClick={controlDropdown}>
            <img className="account__img" src={userInfo.image ? userInfo.image : avatar} alt="icon" />
           
           <div>
             <h4>{userInfo?.first_name} {userInfo?.last_name}</h4>
            <h6>{userInfo.user.roles}</h6>
            </div>
          </Link>
          {/* <div
            className={openDropdown ? "user_dropdown open" : "user_dropdown"}
          >
            <ul>
              <li>
                <Link to={"/about"}>
                    View Profile
                </Link>
              </li>
              <li>
                <Link to={"/account"}>
                  Account
                </Link>
              </li>
              <li>
                <Link to={"/settings"}>
                  Settings
                </Link>
              </li>

            </ul>
            <div className="line"></div>
            <div className="logout">
              <button onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </header>
  );
};

export default TeacherHeader;
