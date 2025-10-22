import type { UserReceiveMessage, UserTyping, UserReaction } from "./SharedEventInterfaces";

export interface MessageSaved {
    message_temp_id: string;
    channel_id: number;
    message_id: string;
}

export interface ServerToClientEvent {
    receive_message: (data: UserReceiveMessage) => void;
    user_typing: (data: UserTyping) => void;
    user_joined: (data: { user_Id: number }) => void;
    message_saved: (data: MessageSaved) => void;
    receive_user_reaction: (data: UserReaction) => void;
}