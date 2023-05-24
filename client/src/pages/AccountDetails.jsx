import { useState } from "react";
import useAuth from "../hooks/useAuth";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import cometApi from "../api/CometApi";

export default function AccountDetails() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  async function handleDelete() {
    await cometApi.delete(`/users/${user.user._id}`, {
      headers: {
        apiKey: import.meta.env.VITE_COMETCHAT_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    await axios.post(`/delete-account/${user.user._id}`);
    setOpen(false);
    navigate("/login");
  }
  return (
    <div className="account-details">
      <div className="details-container">
        <img src={user?.user.img} />
        <div className="user-details">
          <span>
            Name: <p className="info">{user?.user.username}</p>
          </span>
          <span>
            Email:{" "}
            <p className="info">
              {user?.user.email.length > 12
                ? user.user.email.slice(0, 12) + "..."
                : user.user.email}
            </p>
          </span>
        </div>
        <button
          type="submit"
          className="submit-button"
          onClick={handleClickOpen}
        >
          Delete Account
        </button>
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
