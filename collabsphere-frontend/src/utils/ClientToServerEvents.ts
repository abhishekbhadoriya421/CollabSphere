import type { UserReceiveMessage, UserTyping, UserReaction } from "./SharedEventInterfaces";

export interface ClientToServerEvent {
    join_channel: (data: { channel_id: number }) => void;
    typing: (data: UserTyping) => void;
    send_message: (data: UserReceiveMessage) => void;
    send_user_reaction: (data: UserReaction) => void;
}
