import { useAuth } from "../../states/auth";
import Modal from "antd/es/modal/Modal";
import { useNavigate} from 'react-router-dom';
type HeaderProps = {
  avatarUrl: string;
  teacherName: string;
};

const TeacherHeader: React.FC<HeaderProps> = ({ avatarUrl, teacherName }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
   
  return (
    <header className="w-100 fixed top-0 left-0 right-0 bg-[#e4f5e8] shadow-md p-4 flex items-center justify-between z-50 ml-48">
      <div className="flex items-center p-1 "></div>

      <div>
        <button
          className="border border-gray-400 text-lg font-medium text-gray-700 px-4 py-1 rounded hover:bg-gray-400 hover:text-white"
          onClick={() =>
            Modal.confirm({
              title: "Do you want to log out?",
              onOk: () => logout(navigate),
            })
          }
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default TeacherHeader;
