import { useContext } from "react";
import { CometChatContext } from "../contexts/AuthContext";

export default function useCometChat() {
  return useContext(CometChatContext);
}
