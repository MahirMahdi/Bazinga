import moment from "moment";

export default function CallInfo({ type, img, message, duration, time }) {
  return (
    <div className={type}>
      <div className="call-container">
        <div className="call-info">
          <img src={img} />
          <p>{message}</p>
        </div>
        <p className="duration">{duration ? duration : null}</p>
      </div>
      <p className="text-time">{moment(time).format("hh:mm")}</p>
    </div>
  );
}
