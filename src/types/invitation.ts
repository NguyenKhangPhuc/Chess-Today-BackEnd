import { INVITATION_STATUS } from "./enum";


export interface InvitationAttributes {
    id?: string,
    senderId?: string
    receiverId?: string,
    status: INVITATION_STATUS,
    createdAt?: string,
    updatedAt?: string,
    userA: string,
    userB: string
}