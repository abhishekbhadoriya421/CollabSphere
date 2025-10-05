export interface Message {
    id: string;
    userInitials: string;
    userName: string;
    content: string;
    timestamp: string;
    time: string;
    isCurrentUser?: boolean;
}

export interface User {
    initials: string;
    name: string;
    role: string;
}