
import { OpenAI } from 'openai';
import { OPENAI_API_KEY } from '../src/utils/config';
import { EngineScore } from '../src/types/types';

interface boardState {
    fen: string;
    bestMove: string;
    score?: EngineScore | null;

}
class OpenAIEngine {
    private client: OpenAI;

    constructor(apiKey: string) {
        this.client = new OpenAI({ apiKey });
    }

    async explainMove({ fen, bestMove, score }: boardState): Promise<string> {
        const prompt = `
        You are a chess coach. I will provide you with the current board position in FEN format and the move that the Player is about to move in this FEN situation. Also the score of the move will be sent.
Your tasks:
Look at the FEN carefully, understand the board. Limit the inaccuracy of the answer down as low as posible. 

Classify the move into one of the following categories (from best to worst): Brilliant, Great, Best, Excellent, Good, Book, Inaccuracy, Mistake, Miss, Blunder.

Give a short explanation (only 1–2 short sentences, no long sentences) about why it fits that category. Do not add score to the explanation

Always return the answer in this format:

<move> is a <category> move, <short explanation>


Now follow the requirements: Give me the answer for this move:
The fen of the move is: ${fen},
The move have just made is: ${bestMove},
The score after make the move is: score type: ${score?.type} - value: ${score?.value}
`;

        const response = await this.client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
        });
        return response.choices[0].message.content?.trim() || 'Không có giải thích.';
    }
}

export const openAIEngine = new OpenAIEngine(OPENAI_API_KEY);
