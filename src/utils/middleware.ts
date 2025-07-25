import { NextFunction, Response } from "express";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "./config";
import User from "../models";
import { TokenAttributes, UserAuthInfoRequest } from "../types/types";
export const tokenExtractor = async (req: UserAuthInfoRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (token && token.startsWith('Bearer ')) {
        const receivedToken = token.substring(7);
        const decodedToken = jwt.verify(receivedToken, JWT_SECRET) as TokenAttributes;
        if (decodedToken) {
            const foundUser = await User.findByPk(decodedToken.id);
            if (foundUser) {
                req.user = foundUser;
            }
        } else {
            res.status(400).json({ error: 'invalid Token' });
        }
    } else {
        res.status(400).json({ error: 'Missing Token' });
    }
    next();
};

