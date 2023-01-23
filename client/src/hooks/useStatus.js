import { useContext } from "react";
import { StatusContext } from "../contexts/authContext";

export default function useStatus(){
    return useContext(StatusContext);
}