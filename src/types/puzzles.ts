import { PUZZLE_LEVEL } from "./enum";

export interface PuzzleAttributes {
    id: string,
    fen: string,
    title: string,
    difficulty: PUZZLE_LEVEL,
    createdAt?: string,
    updatedAt?: string,
}