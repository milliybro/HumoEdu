////////// Teacher payment types start //////////////
interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
}

export interface Group {
  id: number;
  name: string;
  teacher: Teacher;
  sub_teacher: string | null;
  science: string;
}

export interface Portfolio {
  id: number;
  price_sum: string;
  teacher: Teacher;
  group: Group;
  paid_time: string;
  from_date: string;
  to_date: string;
}

////////// Teacher payment types end //////////////

/////////////Teacher attendance types start ///////////////




export  interface Schedule {
  id: number;
  start_time: string;
  end_time: string;
  room: number;
  room_name: string;
  days: string[];
  group: Group;
}

export interface Student {
  id: number;
  last_name: string;
  first_name: string;
  user: number;
  branch: number;
  phone_number1: string;
  phone_number2: string;
  image: string;
  birthday: string;
  start_at: string | null;
  end_at: string | null;
  status: boolean;
  is_debtor: string;
}
/////////////Teacher attendance types end///////////////
/////////////// Teacher profile types start ///////////////
export interface TeacherProfile{
  id: number;
  last_name: string;
  first_name: string;
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
    end_at: string;
    status: boolean;
  };
  phone_number: string;
  image: string;
  salary: string;
  birthday: string;
  position: {
    id: number;
    name: string;
  }[];
  created_at: string;
  start_at: string;
  end_at: string;
  status: boolean;
}

/////////////// Teacher profile types end ///////////////
