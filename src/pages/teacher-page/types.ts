////////// Teacher payment types start //////////////
interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
}

export interface Group {
  id: string;
  name: string;
  price: string;
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
