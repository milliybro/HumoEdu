import { userInteface } from "../types";
import getData from "./data";

interface portfolios {
  _id: string;
  name: string;
  level: string;
  description: string;
  startDate: string;
  endDate: string;
  url: string;
  user: null | userInteface;
  __v: number;

}

const usePortfolios = getData<portfolios>("/branch/branches/")

export default usePortfolios