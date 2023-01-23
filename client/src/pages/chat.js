import { useEffect, useRef, useState, } from 'react';
import ChatCard from '../components/chatCard';
import Navbar from '../components/navbar';
import ChatBox from '../components/chatBox';
import {useNavigate, useParams} from 'react-router-dom';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import useSocket from '../hooks/useSocket';
import useCometChat from '../hooks/useCometChat';
import useStatus from '../hooks/useStatus';

export default function Chat(){
    const params = useParams();
    const navigate = useNavigate();

    //search data
    const [search, setSearch] = useState('');
    const [result,setResult] = useState('');

    const {onlineUsers, setOnlineUsers} = useStatus();
    const {user} = useAuth();
    const {socket} = useSocket();

    //cometchat initialization state
    const {init} = useCometChat();

    // all conversations of the user
    const [conversations,setConversations] = useState('');

    //text submission states
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [emojiPicker, setEmojiPicker] = useState(false);
    const [formData, setFormData] = useState({});

    //chat user data
    const [chatUser, setChatUser] = useState({});
    // chat user ID
    const userId = params.cuid;
    
    const [open, setOpen] = useState(false);
    const [socketId, setSocketId] = useState('');

    //cometchat widget launch
    const launchCount = useRef(0);
    const [launched, setLaunched] = useState(false);

    //getting all conversations of the user and joining room using conversation id
    async function getAllConversations(){
        const response = await axios.get(`/conversation/${user.user._id}`);
        const allConversations = response.data.conversation;
        if(allConversations.length > 0){
            allConversations.map((conversation)=>(
                socket.emit('join-room',conversation._id)
            ))
            setConversations(allConversations);
        }
    };

    //fetching socket id of the chat user
    function fetchSocketId(){
        socket.emit('sendUserId',userId);
        socket.on('getSocketId',(data)=>{
            if(data){
                setSocketId(data);
            }
        })
    }

    //search user
    async function handleSearch(e){
        e.preventDefault();
        try{
            const response = await axios.get(`/user/${search}`,{headers:{'Content-Type': 'application/json'}});
            setResult(response.data);
            setSearch('');
        }
        catch(err){
            console.log(err);
        }
    }

    //text submission
    async function handleSubmit(e){
        e.preventDefault();
        const response = await axios.post('/conversation', formData, {headers:{'Content-Type':'multipart/form-data'}});
        const currentConversation = response.data.conversation?.filter(convo => convo.members.includes(userId))[0];
        if(currentConversation?.texts.length === 1){
            socket.emit('join-room',socketId);
            socket.emit('updateConversation',socketId);
            setText('');
            setImage('');
        }
        else{
            socket.emit('updateConversation',currentConversation._id);
            setText('');
            setImage('');
        }
    }

    //getting chat user data
    async function getChatUserData(){
        const response = await axios.get(`/chatuser/${userId}`);
        if(response.data.user.password){
            const {password,...rest} = response.data.user;
            setChatUser(rest);
        }else{
            setChatUser(response.data.user)
        }
    }

    function handleClick(){
        navigate('/');
    };

    function handleEmojiPicker(){
        setEmojiPicker(true);
    }

    function emojiClose(e){
        if(e.target.className === 'sent-container' || 'recieved-info' || 'text-img-sent' || 'text-img-recieved' || 'conversation' || 'user-dp'){
            setEmojiPicker(false);
        }
    }

    function handleEmojiClick(e,emoji){
        let txt = text;
        txt += emoji.emoji;
        setText(txt);
    }

    function handleTextChange(e){
        setText(e.target.value);
    }

    function handleImageChange(e){
        setImage(e.target.files[0]);
        setOpen(true);
    }
    
    function handleClose(){
        setOpen(false);
    }

    useEffect(()=>{
        // if(userId != user?.user._id){
        //     getChatUserData()
        // }
        // else{
        //     navigate('/')
        // }
    },[])

    //data for text submission
    useEffect(()=>{
        setFormData({
            text: text,
            image: image,
            sender_id: user.user._id,
            receiver_id: userId
        })
    },[text,image])

    //launch cometchat widget
    useEffect(()=>{
        if(init && !launched &&launchCount.current === 0){
            window.CometChatWidget.launch({
                "widgetID": process.env.REACT_APP_COMETCHAT_WIDGET_ID,
                "target": "#cometchat",
                "roundedCorners": "true",
                "height": "0px",
                "width": "0px",
                "defaultID": user?.user._id, //default UID (user) or GUID (group) to show,
                "defaultType": 'user' //user or group
            })
            setLaunched(true);
            launchCount.current = launchCount.current + 1;
        }
    },[init,launched])
    
    //socket connection
    useEffect(()=>{
        if(socket.connected == false){
            socket.connect();
            socket.emit('addNewUser',user?.user._id);
        }

        //triggers whenever a conversation is updated
        socket.on('conversationUpdated',()=>{
            getAllConversations();
        })
    },[socket])

    useEffect(()=>{
        getAllConversations();
        getChatUserData();
        fetchSocketId();
    },[])

    // gets all online users
    useEffect(()=>{
        if(!onlineUsers){
            socket.on('getUsers',(users)=>{
                setOnlineUsers(users)
            })
        }
    },[onlineUsers])

    return(
        <>
            <div className="chat-box">
                <ChatBox status={onlineUsers?.filter(user => user.userId === userId).length !== 0? true : false} currentConversation={conversations? conversations.filter(conversation => conversation.members.includes(userId))[0]: null} handleSubmit={handleSubmit && handleSubmit} handleClick={handleClick} emojiClose={emojiClose} handleEmojiPicker={handleEmojiPicker} handleEmojiClick={handleEmojiClick}  handleTextChange={handleTextChange} handleImageChange={handleImageChange} handleClose={handleClose} chatUser={chatUser} userId={userId} user={user} open={open} emojiPicker={emojiPicker} text={text} image={image}/>
            </div>
            <div className="navbar">
                <Navbar image={user?.user.img && user.user.img}/>
                <form className="search-form" onSubmit={handleSearch}>
                    <input value={search} className="search-bar" type="search" placeholder="Search" onChange={(e)=>setSearch(e.target.value)}/> 
                </form>
            </div>
            <div className="sidebar">
                    {result?<div className="chatcard-holder"><ChatCard status={onlineUsers?.filter(user => user.userId === result._id).length !== 0? true : false} searchData={result} currentUserId={user.user._id} data={null}/></div>: conversations? conversations.map((conversation,i)=>{
                        const userId = conversation.members.find(id=> id !== user.user._id);
                        const activeUser = onlineUsers?.filter(user => user.userId === userId)
                        return(<div key={i} className={userId === params.cuid? 'chatcard-holder active': 'chatcard-holder'}><ChatCard key={conversation._id} userId={userId} status={activeUser?.length !== 0? true : false} searchData={null} currentUserId={user.user._id} data={conversation}/></div>)
                    }):null}
            </div>
            <div id='cometchat'></div>
        </>
    )
}