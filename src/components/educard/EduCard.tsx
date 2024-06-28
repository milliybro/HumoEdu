import { Button } from "antd";
import "./educard.scss";
import { Link } from "react-router-dom";
import Loading from '../authLoading/Loading';

export interface EduCardProps {
  _id: string;
  id: string;
  name: string;
  price: string;
  teacher: [];
  student: [];
  science: [{ name: string }];
  branch: [];
  start_at: string;
  end_at: string;
}

const EduCard = ({
  _id,
  id,
  name,
  price,
  teacher,
  student,
  science,
  start_at,
  end_at,
}: EduCardProps) => {
  return (
    <div className="eduCard" id={_id}>
      <div className="main">
        <div className="card">
          <div>
            <h3>
              Guruh: <span> {name}</span>
            </h3>
            <h4>
              Fan: <span> {science?.name}</span>
            </h4>
            <h4>
              O'qituvchi: {" "}
              <span>
                {" "}
                {teacher?.first_name} {teacher?.last_name}{" "}
              </span>
            </h4>
            <h4>
              Kurs narxi: {price}
            </h4>
          </div>
          <div className="card-btn">
            <Button>
            <Link to={`/my-group/${id}`} type="primary">
            Guruhni ko'rish
          </Link>
          </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EduCard;
