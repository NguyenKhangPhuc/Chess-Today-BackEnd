

import { Player } from "../types/types";


class MatchMakingQueue {
    public playerQueue: Array<Player> = [];

    public add(player: Player) {
        const isExistedPlayer = this.playerQueue.find(e => e.id === player.id);
        if (isExistedPlayer) {
            return;
        }
        console.log(player.elo);
        if (this.playerQueue.length === 0) {
            this.playerQueue.push(player);
            console.log(this.playerQueue);
            return;
        }
        let startIndex = 0;
        let endIndex = this.playerQueue.length > 0 ? this.playerQueue.length - 1 : 0;
        while (startIndex <= endIndex) {

            const mid = Math.floor((startIndex + endIndex) / 2);
            if (this.playerQueue[mid].elo < player.elo) {
                startIndex = mid + 1;
            } else if (this.playerQueue[mid].elo > player.elo) {
                endIndex = mid - 1;
            } else {
                startIndex = mid;
                break;
            }
        }
        console.log('startIndex, endIndex', startIndex, endIndex);
        this.playerQueue.splice(startIndex, 0, player);
        console.log(this.playerQueue);
    }

    public remove(player: Player) {
        const index = this.playerQueue.findIndex((e) => e.id === player.id);
        if (index !== -1) {
            this.playerQueue.splice(index, 1);
        }

    }

    public findMatch(player: Player, delta: number, joinAt = Date.now()) {
        const minElo = player.elo - delta;
        const maxElo = player.elo + delta;
        let startIndex = 0;
        let endIndex = this.playerQueue.length > 0 ? this.playerQueue.length - 1 : 0;
        while (startIndex <= endIndex) {
            const mid = Math.floor((startIndex + endIndex) / 2);
            if (this.playerQueue[mid].elo < minElo) {
                startIndex = mid + 1;
            } else if (this.playerQueue[mid].elo > minElo) {
                endIndex = mid - 1;
            } else {
                startIndex = mid;
                break;
            }
        }
        let score: number = Infinity;
        let bestMatch: Player | null = null;
        console.log('start,end', startIndex, endIndex);
        for (let i = startIndex; i < this.playerQueue.length && this.playerQueue[i].elo < maxElo && this.playerQueue[i].time === player.time; i++) {

            const playerInQueue = this.playerQueue[i];
            if (playerInQueue.id === player.id) continue;
            const waitingTime = Date.now() - joinAt;
            const eloDiff = Math.abs(playerInQueue.elo - player.elo);
            const playerInQueueScore = eloDiff - waitingTime / 1000;
            if (playerInQueueScore < score) {
                score = playerInQueueScore;
                bestMatch = playerInQueue;
            }
        }
        return bestMatch;
    }
}

export default MatchMakingQueue;