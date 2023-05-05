import ChatCard from "../components/Chat/ChatCard";
import Navbar from "../components/Shared/Navbar";
import useAuth from "../hooks/useAuth";
import useSocket from "../hooks/useSocket";
import useCometChat from "../hooks/useCometChat";
import useStatus from "../hooks/useStatus";
import { useEffect, useRef, useState } from "react";
import axios from "../api/axios";

export default function Home() {
  //search data
  const [search, setSearch] = useState("");
  const [result, setResult] = useState();

  const { onlineUsers, setOnlineUsers } = useStatus();
  const { user } = useAuth();
  const { socket } = useSocket();

  //cometchat initialization state
  const { init } = useCometChat();

  // all conversations of the user
  const [conversation, setConversation] = useState("");

  //cometchat widget launch
  const [launched, setLaunched] = useState(false);
  const launchCount = useRef(0);

  //getting all conversations of the user and joining room using conversation id
  async function getConversation() {
    const response = await axios.get(`/conversation/${user?.user._id}`);
    const conversations = response.data.conversation;
    if (conversations?.length > 0) {
      conversations.map((convo) => socket.emit("join-room", convo._id));
      setConversation(conversations);
    }
  }

  //search user
  async function handleSearch(e) {
    e.preventDefault();
    try {
      const response = await axios.get(`/user/${search}`, {
        headers: { "Content-Type": "application/json" },
      });
      setResult(response.data);
      setSearch("");
    } catch (err) {
      console.log(err);
    }
  }

  //launch cometchat widget
  useEffect(() => {
    if (init && !launched && launchCount.current === 0) {
      window.CometChatWidget.launch({
        widgetID: import.meta.env.VITE_COMETCHAT_WIDGET_ID,
        target: "#cometchat",
        roundedCorners: "true",
        height: "0px",
        width: "0px",
        defaultID: user?.user._id, //default UID (user) or GUID (group) to show,
        defaultType: "user", //user or group
      });
      setLaunched(true);
      launchCount.current = launchCount.current + 1;
    }
  }, [init, launched]);

  //socket connection
  useEffect(() => {
    if (socket.connected == false) {
      socket.connect();
      socket.emit("addNewUser", user?.user._id);
    }

    //triggers whenever a conversation is updated
    socket.on("conversationUpdated", () => {
      getConversation();
    });
  }, [socket]);

  useEffect(() => {
    getConversation();
  }, []);

  // gets all online users
  useEffect(() => {
    if (!onlineUsers) {
      socket.on("getUsers", (users) => {
        setOnlineUsers(users);
      });
    }
  }, [onlineUsers]);

  return (
    <div className="home">
      <div className="navbar">
        <Navbar image={user?.user.img && user.user.img} />
        <form className="search-form" onSubmit={handleSearch}>
          <input
            value={search}
            className="search-bar"
            type="search"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>
      <div className="navbar-mobile">
        <Navbar image={user?.user.img && user.user.img} />
        <form className="search-form" onSubmit={handleSearch}>
          <input
            value={search}
            className="search-bar"
            type="search"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>
      <div className="sidebar-mobile">
        <div className="chatcard-holder">
          {result ? (
            <ChatCard
              status={
                onlineUsers?.filter((user) => user.userId === result._id)
                  .length !== 0
                  ? true
                  : false
              }
              searchData={result}
              currentUserId={user.user._id}
              data={null}
            />
          ) : conversation ? (
            conversation.map((convo) => {
              const userId = convo.members.filter(
                (id) => id !== user.user._id
              )[0];
              const activeUser = onlineUsers?.filter(
                (user) => user.userId === userId
              );
              return (
                <ChatCard
                  key={convo._id}
                  userId={userId}
                  status={activeUser?.length !== 0 ? true : false}
                  searchData={null}
                  currentUserId={user.user._id}
                  data={convo}
                />
              );
            })
          ) : null}
        </div>
      </div>
      <div className="sidebar">
        <div className="chatcard-holder">
          {result ? (
            <ChatCard
              status={
                onlineUsers?.filter((user) => user.userId === result._id)
                  .length !== 0
                  ? true
                  : false
              }
              searchData={result}
              currentUserId={user.user._id}
              data={null}
            />
          ) : conversation ? (
            conversation.map((convo) => {
              const userId = convo.members.filter(
                (id) => id !== user.user._id
              )[0];
              const activeUser = onlineUsers?.filter(
                (user) => user.userId === userId
              );
              return (
                <ChatCard
                  key={convo._id}
                  userId={userId}
                  status={activeUser?.length !== 0 ? true : false}
                  searchData={null}
                  currentUserId={user.user._id}
                  data={convo}
                />
              );
            })
          ) : null}
        </div>
      </div>
      <div className="home-box">
        <span>Start a conversation</span>
      </div>
      <div id="cometchat"></div>
    </div>
  );
}
