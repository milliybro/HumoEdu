import { userInteface } from "../types";
import getData from "./data";

interface schedule {
  _id: string;
  name: string;
  level: string;
  description: string;
  startDate: string;
  endDate: string;
  user: null | userInteface;
  __v: number;

}
const scheduleId = localStorage.getItem("scheduleId");
const useSchedule = getData<schedule>(`group/lessonschedules/`)

export default useSchedule