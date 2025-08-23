

import { GAME_TYPE, Player } from "../types/types";


class MatchMakingQueue {
    public playerQueue: Array<Player> = [];

    public add(player: Player, gameType: GAME_TYPE) {
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
            let foundedPlayerElo;
            let currentPlayerElo;
            if (gameType === GAME_TYPE.RAPID) {
                foundedPlayerElo = this.playerQueue[mid].elo;
                currentPlayerElo = player.elo;
            } else if (gameType === GAME_TYPE.BLITZ) {
                foundedPlayerElo = this.playerQueue[mid].blitzElo;
                currentPlayerElo = player.blitzElo;
            } else if (gameType === GAME_TYPE.ROCKET) {
                foundedPlayerElo = this.playerQueue[mid].rocketElo;
                currentPlayerElo = player.rocketElo;
            } else {
                throw new Error('Game type math making not given');
            }
            if (foundedPlayerElo < currentPlayerElo) {
                startIndex = mid + 1;
            } else if (foundedPlayerElo > currentPlayerElo) {
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

    public remove(playerId: string) {
        const index = this.playerQueue.findIndex((e) => e.id === playerId);
        if (index !== -1) {
            this.playerQueue.splice(index, 1);
        }

    }

    public findMatch(player: Player, playerElo: number, gameType: GAME_TYPE, delta: number, joinAt = Date.now()) {
        const minElo = playerElo - delta;
        const maxElo = playerElo + delta;
        let startIndex = 0;
        let endIndex = this.playerQueue.length > 0 ? this.playerQueue.length - 1 : 0;
        while (startIndex <= endIndex) {
            const mid = Math.floor((startIndex + endIndex) / 2);
            let foundedPlayerElo;
            if (gameType === GAME_TYPE.RAPID) {
                foundedPlayerElo = this.playerQueue[mid].elo;
            } else if (gameType === GAME_TYPE.BLITZ) {
                foundedPlayerElo = this.playerQueue[mid].blitzElo;
            } else if (gameType === GAME_TYPE.ROCKET) {
                foundedPlayerElo = this.playerQueue[mid].rocketElo;
            } else {
                throw new Error('Game type math making not given');
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
        console.log('start,end', startIndex, endIndex);
        for (let i = startIndex; i < this.playerQueue.length && this.playerQueue[i].time === player.time; i++) {
            let foundedPlayerElo;
            if (gameType === GAME_TYPE.RAPID) {
                foundedPlayerElo = this.playerQueue[i].elo;
            } else if (gameType === GAME_TYPE.BLITZ) {
                foundedPlayerElo = this.playerQueue[i].blitzElo;
            } else if (gameType === GAME_TYPE.ROCKET) {
                foundedPlayerElo = this.playerQueue[i].rocketElo;
            } else {
                throw new Error('Game type math making not given');
            }
            if (foundedPlayerElo > maxElo) break;
            const playerInQueue = this.playerQueue[i];
            if (playerInQueue.id === player.id) continue;
            const waitingTime = Date.now() - joinAt;
            const eloDiff = Math.abs(foundedPlayerElo - playerElo);
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