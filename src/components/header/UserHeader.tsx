import { Link} from "react-router-dom";
// import { toast } from "react-toastify";
import { useAuth } from "../../states/auth";
import { useCallback, useEffect, useState } from "react";
import { request } from "../../request";


import avatar from "../../assets/avatar-svgrepo-com.svg";


const UserHeader = () => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [unansweredMessages, setUnansweredMessages] = useState(0);
  const { teacherId } = useAuth();
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
      const res = await request(`/account/student-profile/${teacherId}/`);
      setUserInfo(res.data);
      const { pagination } = res.data;
      setUnansweredMessages(pagination.total);
    } catch (err) {
      // toast.error("Failed to get unanswered messages");
    }
  }, [teacherId]);


  const controlDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  

  const getData = async () => {
    try {
      const res = await request.get(`/account/student-profile/${teacherId}/`);
      setUserData(res.data);
    } catch (err) {
      // toast.error("Failed to get user data");
    }
  };
  
  

  useEffect(() => {
    getData();
    unresponseMessages()
  }, [unresponseMessages, unansweredMessages]);
  return (
    <header className="w-full lg:w-5/6 mx-auto bg-white h-20 p-2 px-24 fixed top-0 z-10">
      <div className="flex justify-between items-center h-full">
        <div className="font-medium">Student</div>
        <div className="account">
          <Link
            to="/account"
            className="accountim"
            onClick={controlDropdown}
            title="profile"
          >
            <img
              className="account__img w-14 h-14 rounded-full"
              src={userInfo.image ? userInfo.image : avatar}
              alt="icon"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
