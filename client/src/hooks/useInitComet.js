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
              console.log("Login Successful:", { User });
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
                          console.log("Login Successful:", { User }); 
                          window.CometChatWidget.init({
                            appID: process.env.REACT_APP_COMETCHAT_APP_ID,
                            appRegion: process.env.REACT_APP_COMETCHAT_REGION,
                            authKey: process.env.REACT_APP_COMETCHAT_API_KEY,
                            }).then(()=>{setInit(true)},(error)=>{console.log(error);}) 
                        }, error => {
                          console.log(error);
                        })
                    }, error => {
                        console.log("error", error);
                    }
                )
              }
          })


          // if(response){
          //   cometApi.get(`/users/${user?.user._id}`,{headers: {
          //     'apiKey': process.env.REACT_APP_COMETCHAT_API_KEY,
          //     'Content-Type': 'application/json',
          //     'accept': 'application/json',
          //   }}).then(response=>{
          //     //if user exists then login
          //     CometChat.login(response.data.data.uid,process.env.REACT_APP_COMETCHAT_AUTH_KEY).then(
          //       User => {
          //         console.log("Login Successful:", { User });    
          //       }, error => {
          //         console.log(error);
          //       })
          //   },(error)=>{
          //     console.log(error);
          //     //create a user
          //     if(error.response.data.error.code == "ERR_UID_NOT_FOUND"){
          //           var User = new CometChat.User(user?.user._id);
          //           User.setName(user?.user.username);
          //           User.setAvatar(user?.user.img);
      
          //           CometChat.createUser(User, process.env.REACT_APP_COMETCHAT_API_KEY).then(
          //               User => {
          //                 CometChat.login(User.uid,process.env.REACT_APP_COMETCHAT_AUTH_KEY).then(
          //                   User => {
          //                     console.log("Login Successful:", { User });
          //                   }, error => {
          //                     console.log(error);
          //                   })
          //               }, error => {
          //                   console.log("error", error);
          //               }
          //           )
          //         }
          //   })
          // }

          // checks if the user already exists in cometchat

          
            
            //if user exists then login
          //   CometChat.login(response.data.data.uid,process.env.REACT_APP_COMETCHAT_AUTH_KEY).then(
          //     User => {
          //       console.log("Login Successful:", { User });    
          //     }, error => {
          //       console.log(error);
          //     })
          // },(error)=>{
          //   if(error.response.data.error.code == "ERR_UID_NOT_FOUND"){
          //     var User = new CometChat.User(user?.user._id);
          //     User.setName(user?.user.username);
          //     User.setAvatar(user?.user.img);

          //     // else create a user
          //     CometChat.createUser(User, process.env.REACT_APP_COMETCHAT_API_KEY).then(
          //         User => {
          //           CometChat.login(User.uid,process.env.REACT_APP_COMETCHAT_AUTH_KEY).then(
          //             User => {
          //               console.log("Login Successful:", { User });    
          //             }, error => {
          //               console.log(error);
          //             })
          //         }, error => {
          //             console.log("error", error);
          //         }
          //     )
          //   }
          // })

          //initialize cometchat widget
          // if(cometChatUser){
          //   window.CometChatWidget.init({
          //     appID: process.env.REACT_APP_COMETCHAT_APP_ID,
          //     appRegion: process.env.REACT_APP_COMETCHAT_REGION,
          //     authKey: process.env.REACT_APP_COMETCHAT_API_KEY,
          //     }).then(()=>{setInit(true)},(error)=>{console.log(error);}) 
          // }
          },(error)=>{
              console.log(error);
          })

        }

    return InitComet;
}