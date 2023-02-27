import useAuth from "./useAuth";
import useCometChat from "./useCometChat";
import { CometChat } from "@cometchat-pro/chat";
import cometApi from '../api/cometApi'
import { useState } from "react";

export default function useInitComet(){

    //cometchat initialization state
    const {setInit}= useCometChat();
    
    const {user} = useAuth();

    //initializing cometchat
    async function InitComet(){

        //app settings for initialization
        let appSetting = new CometChat.AppSettingsBuilder()
                    .subscribePresenceForAllUsers()
                    .setRegion(process.env.REACT_APP_COMETCHAT_REGION)
                    .autoEstablishSocketConnection(true)
                    .build();
        await CometChat.init(process.env.REACT_APP_COMETCHAT_APP_ID, appSetting).then(()=>{
          CometChat.login(user?.user._id,process.env.REACT_APP_COMETCHAT_AUTH_KEY).then(
            User => {
              window.CometChatWidget.init({
                appID: process.env.REACT_APP_COMETCHAT_APP_ID,
                appRegion: process.env.REACT_APP_COMETCHAT_REGION,
                authKey: process.env.REACT_APP_COMETCHAT_API_KEY,
                }).then(()=>{setInit(true)},(error)=>{console.log(error);}) 
            }, error => {
              if(error.code == "ERR_UID_NOT_FOUND"){
                var User = new CometChat.User(user?.user._id);
                User.setName(user?.user.username);
                User.setAvatar(user?.user.img);
  
                CometChat.createUser(User, process.env.REACT_APP_COMETCHAT_API_KEY).then(
                    User => {
                      CometChat.login(User.uid,process.env.REACT_APP_COMETCHAT_AUTH_KEY).then(
                        User => {
                          window.CometChatWidget.init({
                            appID: process.env.REACT_APP_COMETCHAT_APP_ID,
                            appRegion: process.env.REACT_APP_COMETCHAT_REGION,
                            authKey: process.env.REACT_APP_COMETCHAT_API_KEY,
                            }).then(()=>{setInit(true)},(error)=>{console.log(error);}) 
                        }, error => {
                          
                        })
                    }, error => {
                        
                    }
                )
              }
          })
          },(error)=>{
          })

        }

    return InitComet;
}