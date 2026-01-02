import { DataTypes, Model, Optional, } from "sequelize";
import { sequelize } from "../utils/db";
import { VerificationAttributes } from "../types/verification";
import { VERIFICATION_TYPE } from "../types/enum";

type VerificationCreationAttributes = Optional<VerificationAttributes, 'id' | 'expiredAt' | 'createdAt' | 'updatedAt' | 'type'>;
class Verification extends Model<VerificationAttributes, VerificationCreationAttributes> implements VerificationAttributes {
    id!: string;
    userId!: string;
    hashToken!: string;
    expiredAt!: Date;
    createdAt?: Date;
    updatedAt?: Date;
    type!: VERIFICATION_TYPE;
}

Verification.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
    hashToken: { type: DataTypes.TEXT, allowNull: false },
    expiredAt: { type: DataTypes.DATE, allowNull: false },
    type: { type: DataTypes.ENUM('PASSWORD_RESET', 'AUTHENTICATION'), allowNull: false, defaultValue: VERIFICATION_TYPE.AUTHENTICATION }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'Verification',
    tableName: 'verification'
});

export default Verification;