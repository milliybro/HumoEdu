import { useCallback, useState, useEffect } from "react";
import { request } from "../../../request";
import { portfolioTypes } from "../../../types";
import { useAuth } from "../../../states/auth";
import { toast } from "react-toastify";
import "./portfolios.scss";
import paymentIcon from "../../../assets/paymentPage.png";
import MonthComponent from "./../../../components/month/monthComponents";

const Portfolios = () => {
  const [portfolioData, setPortfolioData] = useState<portfolioTypes[]>([]);
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();

  const getPortfolios = useCallback(async () => {
    try {
      setLoading(true);
      const res = await request.get(`account/payments/`);
      setPortfolioData(res.data.results);
    } catch (err) {
      toast.error("Failed to get portfolio data");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    getPortfolios();
  }, [getPortfolios]);
  interface Cash {
  paid_time: string;
  mothly: number;
  price_sum: number;
  // Add more properties if necessary
}

  return (
    <section>
      <div className="payments">
        <div className={`${loading ? "" : "portfolio_wrapper"}`}>
          <h2 className="title">To'lovlar tarixi</h2>
          <div className="payment-page">
            <div className="payment-row">
              {portfolioData.map((res) => (
                <PortfolioCard key={res._id} cash={res} />
              ))}
            </div>
            <div>
              <img src={paymentIcon} alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const PortfolioCard = ({ cash }) => {
  const dateObj = new Date(cash.paid_time);
  const formattedDate = `${dateObj.getDate()}/${
    dateObj.getMonth() + 1
  }/${dateObj.getFullYear()} ${dateObj.getHours()}:${dateObj.getMinutes()}`;

  const cashInfo = { monthly: cash.mothly };
  return (
    <>
    <div className="card">
      <div className="content">
        <div className="month-date">
          <MonthComponent monthly={cashInfo.monthly} />
          <h5 className="category">{formattedDate}</h5>
        </div>
        <span className="title">+{cash.price_sum} so'm</span>
      </div>
    </div>
      <div className="paymentLine"></div>
    </>
  );
};

export default Portfolios;
