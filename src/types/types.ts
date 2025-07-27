import { Request } from "express";


export interface University {
    id: string,
    name: string,
    city: string,
    overview: string,
    ranking: string,
    tuition: string,
    scholarship: string,
    type: string,
    website: string,
}

export interface UserAttributes {
    id?: number;
    name: string;
    username: string;
    email: string;
    password?: string;
    status?: boolean;
    onlineAt?: Date,
    createdAt?: Date,
    updatedAt?: Date,
}

export interface TokenAttributes {
    id: number,
    name: string,
    username: string,
    email: string,
}

export interface UserAuthInfoRequest extends Request {
    user: TokenAttributes
}

export interface Player {
    socketId: string
}

export interface InvitationAttributes {
    id?: number,
    senderId: string
    receiverId: string,
    status: INVITATION_STATUS
}

export interface FriendAttributes {
    id?: number,
    userId: string,
    friendId: string,
}

export interface GameAttributes {
    id?: number,
    player1Id: number,
    player2Id: number,
    winnerId: number,
    endedAt?: Date,
    createdAt?: Date,
    updatedAt?: Date,
}

enum INVITATION_STATUS {
    'pending',
    'accepted',
    'rejected'
}