import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";
import { InvitationAttributes } from "../types/invitation";
import { INVITATION_STATUS } from "../types/enum";

type InvitationCreationAttributes = Optional<InvitationAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'>;
class Invitation extends Model<InvitationAttributes, InvitationCreationAttributes> implements InvitationAttributes {
    id?: string | undefined;
    senderId?: string;
    receiverId?: string;
    status!: INVITATION_STATUS;
    createdAt?: string;
    updatedAt?: string;
    userA!: string;
    userB!: string;
}
Invitation.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    senderId: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
    receiverId: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'accepted', 'rejected'), defaultValue: 'pending' },
    userA: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    userB: {
        type: DataTypes.UUID,
        allowNull: false,
    },

}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'invitation'
});

export default Invitation;