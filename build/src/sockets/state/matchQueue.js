"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameQueue = void 0;
const matchmaking_1 = __importDefault(require("../../matchmaking"));
const async_mutex_1 = require("async-mutex");
const enum_1 = require("../../types/enum");
class MatchQueue {
    constructor() {
        this.rapidQueue = new matchmaking_1.default();
        this.blitzQueue = new matchmaking_1.default();
        this.rocketQueue = new matchmaking_1.default();
        this.mutex = new async_mutex_1.Mutex();
    }
    matchMaking(player, gameType) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find the correct queue
            const correctQueue = this.getCorrectQueue(gameType);
            if (!correctQueue)
                return null;
            let bestMatch = null;
            // Using mutex to handle race condition
            yield this.mutex.runExclusive(() => {
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
        });
    }
    // To get the correct queue
    getCorrectQueue(gameType) {
        switch (gameType) {
            case enum_1.GAME_TYPE.BLITZ:
                return this.blitzQueue;
            case enum_1.GAME_TYPE.RAPID:
                return this.rapidQueue;
            case enum_1.GAME_TYPE.ROCKET:
                return this.rocketQueue;
            default:
                return null;
        }
    }
    // To exit the queue
    exitQueue(userId, gameType) {
        const correctQueue = this.getCorrectQueue(gameType);
        correctQueue === null || correctQueue === void 0 ? void 0 : correctQueue.remove(userId);
    }
}
exports.gameQueue = new MatchQueue();
