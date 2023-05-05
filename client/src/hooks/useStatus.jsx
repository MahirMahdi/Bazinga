import { useContext } from "react";
import { StatusContext } from "../contexts/AuthContext";

export default function useStatus() {
  return useContext(StatusContext);
}
