export interface Student {
  id: number;
  last_name: string;
  first_name: string;
  balance: string;
  user: {
    id: number;
    username: string;
    roles: string;
  };
  branch: {
    id: number;
    name: string;
    address: string;
    start_at: string;
    created_at: string;
    end_at: string | null;
    status: boolean;
  };
  group: {
    id: number;
    name: string;
  }[];
  phone_number1: string;
  phone_number2: string;
  birthday: string;
  image: string;
  created_at: string;
  start_at: string;
  end_at: string | null;
  status: boolean;
}
