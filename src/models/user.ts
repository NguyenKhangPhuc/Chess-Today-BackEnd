import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../utils/db";
import { UserAttributes } from "../types/user";
type UserCreationAttributes = Optional<UserAttributes, 'id' | 'createdAt' | 'status' | 'updatedAt' | 'onlineAt' | 'rocketElo' | 'blitzElo' | 'isBot'>;
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id!: string;
    name!: string;
    username!: string;
    password!: string;
    status!: boolean;
    onlineAt!: Date;
    isOnline!: boolean;
    createdAt?: string;
    updatedAt?: string;
    elo!: number;
    rocketElo!: number;
    blitzElo!: number;
    isBot!: boolean;
}
User.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.TEXT, allowNull: false },
    username: { type: DataTypes.TEXT, allowNull: false, validate: { isEmail: { msg: 'Username must be an email' } }, unique: true },
    elo: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 800 },
    rocketElo: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 800 },
    blitzElo: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 800 },
    password: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.BOOLEAN, defaultValue: false },
    isOnline: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    onlineAt: { type: DataTypes.DATE },
    isBot: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
},
    {
        sequelize,
        underscored: true,
        timestamps: true,
        modelName: 'User'
    }
);

export default User;