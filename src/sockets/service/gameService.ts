import Game from "../../models/game";
import { GAME_TYPE } from "../../types/types";

class GameService {
    createMatch(player1Id: string, player2Id: string, player1Time: number, player2Time: number, gameType: GAME_TYPE) {
        return Game.create({
            player1Id: player1Id,
            player2Id: player2Id,
            player1TimeLeft: player1Time,
            player2TimeLeft: player2Time,
            gameType: gameType
        });
    }

    updatePlayerOneMove(newTimeLeft: number, gameId: string, fen: string) {
        const newPlayerLastMoveTime = new Date();
        return Game.update({
            player1TimeLeft: newTimeLeft,
            player1LastMoveTime: newPlayerLastMoveTime,
            fen: fen
        },
            { where: { id: gameId }, returning: true });
    }

    updatePlayerTwoMove(newTimeLeft: number, gameId: string, fen: string) {
        const newPlayerLastMoveTime = new Date();
        return Game.update({
            player2TimeLeft: newTimeLeft,
            player2LastMoveTime: newPlayerLastMoveTime,
            fen: fen
        },
            { where: { id: gameId }, returning: true });

    }
}

export const gameService = new GameService();