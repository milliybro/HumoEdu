// import { userInteface } from "../types";
import getData from "./data";
// import { useAuth } from "./auth";
interface users {
  _id: string;
  last_name: string;
  first_name: string;
  phone_number: string;
  username: string;
  salary: string;

}
// const  { branchId } = useAuth();
const useUsers = getData<users>(`account/staff-profiles/`);

export default useUsers



