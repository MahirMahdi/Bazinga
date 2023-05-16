import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function ChatHeader({
  status,
  chatUser,
  handleClick,
  conversationId,
}) {
  const [open, setOpen] = useState(false);

  function handleClickOpen() {
    setOpen(true);
    setAnchorEl(null);
  }

  function handleClose() {
    setOpen(false);
  }

  //menu states
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const { user } = useAuth();
  const navigate = useNavigate();

  //handling menu
  function handleMenuClick(event) {
    console.log(event);
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  //deletes the conversation from the initiator's database only.
  async function handleDelete() {
    const response = await axios.post(
      `/conversation/${user.user._id}/${conversationId}`
    );
    setOpen(false);
    navigate("/");
  }

  return (
    <div className="chat-header">
      <div className="user-info">
        <img
          src={`${import.meta.env.VITE_CDN_URL}/left-arrow.png`}
          alt="left-arrow"
          className="arrow"
          onClick={handleClick}
        />
        <div
          className={status ? "online" : "offline"}
          id="chat-header-status"
        ></div>
        {chatUser ? (
          <>
            <img
              src={chatUser.img}
              alt="user"
              className="user-pic"
              referrerPolicy="no-referrer"
            />
            <p className="name">{chatUser.username}</p>
          </>
        ) : null}
      </div>
      <div className="call-options">
        <a
          href={`${import.meta.env.VITE_CLIENT_URL}/call/audio/${chatUser._id}`}
        >
          <img
            src={`${import.meta.env.VITE_CDN_URL}/mobile.png`}
            alt="mobile"
            className="mobile"
          />
        </a>
        <a
          href={`${import.meta.env.VITE_CLIENT_URL}/call/video/${chatUser._id}`}
        >
          <img
            src={`${import.meta.env.VITE_CDN_URL}/camera.png`}
            alt="camera"
            className="camera"
          />
        </a>
        <Button
          id="demo-positioned-button"
          aria-controls={open ? "demo-positioned-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleMenuClick}
        >
          <img
            src={`${import.meta.env.VITE_CDN_URL}/options.png`}
            alt="options"
            className="options"
          />
        </Button>
        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleClickOpen}>
            {" "}
            Delete Conversation
            <img
              src={`${import.meta.env.VITE_CDN_URL}/dustbin.png`}
              style={{ width: "1rem" }}
            />{" "}
          </MenuItem>
        </Menu>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete your account?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleDelete} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
