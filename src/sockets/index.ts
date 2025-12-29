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


declare module "socket.io" {
    interface Socket {
        user?: TokenAttributes;
    }
}

export const setUpSocket = (io: Server) => {
    io.on('connect', async (socket: Socket) => {
        await registerConnectionHandlers(socket);
        registerMatchMakingHandlers(io, socket);
        registerInGameHandlers(io, socket);
        registerInvitationHandler(io, socket);
        registerMessageHandlers(io, socket);
        registerChallengeHandlers(io, socket);
    });
};