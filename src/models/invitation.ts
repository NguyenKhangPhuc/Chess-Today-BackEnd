import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";
import { InvitationAttributes } from "../types/types";

type InvitationCreationAttributes = Optional<InvitationAttributes, 'id' | 'status'>;
class Invitation extends Model<InvitationAttributes, InvitationCreationAttributes> { }
Invitation.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    senderId: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
    receiverId: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'accepted', 'rejected'), defaultValue: 'pending' }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'invitation'
});

export default Invitation;