import { userInteface } from "../types";
import getData from "./data";

interface experiences {
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

const useGroup = getData<experiences>("group/groups/")

export default useGroup