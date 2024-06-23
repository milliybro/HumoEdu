import { useAuth } from "../../states/auth";
import Modal from "antd/es/modal/Modal";
import { useNavigate } from "react-router-dom";
type HeaderProps = {
  avatarUrl: string;
  teacherName: string;
};

const TeacherHeader: React.FC<HeaderProps> = ({ avatarUrl, teacherName }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className=" w-100 ml-48 bg-white shadow-md p-2 flex items-center justify-between">
      <div className="flex items-center p-1">
        <img
          src={avatarUrl}
          alt="Teacher Avatar"
          className="w-10 h-10 rounded-full mr-4"
        />
        <span className="text-lg font-medium text-gray-700">{teacherName}</span>
      </div>
      <div>
        <button className="border border-gray-400 text-lg font-medium text-gray-700  px-4 py-1 rounded mr-2 hover:bg-gray-400 hover:text-white">
          Profile
        </button>
        <button className="border border-gray-400 text-lg font-medium text-gray-700 px-4 py-1 rounded hover:bg-gray-400 hover:text-white"
                  onClick={() =>Modal.confirm({
                      title: "Do you want to log out ?",
                      onOk: () => logout(navigate),
                    })
                  }
                >
                  logout
        </button>
      </div>
    </header>
  );
};

export default TeacherHeader;
