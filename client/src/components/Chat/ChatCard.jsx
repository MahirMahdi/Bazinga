import { useEffect, useState } from "react";
import axios from "../../api/axios";
import Card from "./Card";

export default function ChatCard({
  userId,
  searchData,
  data,
  currentUserId,
  status,
}) {
  const [chatUser, setChatUser] = useState();

  async function getUserData() {
    const response = await axios.get(`/chatuser/${userId}`);
    if (!response.data.message) {
      const { password, ...rest } = response.data.user;
      setChatUser(rest);
    }
  }

  useEffect(() => {
    if (userId) {
      getUserData();
    }
  }, [userId]);

  //checks if the conversation has any texts
  const textsLength = data?.texts ? data.texts.length : null;
  const checkLastTextInfo = textsLength ? data.texts[textsLength - 1] : null;
  const lastTextSenderId = checkLastTextInfo
    ? checkLastTextInfo.sender_id
    : null;

  // last text or image or call info
  const fixImgUrl = checkLastTextInfo
    ? checkLastTextInfo.img?.replace(
        `${import.meta.env.VITE_SERVER_URL}/home/`,
        ""
      )
    : null;
  const lastText = checkLastTextInfo ? checkLastTextInfo.text : null;
  const lastImg =
    fixImgUrl?.length > 12 ? fixImgUrl.slice(0, 12) + "..." : fixImgUrl;
  const lastCall = checkLastTextInfo ? checkLastTextInfo.call.status : null;
  const time = checkLastTextInfo ? checkLastTextInfo.createdAt : null;

  return (
    <>
      {chatUser && (
        <Card
          status={status}
          userId={userId}
          currentUserId={currentUserId}
          image={chatUser.img && chatUser.img}
          name={chatUser.username}
          lastText={lastText || lastImg}
          time={time}
          senderId={lastTextSenderId}
          call={lastCall}
          errMessage={null}
        />
      )}
      {searchData && searchData.user && (
        <Card
          status={status}
          userId={searchData.user._id}
          currentUserId={currentUserId}
          image={searchData.user.img && searchData.user.img}
          name={searchData.user.username}
        />
      )}
      {searchData && searchData.message && (
        <Card errMessage={searchData.message} />
      )}
    </>
  );
}
