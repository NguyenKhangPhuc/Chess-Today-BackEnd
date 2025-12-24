import { spawn } from 'child_process';
import { EngineScore } from '../src/types/types';

export class StockfishEngine {
    private process;

    constructor(path = './engines/stockfish/stockfish-windows-x86-64-avx2.exe') {
        this.process = spawn(path); // chạy file .exe hoặc binary

        this.process.stderr.on('data', (data) => {
            console.error(`Lỗi Stockfish: ${data}`);
        });
    }

    parseScore(line: string): EngineScore | null {
        const mate = line.match(/\bscore\s+mate\s+(-?\d+)/);
        if (mate) return { type: "mate", value: parseInt(mate[1], 10) };
        const cp = line.match(/\bscore\s+cp\s+(-?\d+)/);
        if (cp) return { type: "cp", value: parseInt(cp[1], 10) };
        return null;
    }

    sendCommand(cmd: string) {
        // Gửi lệnh cho engine như "position", "go", v.v.
        this.process.stdin.write(cmd + '\n');
    }

    async evaluateFen(fen: string, depth = 15): Promise<{ bestMove: string; score: EngineScore | null }> {
        return new Promise((resolve) => {
            let bestMove = '';
            let score: EngineScore | null;

            this.sendCommand(`uci`);
            this.sendCommand(`ucinewgame`);
            this.sendCommand(`position fen ${fen}`);
            this.sendCommand(`go depth ${depth}`);

            // Đọc đầu ra của Stockfish
            this.process.stdout.on('data', (data: Buffer) => {
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
    }

    async evaluateMoveScore(fen: string, moveUci: string, depth = 15): Promise<{ score: EngineScore | null }> {
        return new Promise((resolve) => {
            let score: EngineScore | null;

            this.sendCommand('uci');
            this.sendCommand('isready');
            this.sendCommand(`position fen ${fen}`);
            this.sendCommand(`go depth ${depth} searchmoves ${moveUci}`);

            this.process.stdout.on('data', (data: Buffer) => {
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
    }

    normalizeScore(score: EngineScore | null): EngineScore | null {
        if (score) {
            if (score.type != 'mate') {
                score.value = score.value / 100;
            } else {
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

