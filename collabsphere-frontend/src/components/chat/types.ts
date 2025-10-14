export interface Message {
    id: string | null;
    channelId: number;
    senderId: number;
    text: string;
    attachments?: Array<{
        url: string;
        name?: string;
        size?: number;
        mime?: string;
    }>;
    sequence?: number;
    read_by?: number[];
    status?: 'sent' | 'delivered' | 'read';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface User {
    initials: string;
    name: string;
    role: string;
}