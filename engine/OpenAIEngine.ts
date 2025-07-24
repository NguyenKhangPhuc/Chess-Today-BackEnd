
import { OpenAI } from 'openai';
import { OPENAI_API_KEY } from '../src/utils/config';

interface boardState {
    fen: string;
    bestMove: string;
    pv?: Array<string>;
    score?: string | number;

}
class OpenAIEngine {
    private client: OpenAI;

    constructor(apiKey: string) {
        this.client = new OpenAI({ apiKey });
    }

    async explainMove({ fen, bestMove, pv, score, }: boardState): Promise<string> {
        const prompt = `
Bạn là một huấn luyện viên cờ vua. Máy vừa chọn nước đi: **${bestMove}**

- FEN hiện tại: ${fen}
- Đánh giá: ${typeof score === 'number' ? `Điểm số: ${score}` : score}
- Chuỗi nước đi dự đoán: ${pv?.join(' ')}

Giải thích đơn giản, rõ ràng, dễ hiểu vì sao máy lại chọn nước đi này.
`;

        const response = await this.client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
        });
        console.log('Đây là câu trả lời', response.choices[0].message);
        return response.choices[0].message.content?.trim() || 'Không có giải thích.';
    }
}

export const openAIEngine = new OpenAIEngine(OPENAI_API_KEY);
