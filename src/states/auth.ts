import { NavigateFunction } from "react-router-dom";
import { create } from "zustand";
import Cookies from "js-cookie";
import { userLogin, userRegister } from "../types";
import {
  ROLE,
  TOKEN,
  USERID,
  USERNAME,
  BRANCHID,
  TEACHERID,
  REFRESH_TOKEN,
} from "../constants";
import { request } from "../request";
import { toast } from "react-toastify";

type AuthTypes = {
  isAuthenticated: boolean;
  login: (data: userLogin, navigate: NavigateFunction) => void;
  logout: (navigate: NavigateFunction) => void;
  register: (data: userRegister, navigate: NavigateFunction) => void;
  refreshAccessToken: () => void;
  userId: string;
  role: string | null;
  username: string | null;
  branchId: string | null;
  teacherId: string | null;
};

export const useAuth = create<AuthTypes>((set, get) => ({
  isAuthenticated: Cookies.get(TOKEN) ? true : false,
  userId: Cookies.get(USERID) || "",
  role: Cookies.get(ROLE) || "",
  username: Cookies.get(USERNAME) || "",
  branchId: Cookies.get(BRANCHID) || "",
  teacherId: Cookies.get(TEACHERID) || "",

  login: async (data, navigate) => {
    function isTokenExpired(accessToken: string) {
      const arrayToken = accessToken.split(".");
      const tokenPayload = JSON.parse(atob(arrayToken[1]));
      return tokenPayload;
    }

    try {
      const res = await request.post("account/login/", data);
      toast.success("Hisobga muvaffaqiyatli kirildi");

      const tokenUser = isTokenExpired(res.data.access);

      Cookies.set(TOKEN, res.data.access);
      Cookies.set(REFRESH_TOKEN, res.data.refresh);
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
  },

  refreshAccessToken: async () => {
    try {
      const refresh = Cookies.get(REFRESH_TOKEN);
      if (refresh) {
        const res = await request.post("account/refresh/", { refresh });
        const AccessToken = res.data.access;
        Cookies.set(TOKEN, AccessToken);
        set({ isAuthenticated: true });
      } else {
         const allCookies = document.cookie.split(";");
         allCookies.forEach((cookie) => {
           const cookieName = cookie.split("=")[0].trim();
           Cookies.remove(cookieName, { path: "/" });
         });
      }

    } catch (err) {
      toast.error("Session expired. Please login again.");
      set({ isAuthenticated: false });
      console.log(err);
    }
  },

  logout: (navigate) => {
    const allCookies = document.cookie.split(";");
    allCookies.forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      Cookies.remove(cookieName, { path: "/" });
    });

    set({ isAuthenticated: false });
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



  
