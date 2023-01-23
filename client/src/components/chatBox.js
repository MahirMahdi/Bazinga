import React, { useEffect } from 'react';
import Conversation from './conversation';
import TextInput from './textInput';
import ChatHeader from './chatHeader';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function ChatBox({initiateVideoCall,handleSubmit,currentConversation,handleClick,handleEmojiPicker,emojiClose,handleEmojiClick,handleTextChange,handleImageChange,handleClose,chatUser,userId,user,open,emojiPicker,text,image,status}){
    
    //stick the scrollbar to the bottom
    useEffect(()=>{
        const chatBody = document.getElementsByClassName('chat-body')[0];
        const wrapper = chatBody.childNodes[0];
        if( wrapper && chatBody.scrollHeight > chatBody.clientHeight){
            chatBody.className = 'chat-body bottom-scroll';
            chatBody.childNodes[0].className = 'wrapper-bottom-scroll';
        }

    },[currentConversation])
    
    return(
            <>
                {currentConversation?
                <>
                    <ChatHeader conversationId={currentConversation._id} status={status} initiateVideoCall={initiateVideoCall} convoId={currentConversation._id} chatUser={chatUser} handleClick={handleClick}/>
                    <div className='chat-body' onClick={emojiClose}>
                        <div className='wrapper'>
                            {currentConversation.texts.map((text)=>(
                                <Conversation key={text._id} img={chatUser?.img} recieved={text.sender_id === userId? text : null} sent={text.sender_id === user.user._id? text : null}/>
                            ))}
                        </div>
                    </div>
                    <Snackbar open={open} autoHideDuration={600} onClose={handleClose}>
                        <Alert  severity="success" sx={{ marginBottom:"50vh", marginLeft:"25vw",width: '10rem' }}>
                        Image added!
                        </Alert>
                    </Snackbar>
                    <TextInput handleEmojiClick={handleEmojiClick} handleSubmit={handleSubmit} handleEmojiPicker={handleEmojiPicker} emojiPicker={emojiPicker} text={text} handleTextChange={handleTextChange} handleImageChange={handleImageChange} image={image} />
                </>:
                <>
                    <ChatHeader conversationId={null} status={status} initiateVideoCall={initiateVideoCall} chatUser={chatUser} handleClick={handleClick}/>
                    <div className='chat-body start-convo' onClick={emojiClose}>Start a conversation</div>
                    <TextInput handleEmojiClick={handleEmojiClick} handleSubmit={handleSubmit} handleEmojiPicker={handleEmojiPicker} emojiPicker={emojiPicker} text={text} handleTextChange={handleTextChange} handleImageChange={handleImageChange} image={image} />
                </>}
            </>
    )
}