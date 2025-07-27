import FriendShip from "./friendship";
import Invitation from "./Invitation";
import User from "./user";

User.hasMany(Invitation, { foreignKey: 'senderId', as: 'sentInvitations' });
User.hasMany(Invitation, { foreignKey: 'receiverId', as: 'receivedInvitations' });
Invitation.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Invitation.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

User.belongsToMany(User, { through: FriendShip, as: 'friends', foreignKey: 'userId', otherKey: 'friendId' });
User.belongsToMany(User, { through: FriendShip, as: 'friendOf', foreignKey: 'friendId', otherKey: 'userId' });
export default {
    User,
    Invitation,
    FriendShip
};