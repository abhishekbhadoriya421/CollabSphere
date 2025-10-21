import React, { type RefObject } from 'react';
import type { Message as MessageType } from './types';

interface MessageProps {
    message: MessageType;
    current_user_id: number;
    channel_type: 'dm' | 'group' | 'channel' | 'none' | undefined;
    arrangedUserData: Map<number, string>;
    handleCloseMoreManu: (message_id: string) => void;
    moreOptions: string;
    userReactRef: RefObject<HTMLDivElement | null>;
}

const Message: React.FC<MessageProps> = ({ message, current_user_id, channel_type, arrangedUserData, handleCloseMoreManu, moreOptions, userReactRef }) => {
    // const reactEmojis = ['👍', '❤️', '😂', '😁', '😥'];
    const isCurrentUser = (message.senderId === current_user_id);
    return (
        <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-6`}>
            <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} max-w-2xl w-full`}>
                {/* User Avatar */}
                {channel_type !== 'dm' &&
                    <div className={`flex-shrink-0 ${isCurrentUser ? 'ml-4' : 'mr-4'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${isCurrentUser ? 'bg-green-500' : 'bg-purple-500'}`}>
                            photo
                        </div>
                    </div>
                }

                {/* Message Content */}
                <div className="flex-1">
                    <div className={`flex items-baseline ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-1`}>
                        {channel_type !== 'dm' && !isCurrentUser && (
                            <span className="font-semibold text-gray-900 mr-2">{arrangedUserData.has(message.senderId) ? arrangedUserData.get(message.senderId) : message.senderId}</span>
                        )}
                        <span className="text-xs text-gray-500">{message.createdAt}</span>
                    </div>

                    <div
                        className={`flex items-center relative ${isCurrentUser ? 'justify-end' : 'justify-start'
                            }`}
                    >
                        <div onClick={() => handleCloseMoreManu(message._id!)} className={`flex items-center gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                            <p
                                className={`inline-block px-4 py-2 rounded-lg max-w-md break-words ${isCurrentUser
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                {message.text}
                            </p>
                            {
                                moreOptions === message._id &&
                                <div ref={userReactRef} className={` absolute z-10 flex flex-col rounded-lg shadow-lg bg-white text-sm border border-gray-200 ${isCurrentUser ? 'mr-2' : 'ml-2'}`}>
                                    <button className="block w-full text-left px-3 py-2 hover:bg-gray-100">
                                        💬 Reply
                                    </button>
                                    <button className="block w-full text-left px-3 py-2 hover:bg-gray-100">
                                        😊 React
                                    </button>
                                    <button className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100">
                                        🗑 Delete
                                    </button>
                                </div>
                            }

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Message;