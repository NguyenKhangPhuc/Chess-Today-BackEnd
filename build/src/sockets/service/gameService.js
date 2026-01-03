"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameService = void 0;
const game_1 = __importDefault(require("../../models/game"));
class GameService {
    // Create the game with given info
    createMatch(player1Id, player2Id, player1Time, player2Time, gameType) {
        return game_1.default.create({
            player1Id: player1Id,
            player2Id: player2Id,
            player1TimeLeft: player1Time,
            player2TimeLeft: player2Time,
            gameType: gameType
        });
    }
    // Update the game's player1 time and last move time when player1 move
    updatePlayerOneMove(newTimeLeft, gameId, fen) {
        const newPlayerLastMoveTime = new Date();
        return game_1.default.update({
            player1TimeLeft: newTimeLeft,
            player1LastMoveTime: newPlayerLastMoveTime,
            fen: fen
        }, { where: { id: gameId }, returning: true });
    }
    // Update the game's player2 time and last move time when player2 move
    updatePlayerTwoMove(newTimeLeft, gameId, fen) {
        const newPlayerLastMoveTime = new Date();
        return game_1.default.update({
            player2TimeLeft: newTimeLeft,
            player2LastMoveTime: newPlayerLastMoveTime,
            fen: fen
        }, { where: { id: gameId }, returning: true });
    }
}
exports.gameService = new GameService();
