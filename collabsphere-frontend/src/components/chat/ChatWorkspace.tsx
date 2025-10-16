import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';
import TeamWorkspace from './TeamWorkspace';
import { getSocket } from '../../utils/socket';
import { useAppSelector, useAppDispatch } from '../customHooks/reduxCustomHook';
import LoadingPage from '../Loading/LoadingPage';
import useGetUserCredentials from '../customHooks/getUserCredentials';
import { getAllMessagesByChannelId, setMessage, updateTempMessageId } from '../../features/ChatBoxSlice/ChatBoxSlics';
import { v4 as uuidv4 } from 'uuid';

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
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const { accessToken, user } = useGetUserCredentials();
    const { channel_id, status, messagesBox, channel_name, channel_type, members } = useAppSelector(
        (state) => ({
            channel_id: state.ChatBoxReducer.channel_id,
            status: state.ChatBoxReducer.status,
            messagesBox: state.ChatBoxReducer.messagesBox,
            channel_name: state.ChatBoxReducer.channel_name,
            channel_type: state.ChatBoxReducer.channel_type,
            members: state.ChatBoxReducer.members as { id: number; username: string }[]
        })
    );
    const arrangedUserData = React.useMemo(() => {
        if (!members?.length) return new Map();
        const map = new Map();
        members.forEach((member: { id: number; username: string }) => {
            console.log(member.id + ' ' + member.username)
            map.set(member.id, member.username);
        });
        return map;
    }, [members]);
    const socket = getSocket();
    const scrollToBottom = () => {    // scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => { // scroll to bottom when messages change
        scrollToBottom();
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
                        <TeamWorkspace />
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
                    >
                        <div className="max-w-4xl mx-auto">
                            {messagesBox && user && messagesBox.map((message, index) => (
                                <Message
                                    channel_type={channel_type}
                                    key={index}
                                    message={message}
                                    current_user_id={user.id}
                                    arrangedUserData={arrangedUserData}
                                />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                    <div className="border-t border-gray-200 px-6 py-4">
                        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
                            <div className="flex space-x-4">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
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