"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.unknownEndpoint = exports.socketTokenExtractor = exports.tokenExtractor = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const models_1 = __importDefault(require("../models"));
const cookie = __importStar(require("cookie"));
const sequelize_1 = require("sequelize");
// Verify the token 
const tokenExtractor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the token from the cookies
    const cookies = req.cookies;
    const token = cookies.access_token;
    if (token) {
        // Verify the token
        const decodedToken = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        if (decodedToken) {
            // Find if the user really exists
            const foundUser = yield models_1.default.User.findByPk(decodedToken.id);
            if (foundUser) {
                // Store the basic info to the req.user
                req.user = decodedToken;
            }
            else {
                res.status(404).json({ error: 'Not authenticated' });
                return;
            }
        }
        else {
            res.status(404).json({ error: 'invalid Token' });
            return;
        }
    }
    else {
        res.status(404).json({ error: 'Missing Token' });
        return;
    }
    next();
});
exports.tokenExtractor = tokenExtractor;
// Verify the token when using socket
const socketTokenExtractor = (socket, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const decodedToken = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        if (decodedToken) {
            // Find if the user really exists
            const foundUser = yield models_1.default.User.findByPk(decodedToken.id);
            if (foundUser) {
                // Set the socket.user to basic user info
                socket.user = decodedToken;
            }
            else {
                next(new Error('JsonWebTokenError'));
                return;
            }
        }
        else {
            next(new Error('JsonWebTokenError'));
            return;
        }
    }
    else {
        next(new Error('JsonWebTokenError'));
        return;
    }
    next();
});
exports.socketTokenExtractor = socketTokenExtractor;
// Middleware to handle unknown endpoint
const unknownEndpoint = (_, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};
exports.unknownEndpoint = unknownEndpoint;
// Middleware to handle the error, incluing validation error, jsonwebtoken error, 
const errorHandler = (error, _, res, next) => {
    console.log(error);
    if (error.name === 'CastError') {
        res.status(400).send({ error: 'malformatted id' });
        return;
    }
    else if (error.name === 'ValidationError') {
        res.status(400).json({ error: error.message });
        return;
    }
    else if (error.name === 'JsonWebTokenError' || error.message == 'JsonWebTokenError') {
        res.status(401).json({ error: "invalid token or missing token" });
        return;
    }
    else if (error.name === 'TokenExpiredError') {
        res.status(401).json({ error: 'token expired' });
        return;
    }
    else if (error instanceof sequelize_1.UniqueConstraintError) {
        res.status(400).json({ error: 'Username already exists' });
        return;
    }
    else {
        res.status(500).json({ error: 'Unknown error' });
    }
    next(error);
};
exports.errorHandler = errorHandler;
