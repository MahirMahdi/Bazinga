import moment from "moment";

export default function Card({
  senderId,
  userId,
  currentUserId,
  image,
  name,
  lastText,
  call,
  time,
  status,
  errMessage,
}) {
  return (
    <>
      {errMessage ? (
        <div className="card-err-message">{errMessage}</div>
      ) : (
        <a href={`${import.meta.env.VITE_CLIENT_URL}/chat/${userId}`}>
          <div className="chat-card">
            <div className={status ? "online" : "offline"}></div>
            <img
              src={image}
              className="user-pic"
              alt="dp"
              referrerPolicy="no-referrer"
            />
            <div className="name-text">
              <p className="name">{name}</p>
              {lastText ? (
                senderId === currentUserId ? (
                  <p className="card-text">You: {lastText}</p>
                ) : (
                  <p className="card-text">{lastText}</p>
                )
              ) : null}
              {call ? (
                senderId === currentUserId ? (
                  call === "missed" ? (
                    <p className="card-text">You: Call not answered</p>
                  ) : call === "ended" ? (
                    <p className="card-text">You: Call ended</p>
                  ) : (
                    <p className="card-text">You: Call declined</p>
                  )
                ) : call === "missed" ? (
                  <p className="card-text">Missed call</p>
                ) : call === "ended" ? (
                  <p className="card-text">Call ended</p>
                ) : (
                  <p className="card-text">Call declined</p>
                )
              ) : null}
            </div>
            <div className="time-textno">
              {time ? (
                <p className="time">{moment(time).format("hh:mm")}</p>
              ) : null}
            </div>
          </div>
        </a>
      )}
    </>
  );
}
