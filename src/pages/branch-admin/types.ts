/////////////////// admin profile types ////////////////
interface User {
  id: number;
  username: string;
  roles: string;
}

interface Branch {
  id: number;
  name: string;
  address: string;
  start_at: string;
  created_at: string;
  end_at: string;
  status: boolean;
}

interface Position {
  id: number;
  name: string;
}

export interface Profile {
  id: number;
  last_name: string;
  first_name: string;
  user: User;
  branch: Branch;
  phone_number: string;
  image: string;
  salary: string;
  birthday: string;
  position: Position[];
  created_at: string;
  start_at: string;
  end_at: string;
  status: boolean;
}