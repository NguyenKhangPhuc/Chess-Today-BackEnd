import { Request } from "express";



export interface UserAttributes {
    id?: string;
    name: string;
    username: string;
    password?: string;
    status?: boolean;
    onlineAt?: Date,
    createdAt?: Date,
    updatedAt?: Date,
}

export interface TokenAttributes {
    id: string,
    name: string,
    username: string,
}

export interface Player {
    id: string
}

export interface InvitationAttributes {
    id?: string,
    senderId: string
    receiverId: string,
    status: INVITATION_STATUS
}

export interface FriendAttributes {
    id?: string,
    userId: string,
    friendId: string,
}

export interface UserRequest extends Request {
    user: TokenAttributes;
}

export interface GameAttributes {
    id?: string,
    player1Id: string,
    player2Id: string,
    winnerId: string,
    endedAt?: Date,
    createdAt?: Date,
    updatedAt?: Date,
    fen?: string
}

export interface MoveAttributes {
    id?: string,
    gameId: number,
    player1Move: string,
    player2Move: string,
}

enum INVITATION_STATUS {
    'pending',
    'accepted',
    'rejected'
}