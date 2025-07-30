import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../utils/db";
import { UserAttributes } from "../types/types";
type UserCreationAttributes = Optional<UserAttributes, 'id' | 'createdAt' | 'status' | 'updatedAt' | 'onlineAt'>;
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id!: string;
    name!: string;
    username!: string;
    password!: string;
    status!: boolean;
    onlineAt!: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
User.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.TEXT, allowNull: false },
    username: { type: DataTypes.TEXT, allowNull: false, validate: { isEmail: { msg: 'Username must be an email' } } },

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