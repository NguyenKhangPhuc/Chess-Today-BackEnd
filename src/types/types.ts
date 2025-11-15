import { Request } from "express";



export interface UserAttributes {
    id: string;
    name: string;
    username: string;
    password?: string;
    status?: boolean;
    isOnline: boolean;
    onlineAt?: Date,
    createdAt?: string | undefined,
    updatedAt?: string | undefined,
    elo: number
    rocketElo: number,
    blitzElo: number,
    isBot: boolean
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
    senderId?: string
    receiverId?: string,
    status: INVITATION_STATUS,
    createdAt?: string,
    updatedAt?: string,
}

export interface FriendAttributes {
    id?: string,
    userId: string,
    friendId: string,
    createdAt?: string,
    updatedAt?: string,
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
    createdAt?: string,
    updatedAt?: string,
    fen?: string,
    player1LastMoveTime?: Date,
    player2LastMoveTime?: Date,
    player1TimeLeft: number,
    player2TimeLeft: number,
    gameType: GAME_TYPE,
    gameStatus: GAME_STATUS,
    isBotGame?: boolean
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
    promotion?: string,
    playerTimeLeft: number,
    moverId: string
}

export enum INVITATION_STATUS {
    'pending',
    'accepted',
    'rejected'
}

export interface GameMessageAttributes {
    id?: string,
    gameId: string,
    senderId: string,
    content: string,
    createdAt?: Date,
    updatedAt?: Date
}

export interface ChatBoxAttributes {
    id: string,
    user1Id: string,
    user2Id: string,
    createdAt?: Date,
    updatedAt?: Date,
}

export interface MessageAttributes {
    id: string,
    chatBoxId: string,
    senderId: string,
    receiverId: string,
    content: string,
    createdAt?: Date,
    updatedAt?: Date

}

export enum GAME_TYPE {
    ROCKET = 'Rocket',
    BLITZ = 'Blitz',
    RAPID = 'Rapid',
}

export enum GAME_STATUS {
    FINISHED = 'finished',
    PLAYING = 'playing',
}

export interface EngineScore {
    type: string,
    value: number
}

export interface CustomError {
    name: string,
    message: string
}

export enum PUZZLE_LEVEL {
    EASY = 1,
    MEDIUM = 2,
    HARD = 3,
}

export interface PuzzleAttributes {
    id: string,
    fen: string,
    title: string,
    difficulty: PUZZLE_LEVEL,
    createdAt?: string,
    updatedAt?: string,
}

export enum PUZZLE_STATUS {
    SOLVED = 'solved',
    UNSOLVED = 'unsolved',
}

export interface UserPuzzleRelationAttribute {
    id?: string,
    userId: string,
    puzzleId: string,
    attempt: number,
    status: PUZZLE_STATUS,
    createdAt?: string,
    updatedAt?: string
}

export interface PuzzleMoveAttributes {
    id: string,
    before: string,
    after: string,
    color: string,
    piece: string,
    from: string,
    to: string,
    san: string,
    lan: string,
    promotion?: string,
    puzzleId: string,
}



export interface ChallengeAttributes {
    id?: string,
    senderId: string,
    receiverId: string,
    status: INVITATION_STATUS,
    gameType: GAME_TYPE,
    playerTime: number,
    isSenderPlayer1: boolean,
    createdAt?: string,
    updatedAt?: string,
}