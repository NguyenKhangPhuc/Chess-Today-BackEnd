import { ErrorRequestHandler, RequestHandler } from "express";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "./config";
import models from "../models";
import { CustomError, TokenAttributes, } from "../types/types";
import { Socket } from "socket.io";

type AuthCookies = {
    access_token?: string;
};

declare module "express-serve-static-core" {
    interface Request {
        user?: TokenAttributes;
    }
}

declare module "socket.io" {
    interface Socket {
        user?: TokenAttributes;
    }
}

export const tokenExtractor: RequestHandler = async (req, res, next) => {
    const cookies = req.cookies as AuthCookies;
    const token = cookies.access_token;
    console.log('This is token from REST', token);
    if (token) {
        const decodedToken = jwt.verify(token, JWT_SECRET) as TokenAttributes;
        if (decodedToken) {
            const foundUser = await models.User.findByPk(decodedToken.id);
            if (foundUser) {
                req.user = foundUser;

            }
        } else {
            res.status(404).json({ error: 'invalid Token' });
            return;
        }
    } else {
        res.status(404).json({ error: 'Missing Token' });
        return;
    }
    next();
};

export const socketTokenExtractor = async (socket: Socket, next: (err?: Error) => void) => {
    const token = socket.handshake.auth.token as string | null;
    console.log('token', token);
    if (token) {
        const decodedToken = jwt.verify(token, JWT_SECRET) as TokenAttributes;
        if (decodedToken) {
            const foundUser = await models.User.findByPk(decodedToken.id);
            if (foundUser) {
                socket.user = foundUser;
            }
        } else {
            next(new Error('JsonWebTokenError'));
            return;
        }
    } else {
        next(new Error('JsonWebTokenError'));
        return;
    }
    next();
};

export const unknownEndpoint: RequestHandler = (_, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

export const errorHandler: ErrorRequestHandler = (error: CustomError, _, res, next) => {
    console.log(error);
    if (error.name === 'CastError') {
        res.status(400).send({ error: 'malformatted id' });
        return;
    } else if (error.name === 'ValidationError') {
        res.status(400).json({ error: error.message });
        return;
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        res.status(400).json({ error: 'expected `username` need to be unique' });
        return;
    } else if (error.name === 'JsonWebTokenError' || error.message == 'JsonWebTokenError') {
        res.status(401).json({ error: "invalid token or missing token" });
        return;
    } else if (error.name === 'TokenExpiredError') {
        res.status(401).json({ error: 'token expired' });
        return;
    } else {
        res.status(500).json({ error, message: 'Unknown error' });
    }
    next(error);
};