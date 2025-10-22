export interface UserReaction {
    reactor_id: number;
    react: string;
    channel_id: number;
    message_id: string;
}

export interface UserTyping {
    user_id: number;
    channel_id: number;
}

export interface UserReceiveMessage {
    message_temp_id: string;
    content: string;
    sender_id: number;
    channel_id: number;
}
