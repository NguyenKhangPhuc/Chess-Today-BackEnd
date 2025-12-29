import MatchMakingQueue from "../../matchmaking";
import { GAME_TYPE, Player } from "../../types/types";

class MatchQueue {
    private rapidQueue = new MatchMakingQueue();
    private blitzQueue = new MatchMakingQueue();
    private rocketQueue = new MatchMakingQueue();

    matchMaking(player: Player, gameType: GAME_TYPE) {
        const correctQueue = this.getCorrectQueue(gameType);
        let bestMatch;
        if (correctQueue) {
            correctQueue.add(player, gameType);
            bestMatch = correctQueue.findMatch(player, gameType, 100);
            if (bestMatch) {
                correctQueue.remove(player.id);
                correctQueue.remove(bestMatch.id);
            }
        }
        return bestMatch;
    }

    getCorrectQueue(gameType: GAME_TYPE) {
        switch (gameType) {
            case GAME_TYPE.BLITZ:
                return this.blitzQueue;
            case GAME_TYPE.RAPID:
                return this.rapidQueue;
            case GAME_TYPE.ROCKET:
                return this.rocketQueue;
            default:
                return null;
        }
    }

    exitQueue(userId: string, gameType: GAME_TYPE) {

        const correctQueue = this.getCorrectQueue(gameType);
        correctQueue?.remove(userId);
    }
}

export const gameQueue = new MatchQueue();