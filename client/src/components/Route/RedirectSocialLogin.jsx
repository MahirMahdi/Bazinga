import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function SocialLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, []);

  return <></>;
}
