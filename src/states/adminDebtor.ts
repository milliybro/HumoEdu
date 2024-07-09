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

const usePaymentsStudents = getData<payments>("account/payments/?is_student=true");

export default usePaymentsStudents;
