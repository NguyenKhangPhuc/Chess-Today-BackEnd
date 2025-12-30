export interface GameMessageAttributes {
    id?: string,
    gameId: string,
    senderId: string,
    content: string,
    createdAt?: Date,
    updatedAt?: Date
}