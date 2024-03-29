import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import useLogout from "../../hooks/useLogout";

export default function Navbar({ image }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const logout = useLogout();
  const navigate = useNavigate();

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    navigate("/account");
    setAnchorEl(null);
  }

  function handleLogout() {
    setAnchorEl(null);
    logout();
    navigate("/login");
  }

  return (
    <>
      <div className="display-change">
        <a href={import.meta.env.VITE_CLIENT_URL}>
          <img
            className="logo"
            src={`${import.meta.env.VITE_CDN_URL}/bazinga.png`}
            alt="logo"
          />
        </a>
        <div className="notification-user">
          <div>
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <img
                src={image}
                alt="user-img"
                className="user-img"
                referrerPolicy="no-referrer"
              />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </>
  );
}
