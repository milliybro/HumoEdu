import { userInteface } from "../types";
import getData from "./data";
interface students {
  _id: number;
  name: string;
  level: string;
  description: string;
  startDate: string;
  endDate: string;
  user: null | userInteface;
  __v: number;
}

const useDebtorStudent = getData<students>("account/debtor-student-profiles/");

export default useDebtorStudent;
