"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpSocket = void 0;
const connection_handler_1 = require("./handler/connection.handler");
const matchmaking_handler_1 = require("./handler/matchmaking.handler");
const game_handler_1 = require("./handler/game.handler");
const invitation_handler_1 = require("./handler/invitation.handler");
const message_handler_1 = require("./handler/message.handler");
const challenge_handler_1 = require("./handler/challenge.handler");
const setUpSocket = (io) => {
    io.on('connect', (socket) => __awaiter(void 0, void 0, void 0, function* () {
        // Register the connection handlers
        yield (0, connection_handler_1.registerConnectionHandlers)(socket);
        // Register the match making handlers
        (0, matchmaking_handler_1.registerMatchMakingHandlers)(io, socket);
        // Register the in-game handlers
        (0, game_handler_1.registerInGameHandlers)(io, socket);
        // Register the invitation handler
        (0, invitation_handler_1.registerInvitationHandler)(io, socket);
        // Register the message handler
        (0, message_handler_1.registerMessageHandlers)(io, socket);
        // Register the challenge handler
        (0, challenge_handler_1.registerChallengeHandlers)(io, socket);
    }));
};
exports.setUpSocket = setUpSocket;
