import useAuth from "./useAuth";
import useCometChat from "./useCometChat";
import { CometChat } from "@cometchat-pro/chat";
import cometApi from "../api/CometApi";
import { useState } from "react";

export default function useInitComet() {
  //cometchat initialization state
  const { setInit } = useCometChat();

  const { user } = useAuth();

  //initializing cometchat
  async function InitComet() {
    //app settings for initialization
    let appSetting = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(import.meta.env.VITE_COMETCHAT_REGION)
      .autoEstablishSocketConnection(true)
      .build();
    await CometChat.init(
      import.meta.env.VITE_COMETCHAT_APP_ID,
      appSetting
    ).then(
      () => {
        CometChat.login(
          user?.user._id,
          import.meta.env.VITE_COMETCHAT_AUTH_KEY
        ).then(
          (User) => {
            window.CometChatWidget.init({
              appID: import.meta.env.VITE_COMETCHAT_APP_ID,
              appRegion: import.meta.env.VITE_COMETCHAT_REGION,
              authKey: import.meta.env.VITE_COMETCHAT_API_KEY,
            }).then(
              () => {
                setInit(true);
              },
              (error) => {
                console.log(error);
              }
            );
          },
          (error) => {
            if (error.code == "ERR_UID_NOT_FOUND") {
              var User = new CometChat.User(user?.user._id);
              User.setName(user?.user.username);
              User.setAvatar(user?.user.img);

              CometChat.createUser(
                User,
                import.meta.env.VITE_COMETCHAT_API_KEY
              ).then(
                (User) => {
                  CometChat.login(
                    User.uid,
                    import.meta.env.VITE_COMETCHAT_AUTH_KEY
                  ).then(
                    (User) => {
                      window.CometChatWidget.init({
                        appID: import.meta.env.VITE_COMETCHAT_APP_ID,
                        appRegion: import.meta.env.VITE_COMETCHAT_REGION,
                        authKey: import.meta.env.VITE_COMETCHAT_API_KEY,
                      }).then(
                        () => {
                          setInit(true);
                        },
                        (error) => {
                          console.log(error);
                        }
                      );
                    },
                    (error) => {}
                  );
                },
                (error) => {}
              );
            }
          }
        );
      },
      (error) => {}
    );
  }

  return InitComet;
}
