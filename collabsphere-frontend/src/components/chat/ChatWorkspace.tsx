import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';
import TeamWorkspace from './TeamWorkspace';
import { getSocket } from '../../utils/socket';
import { useAppSelector, useAppDispatch } from '../customHooks/reduxCustomHook';
import LoadingPage from '../Loading/LoadingPage';
import useGetUserCredentials from '../customHooks/getUserCredentials';
import { getAllMessagesByChannelId, setMessage, updateTempMessageId,getMessageOffset } from '../../features/ChatBoxSlice/ChatBoxSlics';
import { v4 as uuidv4 } from 'uuid';
import EmojiPickerComponent from '../emoji/EmojiPicker';
import { type EmojiClickData } from "emoji-picker-react";
interface MessageData {
    content: string;
    channel_id: number;
    sender_id: number;
    message_temp_id: string;
}

interface MessageSaved {
    message_temp_id: string;
    channel_id: number;
    message_id: string;
}
const ChatWorkspace: React.FC = () => {
    const dispatch = useAppDispatch();
    const [newMessage, setNewMessage] = useState('');
    const [showEmoji, setShowEmoji] = useState(false);
    const hasMounted = useRef(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesStartRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const { accessToken, user } = useGetUserCredentials();
    const channel_id = useAppSelector((state) => state.ChatBoxReducer.channel_id);
    const status = useAppSelector((state) => state.ChatBoxReducer.status);
    const messagesBox = useAppSelector((state) => state.ChatBoxReducer.messagesBox);
    const channel_name = useAppSelector((state) => state.ChatBoxReducer.channel_name);
    const channel_type = useAppSelector((state) => state.ChatBoxReducer.channel_type);
    const members = useAppSelector((state) => state.ChatBoxReducer.members);
    const socket = getSocket();
    

    const arrangedUserData = React.useMemo(() => {
        if (!members?.length) return new Map();
        const map = new Map();
        members.forEach((member: { id: number; username: string }) => {
            map.set(member.id, member.username);
        });
        return map;
    }, [members]);


    const scrollToBottom = () => {    // scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); 
    };

     const scrollToTop = () => {    // scroll to bottom when messages change
        messagesStartRef.current?.scrollIntoView({ behavior: 'smooth' }); 
    };
    useEffect(() => { // scroll to bottom when messages change
        if(hasMounted.current === true){
            console.log(messagesStartRef)
        }else{
            scrollToBottom();
        }

    }, [messagesBox]);

    useEffect(() => {
        if (!socket) return;

        socket.emit('join_channel', { channel_id: channel_id! });
        /**
         * Handle message receive 
         */
        const handleReceive = (data: MessageData): void => {
            dispatch(setMessage({
                content: data.content,
                channel_id: data.channel_id,
                sender_id: data.sender_id,
                message_temp_id: data.message_temp_id
            }));
        };

        const handleMessageSaved = (data: MessageSaved) => {
            dispatch(updateTempMessageId({
                message_temp_id: data.message_temp_id,
                message_id: data.message_id
            }));
        }

        socket.on('receive_message', handleReceive);
        socket.on('message_saved', handleMessageSaved);
        return () => {
            socket.off('receive_message', handleReceive);
            socket.off('message_saved', handleMessageSaved);
        };

    }, [channel_id, socket, dispatch])

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        const socket = getSocket();
        if (socket && user) { // User has no probability of having null value
            const tempMessageId = uuidv4();
            socket.emit('send_message', { channel_id: channel_id!, content: newMessage, sender_id: user.id!, message_temp_id: tempMessageId as string }); // generate temporary message id to store
            dispatch(setMessage({ content: newMessage, channel_id: channel_id, sender_id: user.id, message_temp_id: tempMessageId }));
        }
        setNewMessage('');
    };

    useEffect(() => {
        if (status === 'idle' && channel_id && accessToken) {
            dispatch(getAllMessagesByChannelId({ accessToken: accessToken, channel_id: channel_id }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, channel_id]);

    const handleCloseEmoji = () => {
        setShowEmoji(false);
    }

    const handleSelectEmoji = (emojiData: EmojiClickData) => {
        setNewMessage((prev: string) => prev + emojiData.emoji);
    }

    const handelScroll = (e: React.UIEvent<HTMLElement>) => {
        const top = e.currentTarget.scrollTop;
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }
        if (top === 0) {
            dispatch(getMessageOffset({channel_id})); 
        }
    }

    if (status === 'loading' && user) {
        return (<LoadingPage />)
    } else if (status === 'error') {
        return (<div className="h-[calc(100vh-4.8rem)] flex items-center justify-center">
            <h1 className="text-2xl font-bold text-red-600">Error loading messages. Please try again later.</h1>
        </div>)
    } else {
        return (
            <div className="flex h-[calc(100vh-4.8rem)] bg-white">
                {
                    (channel_type === 'group' || channel_type === 'channel') ?
                        <TeamWorkspace channel_name={channel_name} user_id={user?.id} channel_type={channel_type} arrangedUserData={arrangedUserData} />
                        : null
                }
                <div className="flex-1 flex flex-col">
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h2 className="text-lg font-semibold text-gray-900">{channel_name}: {channel_id}</h2>
                        {channel_type === 'channel' ? <p className="text-sm text-gray-600">Channel • Everyone can view and join this channel</p> : null}
                    </div>
                    <div
                        ref={messagesContainerRef}
                        className="flex-1 overflow-y-auto p-6"
                        onScroll={(e) => handelScroll(e)}
                    >
                        <div className="max-w-4xl mx-auto">
                            {messagesBox && user && messagesBox.map((message, index) => (
                                <div>
                                (index === 0)?
                                    <Message
                                        channel_type={channel_type}
                                        key={index}
                                        message={message}
                                        current_user_id={user.id}
                                        arrangedUserData={arrangedUserData}
                                    />
                                :
                                <Message
                                    channel_type={channel_type}
                                    key={index}
                                    message={message}
                                    current_user_id={user.id}
                                    arrangedUserData={arrangedUserData}
                                />
                                </div> 
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                    <div className="border-t border-gray-200 px-6 py-4">
                        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center justify-center w-10 h-10 text-gray-500 text-2xl cursor-pointer hover:text-gray-700 transition">
                                    <div className='relative  inline-block'>
                                        {showEmoji === false ? <i className="fa-regular fa-face-smile" onClick={() => setShowEmoji(true)}></i> : <EmojiPickerComponent handleSelectEmoji={handleSelectEmoji} handleCloseEmoji={handleCloseEmoji} />}
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition"
                                >
                                    Send
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        );
    }
};

export default ChatWorkspace;