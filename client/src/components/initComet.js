import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import useInitComet from "../hooks/useInitComet";
import useCometChat from "../hooks/useCometChat";

export default function InitComet(){
    const [loading,setLoading] = useState(true);

    //state of initialization
    const {init} = useCometChat();

    //hook for initializing cometchat
    const initComet = useInitComet();

    //verifies whether the cometchat has been initialized or not
    useEffect(()=>{
        async function initializeCometChat(){
            try{
                await initComet();
            }catch(err){
                return err;
            }finally{
                setLoading(false);
            }
        }

        !init? initializeCometChat(): setLoading(false);
    },[])

    return(
        <>
        {loading?
            <div>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={true}
                >
                <CircularProgress color="inherit" />
                </Backdrop>
            </div>
            :<Outlet/>
        }
    </>
    )
}