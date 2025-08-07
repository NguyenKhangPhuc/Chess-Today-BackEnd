import { Request } from "express";



export interface UserAttributes {
    id: string;
    name: string;
    username: string;
    password?: string;
    status?: boolean;
    onlineAt?: Date,
    createdAt?: Date,
    updatedAt?: Date,
    elo: number
    rocketElo: number,
    blitzElo: number,
}



export interface TokenAttributes {
    id: string,
    name: string,
    username: string,
}



export interface Player extends UserAttributes {
    time: number,
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
    winnerId?: string,
    loserId?: string,
    isDraw: boolean
    endedAt?: Date,
    createdAt?: Date,
    updatedAt?: Date,
    fen?: string,
    player1LastMoveTime?: Date,
    player2LastMoveTime?: Date,
    player1TimeLeft: number,
    player2TimeLeft: number,
    gameType: GAME_TYPE
}

export interface MoveAttributes {
    id?: string,
    gameId: string,
    before: string,
    after: string,
    color: string,
    piece: string,
    from: string,
    to: string,
    san: string,
    lan: string,
    moverId: string
}

enum INVITATION_STATUS {
    'pending',
    'accepted',
    'rejected'
}

export interface GameMessageAttributes {
    id: string,
    gameId: string,
    senderId: string,
    content: string,
    createdAt?: Date,
    updatedAt?: Date
}

export enum GAME_TYPE {
    ROCKET = 'Rocket',
    BLITZ = 'Blitz',
    RAPID = 'Rapid',
}