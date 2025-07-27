import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";
import { FriendAttributes } from "../types/types";

type FriendShipCreationAttributes = Optional<FriendAttributes, 'id'>;
class FriendShip extends Model<FriendAttributes, FriendShipCreationAttributes> { }
FriendShip.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' }, allowNull: false },
    friendId: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' }, allowNull: false },

}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'friendship'
});

export default FriendShip;