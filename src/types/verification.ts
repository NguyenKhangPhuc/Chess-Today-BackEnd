export interface VerificationAttributes {
    id: string,
    userId: string,
    hashToken: string,
    expiredAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}