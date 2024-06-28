import { NavigateFunction } from "react-router-dom";
import { create } from "zustand";
import Cookies from "js-cookie";
import { userLogin, userRegister } from "../types";
import { ROLE, TOKEN, USERID, USERNAME, BRANCHID ,TEACHERID} from "../constants";
import { request } from "../request";
import { toast } from "react-toastify";

type AuthTypes = {
  isAuthenticated: boolean;
  login: (data: userLogin, navigate: NavigateFunction) => void;
  logout: (navigate: NavigateFunction) => void;
  register: (data: userRegister, navigate: NavigateFunction) => void;
  userId: string;
  role: string | null;
  username:string | null;
  branchId:string | null;
  teacherId:string | null;
};

export const useAuth = create<AuthTypes>((set, get) => ({
  isAuthenticated: Cookies.get(TOKEN) ? true : false,
  userId: Cookies.get(USERID) || "",
  role: Cookies.get(ROLE) || "",
  username:Cookies.get(USERNAME) || "",
  branchId:Cookies.get(BRANCHID) || "",
  teacherId:Cookies.get(TEACHERID) || "",
  login: async (data, navigate) => {
    function isTokenExpired(accessToken: string) {
      const arrayToken = accessToken.split(".");
      const tokenPayload = JSON.parse(atob(arrayToken[1]));
      return tokenPayload;
    }
    try {
      const res = await request.post("account/login/", data);
      toast.success("Hisobga muvaffaqiyatli kirildi");
      isTokenExpired(res.data.access);
      const tokenUser = isTokenExpired(res.data.access);

      console.log(tokenUser.roles, "auth role");

      Cookies.set(TOKEN, res.data.access);
      Cookies.set(USERID, tokenUser.user_id);
      Cookies.set(ROLE, tokenUser.roles);
      Cookies.set(USERNAME, tokenUser.username);
      Cookies.set(BRANCHID, tokenUser.branch);
      Cookies.set(TEACHERID, tokenUser.profile);
      set({
        isAuthenticated: true,
        role: tokenUser.roles,
        userId: tokenUser.user_id,
      });

      if (get().role === "admin") {
        navigate("/branchDashboard");
      } else if (get().role === "student") {
        navigate("/home");
      } else if (get().role === "superadmin") {
        navigate("/dashboard");
      } else if (get().role === "teacher") {
        navigate("/teacher-home");
      } else {
        navigate("/home");
        console.log("other");
      }
    } catch (err) {
      toast.error("Parol yoki username xato!");
      console.log(err);
    }
    window.location.reload();

  },
 logout: (navigate) => {
    // Barcha cookie nomlarini olish
    const allCookies = document.cookie.split(';');
    
    // Har bir cookie'ni o'chirish
    allCookies.forEach(cookie => {
        const cookieName = cookie.split('=')[0].trim();
        Cookies.remove(cookieName, { path: '/' });
    });

    // Auth state yangilash
    set({ isAuthenticated: false });

    // Navigatsiya qilish
    navigate("/");
  },
  register: async (data, navigate) => {
    try {
      const res = await request.post("auth/register", data);
      Cookies.set(TOKEN, res.data.token);
      set({ isAuthenticated: true });
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  },
}));
