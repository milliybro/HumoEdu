import { userInteface } from "../types";
import getData from "./data";

interface students {
  _id: string;
  name: string;
  level: string;
  description: string;
  startDate: string;
  endDate: string;
  user: null | userInteface;
  __v: number;

}

const useStudent = getData<students>("account/student-profiles/")

export default useStudent