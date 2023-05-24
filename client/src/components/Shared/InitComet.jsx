import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Loading from "./Loading";
import useCometChat from "../../hooks/useCometChat";
import useInitComet from "../../hooks/useInitComet";

export default function InitComet() {
  const [loading, setLoading] = useState(true);
  const { init } = useCometChat();
  const initComet = useInitComet();

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
