import { userInteface } from "../types";
import getData from "./data";

interface skill {
  _id: string;
  name: string;
  percent: number;
  user: null | userInteface;
  __v: number;
}

const useSkills = getData<skill>("/group/sciences/");

export default useSkills;