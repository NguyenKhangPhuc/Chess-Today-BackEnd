import { Server, Socket } from "socket.io";
import {
    GAME_TYPE
    , MessageAttributes, MoveAttributes, Player, TokenAttributes, UserAttributes
} from "../types/types";
import Game from "../models/game";
import MatchMakingQueue from "../matchmaking";
import Message from "../models/message";
import ChatBox from "../models/chatbox";
import User from "../models/user";
import { sequelize } from "../utils/db";
import Move from "../models/move";


const userIdToSocketIdMap = new Map<string, string>();
const rapidQueue = new MatchMakingQueue();
const blitzQueue = new MatchMakingQueue();
const rocketQueue = new MatchMakingQueue();

declare module "socket.io" {
    interface Socket {
        user?: TokenAttributes;
    }
}

export const setUpSocket = (io: Server) => {
    io.on('connect', (socket: Socket) => {

        console.log('CLient connected');
        if (socket.user?.id) {
            userIdToSocketIdMap.set(socket.user.id, socket.id);
        }

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);

        });
        socket.on('join_queue', async (type: string, user: UserAttributes, timeSetting: { title: string, value: number, mode: GAME_TYPE }) => {
            const player: Player = { ...user, time: timeSetting.value };
            if (!socket.user) {
                console.log('User not authenticated');
                return;
            }
            if (socket.user?.id != undefined) {
                if (timeSetting.mode == GAME_TYPE.RAPID) {
                    console.log('Rapid');
                    rapidQueue.add(player, GAME_TYPE.RAPID);
                    console.log(rapidQueue);
                } else if (timeSetting.mode == GAME_TYPE.BLITZ) {
                    console.log('Blitz');
                    blitzQueue.add(player, GAME_TYPE.BLITZ);
                    console.log(blitzQueue);
                } else {
                    console.log('Rocket');
                    rocketQueue.add(player, GAME_TYPE.ROCKET);
                    console.log(rocketQueue);
                }

            }
            let bestMatch;
            if (timeSetting.mode == GAME_TYPE.RAPID) {
                bestMatch = rapidQueue.findMatch(player, player.elo, GAME_TYPE.RAPID, 100);
            } else if (timeSetting.mode == GAME_TYPE.BLITZ) {
                bestMatch = blitzQueue.findMatch(player, player.blitzElo, GAME_TYPE.BLITZ, 50);
            } else {
                bestMatch = rocketQueue.findMatch(player, player.rocketElo, GAME_TYPE.ROCKET, 50);
            }

            if (bestMatch) {
                if (timeSetting.mode == GAME_TYPE.RAPID) {
                    rapidQueue.remove(player.id);
                    rapidQueue.remove(bestMatch.id);

                } else if (timeSetting.mode == GAME_TYPE.BLITZ) {
                    blitzQueue.remove(player.id);
                    blitzQueue.remove(bestMatch.id);
                } else {
                    rocketQueue.remove(player.id);
                    rocketQueue.remove(bestMatch.id);
                }

                const player_1_socketId = userIdToSocketIdMap.get(player.id);
                const player_2_socketId = userIdToSocketIdMap.get(bestMatch.id);
                if (!player_1_socketId || !player_2_socketId) {
                    console.log('One of the players is not connected');
                    return;
                }
                const response = await Game.create({
                    player1Id: player.id,
                    player2Id: bestMatch.id,
                    player1TimeLeft: player.time,
                    player2TimeLeft: bestMatch.time,
                    gameType: timeSetting.mode
                });
                io.to(player_1_socketId).emit('match_found', { opponent: bestMatch, roomId: response.id, type });
                io.to(player_2_socketId).emit('match_found', { opponent: player.id, roomId: response.id, type });
            }
        });

        socket.on('exit_queue', () => {
            const userId = socket.user?.id;
            if (!userId) {
                return;
            }
            rapidQueue.remove(userId);
            blitzQueue.remove(userId);
            rocketQueue.remove(userId);
            console.log(rapidQueue);
            socket.emit('exit_queue', 'exit successfully');
        });

        socket.on('board_state_change', async ({ opponentId, roomId, fen, newTimeLeft, newMove }: { opponentId: string, roomId: string, fen: string, newTimeLeft: number, newMove: MoveAttributes }) => {
            if (!socket.user) {
                throw new Error('Not authenticated');
            }
            const opponentSocketId = userIdToSocketIdMap.get(opponentId);
            const currentUserSocketId = userIdToSocketIdMap.get(socket.user.id)!;
            if (!opponentSocketId) {
                throw new Error('Incorrect opponent');
            }
            const t = await sequelize.transaction();
            const game = await Game.findByPk(roomId);

            if (!game) throw new Error("Game not found");
            try {
                if (socket.user.id === game.player1Id) {
                    const newPlayer1LastMoveTime = new Date();
                    const [_, rows] = await Game.update({
                        player1TimeLeft: newTimeLeft,
                        player1LastMoveTime: newPlayer1LastMoveTime,
                        fen: fen
                    },
                        { where: { id: roomId }, returning: true });
                    await Move.create(newMove);
                    await t.commit();
                    console.log("This is response", rows[0].toJSON());
                    io.to(opponentSocketId).emit('board_state_change', rows[0].toJSON());
                    io.to(currentUserSocketId).emit('board_state_change', rows[0].toJSON());
                } else {
                    const newPlayer2LastMoveTime = new Date();
                    const [_, rows] = await Game.update({
                        player2TimeLeft: newTimeLeft,
                        player2LastMoveTime: newPlayer2LastMoveTime,
                        fen: fen
                    }, { where: { id: roomId }, returning: true },);
                    await Move.create(newMove);
                    await t.commit();
                    console.log("This is response", rows[0].toJSON());
                    io.to(opponentSocketId).emit('board_state_change', rows[0].toJSON());
                    io.to(currentUserSocketId).emit('board_state_change', rows[0].toJSON());
                }
            } catch (error) {
                console.log(error);
            }
        });

        socket.on('announce_new_message', (opponentId: string) => {
            const opponentSocketId = userIdToSocketIdMap.get(opponentId);
            if (opponentSocketId) {
                io.to(opponentSocketId).emit('announce_new_message', 'new message from your opponent');
            }
        });

        socket.on('new_message', async (message: MessageAttributes) => {
            if (!socket.user) {
                console.log('Not authenticated');
                return;
            }
            try {
                const response = await Message.create(message);
                console.log(response);
                const chatBox = await ChatBox.findByPk(response.chatBoxId, {
                    include: [
                        {
                            model: User,
                            as: 'user1',
                            attributes: { exclude: ['password'] }
                        },
                        {
                            model: User,
                            as: 'user2',
                            attributes: { exclude: ['password'] }
                        },
                        {
                            model: Message,
                            as: 'messages'
                        }
                    ]
                });
                console.log(chatBox);
                const userSocketId = userIdToSocketIdMap.get(socket.user.id);
                const opponentSocketId = userIdToSocketIdMap.get(message.receiverId);
                if (!userSocketId) {
                    console.log('Missing user id');
                    return;
                }
                io.to(userSocketId).emit('new_message', response, chatBox);
                if (!opponentSocketId) {
                    console.log('Missing opponentSocketId');
                    return;
                }
                io.to(opponentSocketId).emit('new_message', response, chatBox);
            } catch (error) {
                console.log(error);
            }

        });

    });
};