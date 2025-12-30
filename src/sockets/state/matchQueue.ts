import MatchMakingQueue from "../../matchmaking";
import { Mutex } from "async-mutex";
import { Player } from "../../types/user";
import { GAME_TYPE } from "../../types/enum";
class MatchQueue {
    private rapidQueue = new MatchMakingQueue();
    private blitzQueue = new MatchMakingQueue();
    private rocketQueue = new MatchMakingQueue();
    private mutex = new Mutex();

    async matchMaking(player: Player, gameType: GAME_TYPE): Promise<Player | null> {
        // Find the correct queue
        const correctQueue = this.getCorrectQueue(gameType);
        if (!correctQueue) return null;

        let bestMatch: Player | undefined | null = null;
        // Using mutex to handle race condition
        await this.mutex.runExclusive(() => {
            // add the player to the queue
            correctQueue.add(player, gameType);
            // finding the best match 
            bestMatch = correctQueue.findMatch(player, gameType, 100);

            if (bestMatch) {
                // If exists bestmatch, remove both from the queue
                correctQueue.remove(player.id);
                correctQueue.remove(bestMatch.id);
            }
        });

        return bestMatch;
    }

    // To get the correct queue
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

    // To exit the queue
    exitQueue(userId: string, gameType: GAME_TYPE) {

        const correctQueue = this.getCorrectQueue(gameType);
        correctQueue?.remove(userId);
    }
}

export const gameQueue = new MatchQueue();