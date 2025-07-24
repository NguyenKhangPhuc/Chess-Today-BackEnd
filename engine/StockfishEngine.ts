import { spawn } from 'child_process';

export class StockfishEngine {
    private process;

    constructor(path = './engines/stockfish/stockfish-windows-x86-64-avx2.exe') {
        this.process = spawn(path); // chạy file .exe hoặc binary

        this.process.stderr.on('data', (data) => {
            console.error(`Lỗi Stockfish: ${data}`);
        });
    }

    sendCommand(cmd: string) {
        // Gửi lệnh cho engine như "position", "go", v.v.
        this.process.stdin.write(cmd + '\n');
    }

    async evaluateFen(fen: string, depth = 15): Promise<{ bestMove: string; pv: Array<string>; score: number | string }> {
        return new Promise((resolve) => {
            let bestMove = '';
            const pv: Array<string> = [];
            let score: number | string;

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
                        const infoParts = line.split(' ');
                        const scoreIndex = infoParts.indexOf('score');
                        if (scoreIndex !== -1) {
                            const scoreType = infoParts[scoreIndex + 1];
                            const scoreValue = infoParts[scoreIndex + 2];
                            if (scoreType === 'cp') {
                                score = parseInt(scoreValue, 10);
                            } else if (scoreType === 'mate') {
                                score = `Check mate ${scoreValue}`;
                            }
                        }
                    }
                    if (line.startsWith('bestmove')) {
                        bestMove = line.split(' ')[1];
                        resolve({ bestMove, pv, score });
                    }
                }
            });
        });
    }

    stop() {
        this.process.kill(); // Dừng engine sau khi xong
    }
}
