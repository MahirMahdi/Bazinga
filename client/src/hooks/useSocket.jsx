import { useContext } from "react";
import { SocketContext } from "../contexts/AuthContext";

export default function useSocket() {
  return useContext(SocketContext);
}
