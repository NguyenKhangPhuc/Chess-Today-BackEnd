import { GAME_TYPE, INVITATION_STATUS } from "./enum";

export interface ChallengeAttributes {
    id?: string,
    senderId: string,
    receiverId: string,
    status: INVITATION_STATUS,
    gameType: GAME_TYPE,
    playerTime: number,
    isSenderPlayer1: boolean,
    createdAt?: string,
    updatedAt?: string,
}