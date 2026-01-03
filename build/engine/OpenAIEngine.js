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
exports.openAIEngine = void 0;
const openai_1 = require("openai");
const config_1 = require("../src/utils/config");
class OpenAIEngine {
    constructor(apiKey) {
        this.client = new openai_1.OpenAI({ apiKey });
    }
    explainMove(_a) {
        return __awaiter(this, arguments, void 0, function* ({ fen, bestMove, score }) {
            var _b;
            const prompt = `
        You are a chess coach. I will provide you with the current board position in FEN format and the move that the Player is about to move in this FEN situation. Also the score of the move will be sent.
Your tasks:
Look at the FEN carefully, understand the board. Limit the inaccuracy of the answer down as low as posible. 

Classify the move into one of the following categories (from best to worst): Brilliant, Great, Best, Excellent, Good, Book, Inaccuracy, Mistake, Miss, Blunder.

Give a short explanation (only 1–2 short sentences, no long sentences) about why it fits that category.

Always return the answer in this format:

<move> is a <category> move, <short explanation>


Now follow the requirements: Give me the answer for this move:
The fen of the move is: ${fen},
The move have just made is: ${bestMove},
The score after make the move is: score type: ${score === null || score === void 0 ? void 0 : score.type} - value: ${score === null || score === void 0 ? void 0 : score.value}
`;
            const response = yield this.client.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
            });
            console.log('Đây là câu trả lời', response.choices[0].message);
            return ((_b = response.choices[0].message.content) === null || _b === void 0 ? void 0 : _b.trim()) || 'Không có giải thích.';
        });
    }
}
exports.openAIEngine = new OpenAIEngine(config_1.OPENAI_API_KEY);
