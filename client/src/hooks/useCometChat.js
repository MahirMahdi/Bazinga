import { useContext } from "react";
import { CometChatContext } from "../contexts/authContext";

export default function useCometChat(){
    return useContext(CometChatContext);
}
