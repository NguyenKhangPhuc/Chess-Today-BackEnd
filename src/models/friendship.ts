import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";
import { FriendAttributes } from "../types/types";

type FriendShipCreationAttributes = Optional<FriendAttributes, 'id'>;
class FriendShip extends Model<FriendAttributes, FriendShipCreationAttributes> implements FriendAttributes {
    id!: string;
    userId!: string;
    friendId!: string;
}
FriendShip.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
    friendId: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },

}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'friendship'
});

export default FriendShip;