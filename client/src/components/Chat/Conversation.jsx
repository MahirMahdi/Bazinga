import moment from "moment";
import CallInfo from "./CallInfo";

export default function Conversation({ sent, recieved, img, handleShowImage }) {
  function timeFormat(time) {
    if (time < 60) {
      return `${time}s`;
    } else if (time > 60 && time < 3600) {
      return moment.utc(time * 1000).format("mm:ss");
    } else {
      return moment.utc(time * 1000).format("HH:mm:ss");
    }
  }

  return (
    <div className="conversation">
      {recieved ? (
        <div className="recieved-info">
          <img
            className="user-dp"
            src={img}
            alt="dp"
            referrerPolicy="no-referrer"
          />
          <div className="recieved-container">
            {recieved.text ? (
              <div className="recieved">
                <p className="text">{recieved.text}</p>
                <p className="text-time">
                  {moment(recieved.createdAt).format("hh:mm")}
                </p>
              </div>
            ) : null}
            {recieved.img ? (
              <div className="recieved chat-img">
                <img
                  className="text-img-recieved"
                  onClick={handleShowImage}
                  src={recieved.img}
                />
              </div>
            ) : null}
            {recieved.call ? (
              recieved.call.status === "missed" ? (
                <CallInfo
                  type="recieved"
                  img={
                    recieved.call.type === "audio"
                      ? `${import.meta.env.VITE_CDN_URL}/call-missed.png`
                      : `${import.meta.env.VITE_CDN_URL}/video-call-missed.png`
                  }
                  message="Missed Call"
                  duration={null}
                  time={recieved.createdAt}
                />
              ) : recieved.call.status === "ended" ? (
                <CallInfo
                  type="recieved"
                  img={
                    recieved.call.type === "audio"
                      ? `${import.meta.env.VITE_CDN_URL}/call.png`
                      : `${import.meta.env.VITE_CDN_URL}/video-call.png`
                  }
                  message="Call ended"
                  duration={timeFormat(recieved.call.duration)}
                  time={recieved.createdAt}
                />
              ) : recieved.call.status === "declined" ? (
                <CallInfo
                  type="recieved"
                  img={
                    recieved.call.type === "audio"
                      ? `${import.meta.env.VITE_CDN_URL}/call-missed.png`
                      : `${import.meta.env.VITE_CDN_URL}/video-call-missed.png`
                  }
                  message="Call declined"
                  duration={null}
                  time={recieved.createdAt}
                />
              ) : null
            ) : null}
          </div>
        </div>
      ) : null}
      {sent ? (
        <div className="sent-container">
          {sent.text ? (
            <div className="sent">
              <p className="text">{sent.text}</p>
              <p className="text-time">
                {moment(sent.createdAt).format("hh:mm")}
              </p>
            </div>
          ) : null}
          {sent.img ? (
            <div className="sent chat-img">
              <img
                className="text-img-sent"
                onClick={handleShowImage}
                src={sent.img}
              />
            </div>
          ) : null}
          {sent.call ? (
            sent.call.status === "missed" ? (
              <CallInfo
                type="sent"
                img={
                  sent.call.type === "audio"
                    ? `${import.meta.env.VITE_CDN_URL}/call-missed.png`
                    : `${import.meta.env.VITE_CDN_URL}/video-call-missed.png`
                }
                message="Call not answered"
                duration={null}
                time={sent.createdAt}
              />
            ) : sent.call.status === "ended" ? (
              <CallInfo
                type="sent"
                img={
                  sent.call.type === "audio"
                    ? `${import.meta.env.VITE_CDN_URL}/call.png`
                    : `${import.meta.env.VITE_CDN_URL}/video-call.png`
                }
                message="Call ended"
                duration={timeFormat(sent.call.duration)}
                time={sent.createdAt}
              />
            ) : sent.call.status === "declined" ? (
              <CallInfo
                type="sent"
                img={
                  sent.call.type === "audio"
                    ? `${import.meta.env.VITE_CDN_URL}/call-missed.png`
                    : `${import.meta.env.VITE_CDN_URL}/video-call-missed.png`
                }
                message="Call declined"
                duration={null}
                time={sent.createdAt}
              />
            ) : null
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
