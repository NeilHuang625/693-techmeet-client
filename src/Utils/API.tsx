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

export const refreshToken = async (jwt: string) => {
  const response = await axios.post(
    `${basicURL}/account/refresh-token`,
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

export const upgradeToVIP = async (jwt: string | null) => {
  const response = await axios.post(
    `${basicURL}/account/upgrade-to-vip`,
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

// Get Categories
export const getAllCategories = async () => {
  const response = await axios.get(`${basicURL}/category`);
  return response;
};

// Create Event
export const createEvent = async (event: any, jwt: string) => {
  const response = await axios.post(`${basicURL}/event`, event, {
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Cache-Control": "no-cache",
    },
  });
  return response;
};

// Get All Events
export const getAllEvents = async () => {
  const response = await axios.get(`${basicURL}/event`);
  return response;
};
