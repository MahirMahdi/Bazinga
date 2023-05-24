import { useState, createContext } from "react";
import { io } from "socket.io-client";

export const AuthContext = createContext();
export const SocketContext = createContext();
export const CometChatContext = createContext();
export const StatusContext = createContext();

export default function GlobalProviders({ children }) {
  const [user, setUser] = useState();
  const [socket, setSocket] = useState(
    io(import.meta.env.VITE_SERVER_URL, {
      autoConnect: false,
      "Access-Control-Allow-Origin": "*",
    })
  );
  const [init, setInit] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState();

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      <AuthContext.Provider value={{ user, setUser }}>
        <CometChatContext.Provider value={{ init, setInit }}>
          <StatusContext.Provider value={{ onlineUsers, setOnlineUsers }}>
            {children}
          </StatusContext.Provider>
        </CometChatContext.Provider>
      </AuthContext.Provider>
    </SocketContext.Provider>
  );
}
