import { Server, Socket } from "socket.io";
import {
    GAME_TYPE
    , MessageAttributes, Player, TokenAttributes, UserAttributes
} from "../types/types";
import Game from "../models/game";
import MatchMakingQueue from "../matchmaking";
import Move from "../models/move";
import models from "../models";
import Message from "../models/message";
import ChatBox from "../models/chatbox";
import User from "../models/user";


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
            console.log(`${socket.user?.id} join queue`);
            if (socket.user?.id != undefined) {
                if (timeSetting.mode == GAME_TYPE.RAPID) {
                    console.log('Rapid');
                    rapidQueue.add(player, GAME_TYPE.RAPID);
                } else if (timeSetting.mode == GAME_TYPE.BLITZ) {
                    console.log('Blitz');
                    blitzQueue.add(player, GAME_TYPE.BLITZ);
                } else {
                    console.log('Rocket');
                    rocketQueue.add(player, GAME_TYPE.ROCKET);
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
                    rapidQueue.remove(player);
                    rapidQueue.remove(bestMatch);

                } else if (timeSetting.mode == GAME_TYPE.BLITZ) {
                    blitzQueue.remove(player);
                    blitzQueue.remove(bestMatch);
                } else {
                    rocketQueue.remove(player);
                    rocketQueue.remove(bestMatch);
                }

                const player_1_socketId = userIdToSocketIdMap.get(player.id);
                const player_2_socketId = userIdToSocketIdMap.get(bestMatch.id);
                if (!player_1_socketId || !player_2_socketId) {
                    console.log('One of the players is not connected');
                    return;
                }
                console.log(player.id);
                console.log(bestMatch.id);
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

        socket.on('board_state_change', async ({ opponentId, roomId, fen }: { opponentId: string, roomId: string, fen: string }) => {
            if (!socket.user) {
                console.log('Not authenticated');
                return;
            }
            const opponentSocketId = userIdToSocketIdMap.get(opponentId);
            if (!opponentSocketId) {
                console.log('Incorrect opponent');
                return;
            }
            try {
                await Game.update({ fen: fen }, { where: { id: roomId } });
                io.to(opponentSocketId).emit('board_state_change', fen);
            } catch (error) {
                console.log(error);
            }


        });

        socket.on('game_time_update', async ({ newLeftTime, gameId, opponentId }: { newLeftTime: number, gameId: string, opponentId: string }) => {
            if (!socket.user) {
                console.log('User not authenticated');
                return;
            }
            const response = await Game.findByPk(gameId, {
                include: [
                    {
                        model: Move,
                        as: 'moveHistory'
                    },
                    {
                        model: models.User,
                        as: 'player1',
                        attributes: { exclude: ['password'] }
                    },
                    {
                        model: models.User,
                        as: 'player2',
                        attributes: { exclude: ['password'] }
                    }
                ]
            });
            if (!response) {
                console.log('Game not found');
                return;
            }
            const player_1_socketId = userIdToSocketIdMap.get(socket.user.id);
            const player_2_socketId = userIdToSocketIdMap.get(opponentId);
            if (!player_1_socketId || !player_2_socketId) {
                console.log('One of the players is not connected');
                return;
            }
            if (socket.user.id === response.player1Id) {
                const newPlayer1LastMoveTime = new Date();
                const result = await response.update({ player1TimeLeft: newLeftTime, player1LastMoveTime: newPlayer1LastMoveTime });

                io.to(player_1_socketId).emit('game_time_update', result);
                io.to(player_2_socketId).emit('game_time_update', result);
            } else {
                const newPlayer2LastMoveTime = new Date();
                const result = await response.update({ player2TimeLeft: newLeftTime, player2LastMoveTime: newPlayer2LastMoveTime });
                io.to(player_1_socketId).emit('game_time_update', result);
                io.to(player_2_socketId).emit('game_time_update', result);
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
        socket.on('new_move_history', (opponentId: string) => {
            const opponentSocketId = userIdToSocketIdMap.get(opponentId);
            if (!opponentSocketId) {
                console.log('no socketid');
                return;
            }
            io.to(opponentSocketId).emit('new_move_history');
        });

    });
};