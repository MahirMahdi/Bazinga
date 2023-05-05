import axios from "../api/axios";

export default function useLogout() {
  const logout = async () => {
    try {
      await axios.post("/logout", {}, { withCredentials: true });
    } catch (err) {
      console.log(err);
    }
  };

  return logout;
}
