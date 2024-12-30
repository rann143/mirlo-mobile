import * as api from "./fetch/fetchWrapper";

type LoginBody = {
  email: string;
  password: string;
};

async function login(body: LoginBody) {
  await api.post("/auth/login", body);
}
