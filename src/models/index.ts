import Invitation from "./Invitation";
import User from "./user";

User.hasMany(Invitation, { foreignKey: 'senderId', as: 'sentInvitations' });
User.hasMany(Invitation, { foreignKey: 'receiverId', as: 'receivedInvitations' });
Invitation.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Invitation.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });
export default {
    User,
    Invitation
};