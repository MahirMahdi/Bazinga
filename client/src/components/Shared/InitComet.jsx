import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Loading from "./Loading";
import useCometChat from "../../hooks/useCometChat";
import useInitComet from "../../hooks/useInitComet";

export default function InitComet() {
  const [loading, setLoading] = useState(true);

  //state of initialization
  const { init } = useCometChat();

  //hook for initializing cometchat
  const initComet = useInitComet();

  //verifies whether the cometchat has been initialized or not
  useEffect(() => {
    async function initializeCometChat() {
      try {
        await initComet();
      } catch (err) {
        return err;
      } finally {
        setLoading(false);
      }
    }

    !init ? initializeCometChat() : setLoading(false);
  }, []);

  return <>{loading ? <Loading /> : <Outlet />}</>;
}
