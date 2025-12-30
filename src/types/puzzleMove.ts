export interface PuzzleMoveAttributes {
    id: string,
    before: string,
    after: string,
    color: string,
    piece: string,
    from: string,
    to: string,
    san: string,
    lan: string,
    promotion?: string,
    puzzleId: string,
}

