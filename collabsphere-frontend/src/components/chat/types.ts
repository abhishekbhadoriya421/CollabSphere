export interface Message {
    _id: string | null;
    channelId: number;
    senderId: number;
    text: string;
    attachments?: Array<{
        url: string;
        name?: string;
        size?: number;
        mime?: string;
    }>;
    reactions?: Array<{
        react: string;
        reactorId: number;
    }>,
    sequence?: number;
    read_by?: number[];
    status?: 'sent' | 'delivered' | 'read';
    createdAt?: string;
    updatedAt?: string;
}

export interface User {
    initials: string;
    name: string;
    role: string;
}