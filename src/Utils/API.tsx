import axios from "axios";

const basicURL = "http://localhost:5269";

interface SignupValues {
  email: string;
  password: string;
  nickname?: string;
}

export const signup = async (values: SignupValues) => {
  const response = await axios.post(`${basicURL}/account/register`, values);
  return response;
};
