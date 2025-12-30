
export interface MoveAttributes {
    id?: string,
    gameId: string,
    before: string,
    after: string,
    color: string,
    piece: string,
    from: string,
    to: string,
    san: string,
    lan: string,
    promotion?: string,
    playerTimeLeft: number,
    moverId: string
    moveScore: number
}