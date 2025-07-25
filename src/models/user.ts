import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../utils/db";
import { UserAttributes } from "../types/types";
type UserCreationAttributes = Optional<UserAttributes, 'id' | 'createdAt' | 'status' | 'updatedAt' | 'onlineAt'>;
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id!: number;
    name!: string;
    username!: string;
    email!: string;
    password!: string;
    status!: boolean;
    onlineAt!: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
User.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.TEXT, allowNull: false },
    username: { type: DataTypes.TEXT, allowNull: false },
    email: { type: DataTypes.TEXT, allowNull: false },
    password: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.BOOLEAN, defaultValue: false },
    onlineAt: { type: DataTypes.TIME }
},
    {
        sequelize,
        underscored: true,
        timestamps: true,
        modelName: 'User'
    }
);

export default User;