import { DataTypes, Model, Optional, } from "sequelize";
import { sequelize } from "../utils/db";
import { VerificationAttributes } from "../types/verification";

type VerificationCreationAttributes = Optional<VerificationAttributes, 'id' | 'expiredAt' | 'createdAt' | 'updatedAt'>;
class Verification extends Model<VerificationAttributes, VerificationCreationAttributes> implements VerificationAttributes {
    id!: string;
    userId!: string;
    hashToken!: string;
    expiredAt!: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

Verification.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
    hashToken: { type: DataTypes.TEXT, allowNull: false },
    expiredAt: { type: DataTypes.DATE, allowNull: false },
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'Verification',
    tableName: 'verification'
});

export default Verification;