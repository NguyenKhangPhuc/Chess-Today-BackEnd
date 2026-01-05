import { GAME_TYPE } from "../types/enum";
import { Player } from "../types/user";

class MatchMakingQueue {
    public playerQueue: Array<Player> = [];

    public isUserExist(playerId: string) {
        return this.playerQueue.find(e => e.id === playerId);
    }
    // Add user to the queue with the elo ascending order
    public add(player: Player, gameType: GAME_TYPE) {
        // If the player already exists -? return;
        if (this.isUserExist(player.id)) {
            return;
        }

        // If the queue length == 0 -> just add the user to the queue
        if (this.playerQueue.length === 0) {
            this.playerQueue.push(player);
            return;
        }

        // Using binary search method to insert the player with startIndex = 0
        let startIndex = 0;
        // With endIndex = length of the playerQueue - 1
        let endIndex = this.playerQueue.length > 0 ? this.playerQueue.length - 1 : 0;

        // While start <= endIndex
        while (startIndex <= endIndex) {

            // Calculate the middle index and get the user Elo at that position
            const mid = Math.floor((startIndex + endIndex) / 2);
            // Get the middle user correct elo base on gameType
            const foundedPlayerElo = this.getCorrectElo(this.playerQueue[mid], gameType);
            // Get the user correct elo base on gameType
            const currentPlayerElo = this.getCorrectElo(player, gameType);
            // If response = null -> return
            if (!foundedPlayerElo || !currentPlayerElo) {
                console.log('Error: elo not match');
                return;
            }
            // If the middle user's elo smaller than the to-be-added user elo -> narrow the range by set the startIndex = mid + 1
            if (foundedPlayerElo < currentPlayerElo) {
                startIndex = mid + 1;
            } else if (foundedPlayerElo > currentPlayerElo) {
                // Else if the middle user's elo bigger than the to-be-added user elo -> narrow the range by set the endIndex = mid - 1;
                endIndex = mid - 1;
            } else {
                // Else if the foundedPlayerElo == current PlayerElo -> startIndex = mid
                startIndex = mid;
                break;
            }
        }
        // Insert the player at the position startIndex, everything behind is pushed to the right
        this.playerQueue.splice(startIndex, 0, player);
    }

    // Remove the play from queue
    public remove(playerId: string) {
        // Here we dont use the binary search because the user is not sorted by id
        // Linear search
        const index = this.playerQueue.findIndex((e) => e.id === playerId);
        if (index !== -1) {
            this.playerQueue.splice(index, 1);
        }
    }

    // Find match and return the best suitable player
    public findMatch(player: Player, gameType: GAME_TYPE, delta: number, joinAt = Date.now()) {
        // Get the user elo base on the gameType
        const playerElo = this.getCorrectElo(player, gameType);
        // Calculate the min max elo (range of the elo to be checked)
        if (!playerElo) {
            console.log('Error type not match');
            this.remove(player.id);
            return;
        };
        const minElo = playerElo - delta;
        const maxElo = playerElo + delta;
        // Using binary search to search the index of the user base on elo
        let startIndex = 0;
        let endIndex = this.playerQueue.length > 0 ? this.playerQueue.length - 1 : 0;
        while (startIndex <= endIndex) {
            // Get the mid player's elo, compare it with the min elo (after - delta) and update start/end Index based on the compare result
            const mid = Math.floor((startIndex + endIndex) / 2);
            const foundedPlayerElo = this.getCorrectElo(this.playerQueue[mid], gameType);
            if (!foundedPlayerElo) {
                console.log('Error type not match');
                this.remove(player.id);
                this.remove(this.playerQueue[mid].id);
                return;
            }
            if (foundedPlayerElo < minElo) {
                startIndex = mid + 1;
            } else if (foundedPlayerElo > minElo) {
                endIndex = mid - 1;
            } else {
                startIndex = mid;
                break;
            }
        }
        let score: number = Infinity;
        let bestMatch: Player | null = null;
        // Loop from the current index to the end of the queue and also return if the foundPlayerELo > maxElo
        for (let i = startIndex; i < this.playerQueue.length && this.playerQueue[i].time === player.time; i++) {
            // Get the current index player elo base on the gameType
            const foundedPlayerElo = this.getCorrectElo(this.playerQueue[i], gameType);
            // If the playerInQueue is the user -> skip it
            const playerInQueue = this.playerQueue[i];
            if (playerInQueue.id === player.id) continue;// If elo null -> error
            if (!foundedPlayerElo) {
                this.remove(player.id);
                this.remove(playerInQueue.id);
                return;
            }
            // If elo > maxElo -> out of range -> return
            if (foundedPlayerElo > maxElo) break;
            // If not start to calculate the waitingTime
            const waitingTime = Date.now() - joinAt;
            // Calculate the eloDiff
            const eloDiff = Math.abs(foundedPlayerElo - playerElo);
            // Calculate the current player score and compare with its the best score so far to find the bestmatch
            const playerInQueueScore = eloDiff - waitingTime / 1000;
            if (playerInQueueScore < score) {
                score = playerInQueueScore;
                bestMatch = playerInQueue;
            }
        }
        return bestMatch;
    }

    getCorrectElo(player: Player, gameType: GAME_TYPE) {
        // Get the correct elo based on the type
        switch (gameType) {
            case GAME_TYPE.BLITZ:
                return player.blitzElo;
            case GAME_TYPE.RAPID:
                return player.elo;
            case GAME_TYPE.ROCKET:
                return player.rocketElo;
            default:
                return null;
        }
    }
}

export default MatchMakingQueue;