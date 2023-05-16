import { useEffect } from "react";
import { CometChat } from "@cometchat-pro/chat";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import useCometChat from "../hooks/useCometChat";
import useSocket from "../hooks/useSocket";
import { useNavigate } from "react-router-dom";

export default function Call() {
  const { user } = useAuth();

  //cometchat initialization state
  const { init } = useCometChat();

  const params = useParams();
  const { socket } = useSocket();
  const navigate = useNavigate();

  //chat user ID
  const userId = params.cuid;

  //function for updating call details
  async function callData(type, status, duration, senderId, receiverId) {
    const formData = {
      type: type,
      status: status,
      duration: duration,
      sender_id: senderId,
      receiver_id: receiverId,
    };

    const response = await axios.post("/conversation", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const currentConversation = response.data.conversation[0];

    //if conversation is started with the call
    if (currentConversation?.texts.length === 1) {
      socket.emit("sendUserId", userId);
      socket.on("getSocketId", (data) => {
        socket.emit("join-room", data);
        socket.emit("updateConversation", data);
      });
    }

    //if conversation already exists
    else {
      socket.emit("updateConversation", currentConversation._id);
    }
    navigate(`/chat/${receiverId}`);
  }

  // function for initiating call
  function initiateCall() {
    //users and call type info
    var receiverID = userId;
    var callType =
      params.type === "audio"
        ? CometChat.CALL_TYPE.AUDIO
        : CometChat.CALL_TYPE.VIDEO;
    var receiverType = CometChat.RECEIVER_TYPE.USER;
    var listnerID = user.user._id;

    //call listener for handling call rejection info
    CometChat.addCallListener(
      listnerID,
      new CometChat.CallListener({
        onOutgoingCallRejected: (call) => {
          // removing sessionId from sessionStorage
          sessionStorage.removeItem("callDetails");
          callData(
            call.type,
            "declined",
            null,
            call.data.entities.on.entity.data.entities.sender.entity.uid,
            call.data.entities.on.entity.data.entities.receiver.entity.uid
          );
        },
      })
    );

    //details for initiating call
    var call = new CometChat.Call(receiverID, callType, receiverType);

    //initiate call
    CometChat.initiateCall(call).then(
      (outGoingCall) => {
        //saving sessionId in session storage for handling multiple call initializing issues
        var sessionId = outGoingCall.sessionId;
        var callType = outGoingCall.type;
        sessionStorage.setItem(
          "callDetails",
          JSON.stringify({
            sessionID: sessionId,
            initiatior: outGoingCall.callInitiator.uid,
          })
        );

        //settings for starting the call
        var callSettings = new CometChat.CallSettingsBuilder()
          .setSessionID(sessionId)
          .enableDefaultLayout(true)
          .setIsAudioOnlyCall(callType == "audio" ? true : false)
          .build();
        CometChat.startCall(
          callSettings,
          document.getElementById("cometchat"),
          new CometChat.OngoingCallListener({
            onUserJoined: (user) => {},
            onUserLeft: (User) => {
              var sessionId = callDetails.sessionID;
              const callDetails = JSON.parse(
                sessionStorage.getItem("callDetails")
              );
              CometChat.endCall(sessionId).then(
                (call) => {
                  // removing sessionId from sessionStorage
                  sessionStorage.removeItem("callDetails");

                  // if call is ended after a conversation
                  if (
                    call.status === "ended" &&
                    call.data.entities.on.entity.duration
                  ) {
                    callData(
                      call.type,
                      call.status,
                      call.data.entities.on.entity.duration,
                      call.data.entities.on.entity.data.entities.sender.entity
                        .uid,
                      call.data.entities.on.entity.data.entities.receiver.entity
                        .uid
                    );
                  }

                  // if call is not answered
                  else {
                    callData(
                      call.type,
                      "missed",
                      null,
                      call.data.entities.on.entity.data.entities.sender.entity
                        .uid,
                      call.data.entities.on.entity.data.entities.receiver.entity
                        .uid
                    );
                  }
                },
                (error) => {}
              );
            },
            onUserListUpdated: (userList) => {},
            onCallEnded: (call) => {
              console.log(call);
              // removing sessionId from sessionStorage
              sessionStorage.removeItem("callDetails");

              // if call is ended after answering
              if (
                call.status === "ended" &&
                call.data.entities.on.entity.duration
              ) {
                callData(
                  call.type,
                  call.status,
                  call.data.entities.on.entity.duration,
                  call.data.entities.on.entity.data.entities.sender.entity.uid,
                  call.data.entities.on.entity.data.entities.receiver.entity.uid
                );
              }

              // if call is not answered
              else {
                callData(
                  call.type,
                  "missed",
                  null,
                  call.data.entities.on.entity.data.entities.sender.entity.uid,
                  call.data.entities.on.entity.data.entities.receiver.entity.uid
                );
              }

              // if the call initiator ends the call before answering, then call is cancelled
              var status = CometChat.CALL_STATUS.CANCELLED;
              if (call.callInitiator.uid === user.user._id) {
                CometChat.rejectCall(sessionId, status).then(
                  (call) => {},
                  (error) => {}
                );
              }
            },
            onError: (error) => {
              sessionStorage.removeItem("callDetails");
            },
            onMediaDeviceListUpdated: (deviceList) => {},
            onUserMuted: (userMuted, userMutedBy) => {},
            onScreenShareStarted: () => {},
            onScreenShareStopped: () => {},
            onCallSwitchedToVideo: (
              sessionId,
              callSwitchInitiatedBy,
              callSwitchAcceptedBy
            ) => {},
          })
        );
      },
      (error) => {}
    );
  }

  // checks for multiple call initialization
  useEffect(() => {
    //checks sessionStorage for sessionId
    const callDetails = JSON.parse(sessionStorage.getItem("callDetails"));

    //if sessionId doesn't exist
    if (!callDetails) {
      initiateCall();
    }

    //if sessionId exists
    else {
      var sessionId = callDetails.sessionID;
      var status =
        callDetails.initiatior === user?.user._id
          ? CometChat.CALL_STATUS.CANCELLED
          : CometChat.CALL_STATUS.REJECTED;

      CometChat.rejectCall(sessionId, status).then(
        (call) => {
          sessionStorage.removeItem("callDetails");
          console.log("Call rejected successfully", call);
          initiateCall();
        },
        (error) => {
          console.log("Call rejection failed with error:", error);
          if (error.code === "ERR_CALL_TERMINATED") {
            initiateCall();
          }
        }
      );
    }
  }, [init]);

  //socket connection
  useEffect(() => {
    if (socket.connected == false) {
      socket.connect();
      socket.emit("addNewUser", user?.user._id);
    }
  }, [socket]);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <div className="chatwidget" style={{ display: "none" }}></div>
      <div id="cometchat" style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
}
