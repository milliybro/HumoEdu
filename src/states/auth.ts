import { NavigateFunction } from "react-router-dom";
import { create } from "zustand";
import Cookies from "js-cookie";
import { userLogin, userRegister } from "../types";
import { ROLE, TOKEN, USERID } from "../constants";
import { request } from "../request";

type AuthTypes = {
  isAuthenticated: boolean;
  login: (data: userLogin, navigate: NavigateFunction) => void;
  logout: (navigate: NavigateFunction) => void;
  register: (data: userRegister, navigate: NavigateFunction) => void;
  userId: string;
  role: string | null;
};

export const useAuth = create<AuthTypes>((set, get) => ({
  isAuthenticated: Cookies.get(TOKEN) ? true : false,
  userId: Cookies.get(USERID) || "",
  role: Cookies.get(ROLE) || "",
  login: async (data, navigate) => {
    try {
      const res = await request.post("account/login/", data);
      
      function isTokenExpired(accessToken: string) {
        const arrayToken = accessToken.split(".");
        const tokenPayload = JSON.parse(atob(arrayToken[1]));
        return tokenPayload;
      }
      isTokenExpired(res.data.access);
      const tokenUser = isTokenExpired(res.data.access);

      console.log(tokenUser.roles, "auth role");

      Cookies.set(TOKEN, res.data.access);
      Cookies.set(USERID, tokenUser.user_id);
      Cookies.set(ROLE, tokenUser.roles);

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
      } else if (get().role === "admin") {
        navigate("/branchDashboard");
      } else if (get().role === "teacher") {
        navigate("/teacher-home");
      } else {
        navigate("/home");
        console.log("other");
      }
    } catch (err) {
      console.log(err);
    }
  },
  logout: (navigate) => {
    Cookies.remove(TOKEN);
    Cookies.remove(USERID);
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
