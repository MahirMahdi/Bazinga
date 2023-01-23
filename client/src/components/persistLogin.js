import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function PersistLogin(){
    
    const [isLoading, setIsLoading] = useState(true);

    //refresh token hook
    const refresh = useRefreshToken();

    const {user} = useAuth();

    //verifies whether the access token has been expired or not
    useEffect(()=>{
        const verifyRefreshToken = async()=>{
            try{
                await refresh()
            }catch(err){
                return err;
            }
            finally{
                setIsLoading(false);
            }
        }

        !user?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    },[])

    return(
        <>
            {isLoading?
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
