import { Server, Socket } from "socket.io";
import {
    TokenAttributes,
} from "../types/types";
import { registerConnectionHandlers } from "./handler/connection.handler";
import { registerMatchMakingHandlers } from "./handler/matchmaking.handler";
import { registerInGameHandlers } from "./handler/game.handler";
import { registerInvitationHandler } from "./handler/invitation.handler";
import { registerMessageHandlers } from "./handler/message.handler";
import { registerChallengeHandlers } from "./handler/challenge.handler";
import { registerFriendShipHandler } from "./handler/friendship.handler";


declare module "socket.io" {
    interface Socket {
        user?: TokenAttributes;
    }
}

export const setUpSocket = (io: Server) => {
    io.on('connect', async (socket: Socket) => {
        // Register the connection handlers
        await registerConnectionHandlers(socket);
        // Register the match making handlers
        registerMatchMakingHandlers(io, socket);
        // Register the in-game handlers
        registerInGameHandlers(io, socket);
        // Register the invitation handler
        registerInvitationHandler(io, socket);
        // Register the message handler
        registerMessageHandlers(io, socket);
        // Register the challenge handler
        registerChallengeHandlers(io, socket);
        // Register the friendship handler
        registerFriendShipHandler(io, socket);
    });
};