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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockfishEngine = void 0;
const child_process_1 = require("child_process");
class StockfishEngine {
    constructor(path = './engines/stockfish/stockfish-windows-x86-64-avx2.exe') {
        this.process = (0, child_process_1.spawn)(path); // chạy file .exe hoặc binary
        this.process.stderr.on('data', (data) => {
            console.error(`Lỗi Stockfish: ${data}`);
        });
    }
    parseScore(line) {
        const mate = line.match(/\bscore\s+mate\s+(-?\d+)/);
        if (mate)
            return { type: "mate", value: parseInt(mate[1], 10) };
        const cp = line.match(/\bscore\s+cp\s+(-?\d+)/);
        if (cp)
            return { type: "cp", value: parseInt(cp[1], 10) };
        return null;
    }
    sendCommand(cmd) {
        // Gửi lệnh cho engine như "position", "go", v.v.
        this.process.stdin.write(cmd + '\n');
    }
    evaluateFen(fen_1) {
        return __awaiter(this, arguments, void 0, function* (fen, depth = 15) {
            return new Promise((resolve) => {
                let bestMove = '';
                let score;
                this.sendCommand(`uci`);
                this.sendCommand(`ucinewgame`);
                this.sendCommand(`position fen ${fen}`);
                this.sendCommand(`go depth ${depth}`);
                // Đọc đầu ra của Stockfish
                this.process.stdout.on('data', (data) => {
                    const lines = data.toString().split('\n');
                    console.log(lines);
                    for (const line of lines) {
                        if (line.startsWith('info')) {
                            score = this.parseScore(line);
                        }
                        if (line.startsWith('bestmove')) {
                            bestMove = line.split(' ')[1];
                            score = this.normalizeScore(score);
                            resolve({ bestMove, score });
                        }
                    }
                });
            });
        });
    }
    evaluateMoveScore(fen_1, moveUci_1) {
        return __awaiter(this, arguments, void 0, function* (fen, moveUci, depth = 15) {
            return new Promise((resolve) => {
                let score;
                this.sendCommand('uci');
                this.sendCommand('isready');
                this.sendCommand(`position fen ${fen}`);
                this.sendCommand(`go depth ${depth} searchmoves ${moveUci}`);
                this.process.stdout.on('data', (data) => {
                    const lines = data.toString().split('\n');
                    console.log(lines);
                    for (const line of lines) {
                        if (line.startsWith('info')) {
                            score = this.parseScore(line);
                        }
                        if (line.startsWith('bestmove')) {
                            score = this.normalizeScore(score);
                            resolve({ score });
                        }
                    }
                });
            });
        });
    }
    normalizeScore(score) {
        if (score) {
            if (score.type != 'mate') {
                score.value = score.value / 100;
            }
            else {
                score.value = Infinity;
            }
            score.value = Math.max(-5, Math.min(5, score.value));
        }
        return score;
    }
    stop() {
        this.process.kill(); // Dừng engine sau khi xong
    }
}
exports.StockfishEngine = StockfishEngine;
