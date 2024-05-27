export interface userLogin {
  username: string;
  password: string;
}
export interface userRegister{
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AccordionSectionProps {
  _id: string;
  image: string;
  position: string,
  description: string,
  companyName: string,
  startDate: string, 
  endDate: string,
  workName: string
  // editing: boolean;
  onUpdate: () => void;
  onDelete: () => void;
}

export interface SkillsType{
  _id: string,
  percent: number,
  name: string,
}

export interface AccountType{
  _id: string,
  first_name: string,
  last_name: string,
}

export interface portfolioTypes{
  _id: string,
  name: string,
  paid_time: string,
  mothly: string
  price_sum: string,
}
export interface Img{
  _id: string,
  name: string,
}

export interface UserData {
  fields: string[]; 
  client: boolean;
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  createdAt: string;
  photo: string;
  address: string;
  birthday: string;
  email: string;
  facebook: string;
  github: string;
  info: string;
  instagram: string;
  phoneNumber: string;
  telegram: string;
  youtube: string;
}

export interface allMessages {
  _id: string;
  message: string;
  title: string;
  answer: string;
  show: boolean;
  whom: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
  user: string;
}

export interface PortfolioType {
  ["data"]: DataType[];
  pagination: { limit: number; page: number; next: number; total: number };
}
export interface DataType {
  photo: PhotoType;
  name: string;
  description: string;
  id: string;
  url: string;
  user: object;
  __v: number;
}

export interface PhotoType {
  _id: string;
  name: string;
  user: string;
  __v: number;
}

export interface userInteface {
  url: string;
  role: string;
  fields: string[];
  client: boolean;
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  createdAt: string;
  __v: number;
  address: string;
  birthday: string;
  email: string;
  facebook: string ,
  github:string ,
  info: string,
  instagram: string,
  phoneNumber: string,
  telegram:string ,
  youtube:string ,
  photo: string;
}