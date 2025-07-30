import { RequestHandler } from "express";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "./config";
import models from "../models";
import { TokenAttributes, } from "../types/types";
import { Socket } from "socket.io";



declare module "express-serve-static-core" {
    interface Request {
        user?: TokenAttributes;
    }
}

export const tokenExtractor: RequestHandler = async (req, res, next) => {
    const token = req.headers.authorization;
    if (token && token.startsWith('Bearer ')) {
        const receivedToken = token.substring(7);
        const decodedToken = jwt.verify(receivedToken, JWT_SECRET) as TokenAttributes;
        if (decodedToken) {
            const foundUser = await models.User.findByPk(decodedToken.id);
            if (foundUser) {
                req.user = foundUser;
                console.log(req);
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
            next(new Error('invalid Token'));
            return;
        }
    } else {
        next(new Error('Missing Token'));
        return;
    }
    next();
};