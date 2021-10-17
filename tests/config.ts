import { Framework } from "../src/framework";
import { Framework as IFramework } from "../types";
import axios from "axios";
import Vue from "vue";

interface User {
  id: number;
  name: string;
  email: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  auth: {
    type: string;
    token: string;
  };
  user: User;
}

interface LogoutResponse {
  revoked: boolean;
}

const apiUrl = "http://127.0.0.1:3333";

const http = axios.create({
  baseURL: apiUrl,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token") || "";

  if (!config.headers) config.headers = {};

  const auth = config.headers["Authorization"];

  if (!auth) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export const loginData = {
  email: "everton@andrade.mat.br",
  password: "123456",
};

export const getAuthFramework = (): IFramework<
  LoginData,
  LoginResponse,
  User,
  LogoutResponse,
  User
> =>
  new Framework(Vue, {
    axios: http,
  });
