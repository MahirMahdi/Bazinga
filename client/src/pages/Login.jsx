import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState(true);

  function handleType() {
    setType((prev) => !prev);
  }

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
  async function handleLogin(e) {
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

  const [signupFormData, setSignupFormData] = useState();
  const [username, setUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [img, setImg] = useState("");

  //image file name
  const [imgName, setImgName] = useState("Select a photo...");

  useEffect(() => {
    setSignupFormData({
      image: img,
      username: username,
      email: signupEmail,
      password: signupPassword,
    });
    if (img && username && email && password) {
      setButtonDisabled(false);
    }
  }, [img, username, email, password]);

  // handle signup
  async function handleSignup(e) {
    // e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("/signup", signupFormData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      const userDetails = await response.data;
      setUser(userDetails);
      setIsLoading(false);
      setUsername("");
      setSignupEmail("");
      setSignupPassword("");
      setImg("");
      navigate("/");
    } catch (err) {
      setError(err.response.data.message);
    }
  }

  return (
    <div className="main-wrapper">
      {type ? (
        <div className="login">
          <div className="components">
            <img
              className="logo"
              src={`${import.meta.env.VITE_CDN_URL}/bazinga.png`}
              alt="logo"
            />

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
            <Button
              variant="contained"
              sx={{
                backgroundColor: "black",
                color: "white",
                padding: ".5rem 3rem",
                borderRadius: "12.5px",
                fontSize: ".75rem",
              }}
              disabled={buttonDisabled}
              onClick={handleLogin}
            >
              Login
            </Button>
            <p className="signup-text" onClick={handleType}>
              Don't have an account? Click here to Signup.
            </p>
            <div className="divider">
              <div className="half-divider"></div>
              <p>OR</p>
              <div className="half-divider"></div>
            </div>
            <div className="login-options">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  padding: ".6rem 1rem",
                  borderRadius: "12.5px",
                  fontSize: ".75rem",
                }}
                startIcon={<GoogleIcon color="white" />}
                href={`${import.meta.env.VITE_SERVER_URL}/auth/google`}
              >
                Continue with Google
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  padding: ".6rem 1rem",
                  borderRadius: "12.5px",
                  fontSize: ".75rem",
                }}
                startIcon={<FacebookRoundedIcon color="white" />}
                href={`${import.meta.env.VITE_SERVER_URL}/auth/facebook`}
              >
                Continue with Facebook
              </Button>
            </div>
          </div>
          <p className="copyright-text">2023 © All rights reserved</p>
        </div>
      ) : (
        <div className="signup">
          <div className="components">
            <img
              className="logo"
              src={`${import.meta.env.VITE_CDN_URL}/signup.png`}
              alt="logo"
            />
            {error && <p className="error-text">{error}</p>}
            <form onSubmit={handleSignup}>
              <input
                required={true}
                type="text"
                className="input-field"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
              <input
                required={true}
                type="email"
                className="input-field"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <input
                required={true}
                type="password"
                className="input-field"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <div className="input-field addfile">
                <input
                  required={true}
                  id="signup-image"
                  type="file"
                  className="input-field imginput"
                  accept="image/*"
                  onChange={(e) => {
                    setImg(e.target.files[0]);
                    setImgName(
                      document
                        .getElementsByClassName("img-name")[0]
                        .innerHTML.replace(imgName, e.target.files[0].name)
                    );
                  }}
                />
                <label htmlFor="signup-image" className="add-file-label">
                  <img
                    src={`${import.meta.env.VITE_CDN_URL}/cam.png`}
                    className="add-file-logo"
                    alt="cam"
                  />
                </label>
                <label htmlFor="signup-image">
                  <p className="img-name">
                    {imgName.length > 20
                      ? imgName.slice(0, 12) + "..."
                      : imgName}
                  </p>
                </label>
              </div>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  padding: ".5rem 3rem",
                  borderRadius: "12.5px",
                  fontSize: ".75rem",
                }}
                disabled={buttonDisabled}
              >
                Signup
              </Button>
              <p className="signup-text" onClick={handleType}>
                Already have an account? Click here to Login.
              </p>
            </form>
          </div>
          <p className="copyright-text">2023 © All rights reserved</p>
        </div>
      )}
      <div className="banner">
        <div className="banner-header">
          <p className="headline">
            Connect Anytime, Anywhere with <strong>BAZINGA</strong>
          </p>
          <p className="tagline">
            Experience Seamless Communication with Just a Tap
          </p>
          <div className="banner-image">
            <img
              alt="banner-image"
              src={`${import.meta.env.VITE_CDN_URL}/banner.png`}
              width="inherit"
              height="inherit"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
