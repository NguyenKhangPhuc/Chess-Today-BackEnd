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
    id: number;
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