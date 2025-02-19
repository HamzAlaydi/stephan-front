import axios from "axios";
import { rootRoute } from "../Root.route";

export const validateToken = async (token) => {
  try {
    const response = await axios.get(`${rootRoute}/auth/validate`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.valid; // Returns true if the token is valid
  } catch (error) {
    console.error("Token validation failed:", error);
    return false;
  }
};
