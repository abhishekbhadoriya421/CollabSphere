import type { UserReceiveMessage, UserTyping, UserReaction } from "./SharedEventInterfaces";

interface DeleteUserMessage {
    message_id: string;
    channel_id: number;
}
export interface ClientToServerEvent {
    join_channel: (data: { channel_id: number }) => void;
    typing: (data: UserTyping) => void;
    send_message: (data: UserReceiveMessage) => void;
    send_user_reaction: (data: UserReaction) => void;
    send_delete_message: (data: DeleteUserMessage) => void;
}
