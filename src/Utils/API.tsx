import axios from "axios";

const basicURL = "http://localhost:5269";

interface SignupUser {
  email: string;
  password: string;
  nickname?: string;
}

export const signup = async (user: SignupUser) => {
  const response = await axios.post(`${basicURL}/account/register`, user);
  return response;
};

export const logout = async (jwt: string) => {
  const response = await axios.post(
    `${basicURL}/account/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Cache-Control": "no-cache",
      },
    }
  );
  return response;
};

export const login = async (user: SignupUser) => {
  const response = await axios.post(`${basicURL}/account/login`, user);
  return response;
};

export const getUserInfo = async (jwt: string) => {
  const response = await axios.post(
    `${basicURL}/account/user-info`,
    {},
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Cache-Control": "no-cache",
      },
    }
  );
  return response;
};
