import { Button } from "antd";
import "./educard.scss";
import { Link } from "react-router-dom";

export interface EduCardProps {
  _id: string;
  id: string;
  name: string;
  price: string;
  staff: [];
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
  staff,
  student,
  science,
  branch,
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
              O'qituvchi{" "}
              <span>
                {" "}
                {staff[0].first_name} {staff[0].last_name}{" "}
              </span>
            </h4>
          </div>
          <div className="card-btn">
            <Button>
            <Link to={`/my-groups/${id}`} type="primary">
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
