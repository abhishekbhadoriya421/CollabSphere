import React, { type RefObject, useState, useRef } from 'react';
import type { Message as MessageType } from './types';
import { useClickOutside } from '../customHooks/useClickOutside';

interface MessageProps {
    message: MessageType;
    current_user_id: number;
    channel_type: 'dm' | 'group' | 'channel' | 'none' | undefined;
    arrangedUserData: Map<number, string>;
    handleMoreManu: (message_id: string) => void;
    moreOptions: string;
    userMoreOptionsRef: RefObject<HTMLDivElement | null>;
    handleOnClickReact: (message_id: string, emoji: string) => void;
    handleDeleteMessage: (message_id: string) => void;
}

const Message: React.FC<MessageProps> = ({
    message,
    current_user_id,
    channel_type,
    arrangedUserData,
    handleMoreManu,
    moreOptions,
    userMoreOptionsRef,
    handleOnClickReact,
    handleDeleteMessage
}) => {
    // Add local state for showing reactions for this specific message
    const [showReactions, setShowReactions] = useState(false);

    // Create a ref for this message's reaction picker
    const reactionPickerRef = useRef<HTMLDivElement>(null);

    const reactEmojis = ['👍', '❤️', '😂', '😁', '😥'];
    const isCurrentUser = (message.senderId === current_user_id);

    // Handle react button click for this message
    const handleReactClick = () => {
        setShowReactions(true);
        handleMoreManu(''); // Close more options if open
    };

    // Handle emoji click for this message
    const handleEmojiClick = (emoji: string) => {
        handleOnClickReact(message._id!, emoji);
        setShowReactions(false); // Close reactions after selecting
    };

    // Close reactions when clicking outside
    useClickOutside(reactionPickerRef, () => {
        setShowReactions(false);
    });

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
                        <div className={`flex items-center gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                            <p
                                onClick={() => handleMoreManu(message._id!)}
                                className={`inline-block px-4 py-2 rounded-lg max-w-md break-words ${isCurrentUser
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                {message.text}
                            </p>
                            {message && message.reactions && message.reactions.map((react, index) => {
                                return <span key={index}>{react.react}</span>
                            })}
                            <div>
                                {/* Use local showReactions state and ref for this message */}
                                {showReactions && (
                                    <div ref={reactionPickerRef} className="flex gap-1 bg-white p-2 rounded-lg shadow-lg border border-gray-200 absolute top-full z-20">
                                        {reactEmojis.map((ele, index) => {
                                            return <i
                                                onClick={() => handleEmojiClick(ele)}
                                                className='font-bold text-2xl cursor-pointer hover:scale-110 transition-transform'
                                                key={index}
                                            >{ele}</i>
                                        })}
                                    </div>
                                )}

                                {
                                    moreOptions === message._id &&
                                    <div ref={userMoreOptionsRef} className={`absolute z-10 flex flex-col rounded-lg shadow-lg bg-white text-sm border border-gray-200 ${isCurrentUser ? 'mr-2' : 'ml-2'}`}>
                                        <button className="block w-full text-left px-3 py-2 hover:bg-gray-100">
                                            💬 Reply
                                        </button>
                                        <button onClick={handleReactClick} className="block w-full text-left px-3 py-2 hover:bg-gray-100">
                                            😊 React
                                        </button>
                                        <button
                                            onClick={() => handleDeleteMessage(message._id!)}
                                            className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100">
                                            🗑 Delete
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Message;