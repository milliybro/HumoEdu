import { userInteface } from "../types";
import getData from "./data";

interface payments {
  id: string;
  name: string;
  level: string;
  description: string;
  startDate: string;
  endDate: string;
  url: string;
  user: null | userInteface;
  __v: number;
  date: string;

}

const usePayments = getData<payments>("account/payments/")

export default usePayments