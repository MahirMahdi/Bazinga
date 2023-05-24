import useAuth from "./useAuth";
import axios from "../api/axios";

export default function useRefreshToken() {
  const { setUser } = useAuth();

  async function refresh() {
    const response = await axios.get("/refresh", {
      withCredentials: true,
    });

    setUser((prev) => {
      return {
        ...prev,
        user: response.data.user,
        accessToken: response.data.accessToken,
      };
    });

    return response.data.accessToken;
  }

  return refresh;
}
