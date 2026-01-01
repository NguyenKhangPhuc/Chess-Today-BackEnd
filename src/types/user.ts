import { TokenAttributes } from "./types";

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
    isBot: boolean,
    isVerified: boolean,
}




export interface Player extends UserAttributes {
    time: number,
}

export interface UserRequest extends Request {
    user: TokenAttributes;
}