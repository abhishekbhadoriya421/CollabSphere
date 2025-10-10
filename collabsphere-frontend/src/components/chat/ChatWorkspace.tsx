import React, { useState, useRef, useEffect } from 'react';
import type { Message as MessageType } from './types';
import Message from './Message';
// import { getSocket  } from '../../utils/socket';
// import { useAppSelector } from '../customHooks/reduxCustomHook';
const ChatWorkspace: React.FC = () => {
    const [messages, setMessages] = useState<MessageType[]>() || []
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    // const { channel_id } = useAppSelector(state => state.ChatBoxReducer);

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

    return (
        <div className="flex h-[calc(100vh-4.8rem)] bg-white">
            <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-900">Collaborers</h1>
                    <p className="text-sm text-gray-600 mt-1">Welcome to the team workspace</p>
                </div>
                <div className="p-4 border-b border-gray-200">
                    <p className="text-sm text-gray-700">
                        <strong>Theme:</strong> I am aware, are processes intelligent, coaching you more or collaborating with everyone here!
                    </p>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>10:23 AM</span>
                        <span>10:30 AM</span>
                    </div>
                </div>
                <div className="flex-1 p-4">
                    <h3 className="font-semibold text-gray-700 mb-3">Channels</h3>
                    <ul className="space-y-2">
                        <li>
                            <div className="flex items-center text-gray-700 hover:text-purple-600 cursor-pointer">
                                <span className="text-green-500 mr-2">●</span>
                                <span className="font-medium">Collaboration Sphere</span>
                                <span className="text-xs text-gray-500 ml-2">public</span>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center text-gray-500 hover:text-purple-600 cursor-pointer ml-4">
                                <span className="text-gray-400 mr-2">●</span>
                                <span>abhishek bhadoriya</span>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center text-gray-500 hover:text-purple-600 cursor-pointer ml-4">
                                <span className="text-gray-400 mr-2">●</span>
                                <span>nisha</span>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center text-gray-500 hover:text-purple-600 cursor-pointer ml-4">
                                <span className="text-gray-400 mr-2">●</span>
                                <span>vivek</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="flex-1 flex flex-col">
                <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">Collaboration Sphere</h2>
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
};

export default ChatWorkspace;