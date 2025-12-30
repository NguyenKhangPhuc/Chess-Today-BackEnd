export interface MessageAttributes {
    id: string,
    chatBoxId: string,
    senderId: string,
    receiverId: string,
    content: string,
    createdAt?: Date,
    updatedAt?: Date

}