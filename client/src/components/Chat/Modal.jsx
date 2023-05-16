import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

export default function Modal({ show, onClose, imageUrl }) {
  const modalStyle = {
    display: show ? "grid" : "none",
    placeItems: "center",
    position: "fixed",
    zIndex: 1,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    overflow: "auto",
    backgroundColor: "rgba(0,0,0,0.4)",
  };

  const modalContentStyle = {
    margin: "auto",
    width: "fit-content",
    display: "grid",
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "2.5rem",
    right: "2.5rem",
    color: "white",
  };

  const imageStyle = {
    maxWidth: "100%",
    borderRadius: "5px",
  };

  return (
    <div style={modalStyle}>
      <IconButton sx={closeButtonStyle} onClick={onClose}>
        <CloseIcon />
      </IconButton>
      <div style={modalContentStyle}>
        <img style={imageStyle} src={imageUrl} alt="modal" />
      </div>
    </div>
  );
}
