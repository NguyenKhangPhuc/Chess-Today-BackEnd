import { ErrorRequestHandler, RequestHandler } from "express";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "./config";
import models from "../models";
import { CustomError, TokenAttributes, } from "../types/types";
import { Socket } from "socket.io";
import * as cookie from 'cookie';
import { UniqueConstraintError } from 'sequelize';

// Additional field in the cookies
type AuthCookies = {
    access_token?: string;
};

// Additional field in the Request
declare module "express-serve-static-core" {
    interface Request {
        user?: TokenAttributes;
    }
}

// Additional field in the Socket
declare module "socket.io" {
    interface Socket {
        user?: TokenAttributes;
    }
}

// Verify the token 
export const tokenExtractor: RequestHandler = async (req, res, next) => {
    // Get the token from the cookies
    const cookies = req.cookies as AuthCookies;
    const token = cookies.access_token;
    if (token) {
        // Verify the token
        const decodedToken = jwt.verify(token, JWT_SECRET) as TokenAttributes;
        if (decodedToken) {
            // Find if the user really exists
            const foundUser = await models.User.findByPk(decodedToken.id);
            if (foundUser) {
                // Store the basic info to the req.user
                req.user = decodedToken;
            } else {
                res.status(404).json({ error: 'Not authenticated' });
                return;
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

// Verify the token when using socket
export const socketTokenExtractor = async (socket: Socket, next: (err?: Error) => void) => {
    // Get all the field from the cookies header
    const cookieHeader = socket.request.headers.cookie;
    console.log('Socket cookie', cookieHeader);
    if (!cookieHeader) {
        return next(new Error('No cookie sent'));
    }
    // Parse the cookies header string to an object
    const cookies = cookie.parse(cookieHeader);
    // Get the access_token from the object
    console.log('This is token from Socket', cookie);
    const token = cookies['access_token'];
    if (token) {
        // Verify the token
        const decodedToken = jwt.verify(token, JWT_SECRET) as TokenAttributes;
        if (decodedToken) {
            // Find if the user really exists
            const foundUser = await models.User.findByPk(decodedToken.id);
            if (foundUser) {
                // Set the socket.user to basic user info
                socket.user = decodedToken;
            } else {
                next(new Error('JsonWebTokenError'));
                return;
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

// Middleware to handle unknown endpoint
export const unknownEndpoint: RequestHandler = (_, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

// Middleware to handle the error, incluing validation error, jsonwebtoken error, 
export const errorHandler: ErrorRequestHandler = (error: CustomError, _, res, next) => {
    console.log(error);
    if (error.name === 'CastError') {
        res.status(400).send({ error: 'malformatted id' });
        return;
    } else if (error.name === 'ValidationError') {
        res.status(400).json({ error: error.message });
        return;
    } else if (error.name === 'JsonWebTokenError' || error.message == 'JsonWebTokenError') {
        res.status(401).json({ error: "invalid token or missing token" });
        return;
    } else if (error.name === 'TokenExpiredError') {
        res.status(401).json({ error: 'token expired' });
        return;
    } else if (error instanceof UniqueConstraintError) {
        res.status(400).json({ error: 'Username already exists' });
        return;
    }
    else {
        res.status(500).json({ error: 'Unknown error' });
    }
    next(error);
};