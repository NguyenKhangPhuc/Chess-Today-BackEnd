import { GAME_STATUS, GAME_TYPE } from "./enum";

export interface GameAttributes {
    id?: string,
    player1Id: string,
    player2Id: string,
    winnerId?: string,
    loserId?: string,
    isDraw: boolean
    endedAt?: Date,
    createdAt?: string,
    updatedAt?: string,
    fen?: string,
    player1LastMoveTime?: Date,
    player2LastMoveTime?: Date,
    player1TimeLeft: number,
    player2TimeLeft: number,
    gameType: GAME_TYPE,
    gameStatus: GAME_STATUS,
    isBotGame?: boolean
    latestScore: number,
}
