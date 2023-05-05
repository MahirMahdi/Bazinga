import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Bazinga from "../assets/bazinga.png";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  //login error
  const [error, setError] = useState();

  //login info
  const [formData, setFormData] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  // handle login
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("/login", formData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      const userDetails = await response.data;
      setUser(userDetails);
      setIsLoading(false);
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (err) {
      setError(err.response.data.message);
    }
  }

  useEffect(() => {
    setError(null);
    setFormData({
      email: email,
      password: password,
    });
    if (email && password) {
      setButtonDisabled(false);
    }
  }, [email, password]);

  return (
    <>
      {isLoading ? (
        <div>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      ) : (
        <div className="login">
          <div className="login-components">
            <img className="logo" src={Bazinga} alt="logo" />
            <form onSubmit={handleSubmit}>
              {error && <p className="error-text">{error}</p>}
              <input
                type="email"
                className="input-field"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <input
                type="password"
                className="input-field"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <button
                type="submit"
                className="submit-button"
                disabled={buttonDisabled}
              >
                Login
              </button>
            </form>
            <a href={`${import.meta.env.VITE_CLIENT_URL}/signup`}>
              <p className="signup-text">
                Don't have an account? Click here to Signup.
              </p>
            </a>
          </div>
          <div className="login-options-container">
            <div className="divider">
              <div className="half-divider"></div>
              <p>OR</p>
              <div className="half-divider"></div>
            </div>
            <div className="login-options">
              <form action={`${import.meta.env.VITE_SERVER_URL}/auth/google`}>
                <button className="input-field google">
                  Continue with Google
                </button>
              </form>
              <form action={`${import.meta.env.VITE_SERVER_URL}/auth/facebook`}>
                <button className="input-field facebook">
                  Continue with Facebook
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
