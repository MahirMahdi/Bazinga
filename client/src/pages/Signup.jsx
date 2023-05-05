import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/signup.png";
import useAuth from "../hooks/useAuth";
import cam from "../assets/cam.png";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  //signup error
  const [error, setError] = useState();

  //signup info
  const [formData, setFormData] = useState();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [img, setImg] = useState("");

  //image file name
  const [imgName, setImgName] = useState("Select a photo...");

  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    setFormData({
      image: img,
      username: username,
      email: email,
      password: password,
    });
    if (img && username && email && password) {
      setButtonDisabled(false);
    }
  }, [img, username, email, password]);

  // handle signup
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("/signup", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      const userDetails = await response.data;
      setUser(userDetails);
      setIsLoading(false);
      setUsername("");
      setEmail("");
      setPassword("");
      setImg("");
      navigate("/");
    } catch (err) {
      setError(err.response.data.message);
    }
  }

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
        <div className="signup">
          <div className="signup-header">
            <img className="logo" src={logo} alt="logo" />
          </div>
          {error && <p className="error-text">{error}</p>}
          <form onSubmit={handleSubmit}>
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
                <img src={cam} className="add-file-logo" />
              </label>
              <label htmlFor="signup-image">
                <p className="img-name">
                  {imgName.length > 20 ? imgName.slice(0, 12) + "..." : imgName}
                </p>
              </label>
            </div>
            <button
              type="submit"
              className="submit-button"
              disabled={buttonDisabled}
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </>
  );
}
