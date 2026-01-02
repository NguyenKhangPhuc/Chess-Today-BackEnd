import { VERIFICATION_TYPE } from "./enum";

export interface VerificationAttributes {
    id: string,
    userId: string,
    hashToken: string,
    expiredAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
    type: VERIFICATION_TYPE
}