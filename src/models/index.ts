import FriendShip from "./friendship";
import Game from "./game";
import GameMessage from "./gameMessage";
import Invitation from "./invitation";
import Move from "./move";
import User from "./user";

User.hasMany(Invitation, { foreignKey: 'senderId', as: 'sentInvitations' });
User.hasMany(Invitation, { foreignKey: 'receiverId', as: 'receivedInvitations' });
Invitation.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Invitation.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

User.belongsToMany(User, { through: FriendShip, as: 'friends', foreignKey: 'userId', otherKey: 'friendId' });
User.belongsToMany(User, { through: FriendShip, as: 'friendOf', foreignKey: 'friendId', otherKey: 'userId' });

User.hasMany(Game, { foreignKey: 'player1Id', as: 'gameAsPlayer1' });
User.hasMany(Game, { foreignKey: 'player2Id', as: 'gameAsPlayer2' });
Game.belongsTo(User, { foreignKey: 'player1Id', as: 'player1' });
Game.belongsTo(User, { foreignKey: 'player2Id', as: 'player2' });

Game.hasMany(Move, { foreignKey: 'gameId', as: 'moveHistory' });
Move.belongsTo(Game, { foreignKey: 'gameId', as: 'game' });

Game.hasMany(GameMessage, { foreignKey: 'gameId', as: 'gameMessages' });
GameMessage.belongsTo(Game, { foreignKey: 'gameId', as: 'game' });
export default {
    User,
    Invitation,
    FriendShip
};