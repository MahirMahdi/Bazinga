import { useContext } from "react";
import { SocketContext } from "../contexts/authContext";

export default function useSocket(){
    return useContext(SocketContext);
}