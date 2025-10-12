import React, { useState, useRef, useEffect } from 'react';
import type { Message as MessageType } from './types';
import Message from './Message';
import TeamWorkspace from './TeamWorkspace';
// import { getSocket  } from '../../utils/socket';
import { useAppSelector } from '../customHooks/reduxCustomHook';
import LoadingPage from '../Loading/LoadingPage';
const ChatWorkspace: React.FC = () => {
    const [messages, setMessages] = useState<MessageType[]>() || []
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const { channel_id, status, messagesBox, channel_name, channel_type } = useAppSelector(state => state.ChatBoxReducer);

    const scrollToBottom = () => {    // scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => { // scroll to bottom when messages change
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        setMessages([]);
    };

    if (status === 'loading') {
        return (<LoadingPage />)
    } else if (status === 'error') {
        return (<div className="h-[calc(100vh-4.8rem)] flex items-center justify-center">
            <h1 className="text-2xl font-bold text-red-600">Error loading messages. Please try again later.</h1>
        </div>)
    } else {
        setMessages(messagesBox);
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
                        <p className="text-sm text-gray-600">Channel • Everyone can view and join this channel</p>
                    </div>
                    <div
                        ref={messagesContainerRef}
                        className="flex-1 overflow-y-auto p-6"
                    >
                        <div className="max-w-4xl mx-auto">
                            {messages && messages.map((message) => (
                                <Message key={message.id} message={message} />
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