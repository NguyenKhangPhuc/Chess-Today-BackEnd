import { PUZZLE_STATUS } from "./enum";


export interface UserPuzzleRelationAttribute {
    id?: string,
    userId: string,
    puzzleId: string,
    attempt: number,
    status: PUZZLE_STATUS,
    createdAt?: string,
    updatedAt?: string
}