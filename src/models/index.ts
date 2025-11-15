import Challenge from "./challenges";
import ChatBox from "./chatbox";
import FriendShip from "./friendship";
import Game from "./game";
import GameMessage from "./gameMessage";
import Invitation from "./invitation";
import Message from "./message";
import Move from "./move";
import Puzzle from "./puzzle";
import PuzzleMove from "./puzzleMove";
import User from "./user";
import UserPuzzles from "./userPuzzles";

User.hasMany(Invitation, { foreignKey: 'senderId', as: 'sentInvitations' });
User.hasMany(Invitation, { foreignKey: 'receiverId', as: 'receivedInvitations' });
Invitation.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Invitation.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

User.belongsToMany(User, { through: FriendShip, as: 'friends', foreignKey: 'userId', otherKey: 'friendId' });
User.belongsToMany(User, { through: FriendShip, as: 'friendOf', foreignKey: 'friendId', otherKey: 'userId' });
FriendShip.belongsTo(User, { foreignKey: 'userId', as: 'user' });
FriendShip.belongsTo(User, { foreignKey: 'friendId', as: 'friend' });

User.hasMany(Game, { foreignKey: 'player1Id', as: 'gameAsPlayer1' });
User.hasMany(Game, { foreignKey: 'player2Id', as: 'gameAsPlayer2' });
Game.belongsTo(User, { foreignKey: 'player1Id', as: 'player1' });
Game.belongsTo(User, { foreignKey: 'player2Id', as: 'player2' });

Game.hasMany(Move, { foreignKey: 'gameId', as: 'moveHistory' });
Move.belongsTo(Game, { foreignKey: 'gameId', as: 'game' });
User.hasMany(Move, { foreignKey: 'moverId', as: 'moves' });
Move.belongsTo(User, { foreignKey: 'moverId', as: 'mover' });

Game.hasMany(GameMessage, { foreignKey: 'gameId', as: 'gameMessages' });
GameMessage.belongsTo(Game, { foreignKey: 'gameId', as: 'game' });

User.hasMany(ChatBox, { foreignKey: 'user1Id', as: 'chatBoxAsUser1' });
User.hasMany(ChatBox, { foreignKey: 'user2Id', as: 'chatBoxAsUser2' });
ChatBox.belongsTo(User, { foreignKey: 'user1Id', as: 'user1' });
ChatBox.belongsTo(User, { foreignKey: 'user2Id', as: 'user2' });

ChatBox.hasMany(Message, { foreignKey: 'chatBoxId', as: 'messages' });
Message.belongsTo(ChatBox, { foreignKey: 'chatBoxId', as: 'chatBox' });

Puzzle.belongsToMany(User, { through: UserPuzzles, as: 'puzzles', foreignKey: 'puzzleId' });
User.belongsToMany(Puzzle, { through: UserPuzzles, as: 'users', foreignKey: 'userId' });

Puzzle.hasMany(PuzzleMove, { foreignKey: 'puzzleId', as: 'validMoves' });

User.hasMany(Challenge, { foreignKey: 'senderId', as: 'challenge_sender' });
User.hasMany(Challenge, { foreignKey: 'receiverId', as: 'challenge_receiver' });
Challenge.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Challenge.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver_id' });

export default {
    User,
    Invitation,
    FriendShip
};