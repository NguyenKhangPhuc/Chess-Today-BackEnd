"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const challenges_1 = __importDefault(require("./challenges"));
const chatbox_1 = __importDefault(require("./chatbox"));
const friendship_1 = __importDefault(require("./friendship"));
const game_1 = __importDefault(require("./game"));
const gameMessage_1 = __importDefault(require("./gameMessage"));
const invitation_1 = __importDefault(require("./invitation"));
const message_1 = __importDefault(require("./message"));
const move_1 = __importDefault(require("./move"));
const puzzle_1 = __importDefault(require("./puzzle"));
const puzzleMove_1 = __importDefault(require("./puzzleMove"));
const user_1 = __importDefault(require("./user"));
const userPuzzles_1 = __importDefault(require("./userPuzzles"));
const verification_1 = __importDefault(require("./verification"));
user_1.default.hasMany(invitation_1.default, { foreignKey: 'senderId', as: 'sentInvitations' });
user_1.default.hasMany(invitation_1.default, { foreignKey: 'receiverId', as: 'receivedInvitations' });
invitation_1.default.belongsTo(user_1.default, { foreignKey: 'senderId', as: 'sender' });
invitation_1.default.belongsTo(user_1.default, { foreignKey: 'receiverId', as: 'receiver' });
user_1.default.belongsToMany(user_1.default, { through: friendship_1.default, as: 'friends', foreignKey: 'userId', otherKey: 'friendId' });
user_1.default.belongsToMany(user_1.default, { through: friendship_1.default, as: 'friendOf', foreignKey: 'friendId', otherKey: 'userId' });
friendship_1.default.belongsTo(user_1.default, { foreignKey: 'userId', as: 'user' });
friendship_1.default.belongsTo(user_1.default, { foreignKey: 'friendId', as: 'friend' });
user_1.default.hasMany(game_1.default, { foreignKey: 'player1Id', as: 'gameAsPlayer1' });
user_1.default.hasMany(game_1.default, { foreignKey: 'player2Id', as: 'gameAsPlayer2' });
game_1.default.belongsTo(user_1.default, { foreignKey: 'player1Id', as: 'player1' });
game_1.default.belongsTo(user_1.default, { foreignKey: 'player2Id', as: 'player2' });
game_1.default.hasMany(move_1.default, { foreignKey: 'gameId', as: 'moveHistory' });
move_1.default.belongsTo(game_1.default, { foreignKey: 'gameId', as: 'game' });
user_1.default.hasMany(move_1.default, { foreignKey: 'moverId', as: 'moves' });
move_1.default.belongsTo(user_1.default, { foreignKey: 'moverId', as: 'mover' });
game_1.default.hasMany(gameMessage_1.default, { foreignKey: 'gameId', as: 'gameMessages' });
gameMessage_1.default.belongsTo(game_1.default, { foreignKey: 'gameId', as: 'game' });
user_1.default.hasMany(chatbox_1.default, { foreignKey: 'user1Id', as: 'chatBoxAsUser1' });
user_1.default.hasMany(chatbox_1.default, { foreignKey: 'user2Id', as: 'chatBoxAsUser2' });
chatbox_1.default.belongsTo(user_1.default, { foreignKey: 'user1Id', as: 'user1' });
chatbox_1.default.belongsTo(user_1.default, { foreignKey: 'user2Id', as: 'user2' });
chatbox_1.default.hasMany(message_1.default, { foreignKey: 'chatBoxId', as: 'messages' });
message_1.default.belongsTo(chatbox_1.default, { foreignKey: 'chatBoxId', as: 'chatBox' });
puzzle_1.default.belongsToMany(user_1.default, { through: userPuzzles_1.default, as: 'puzzles', foreignKey: 'puzzleId' });
user_1.default.belongsToMany(puzzle_1.default, { through: userPuzzles_1.default, as: 'users', foreignKey: 'userId' });
puzzle_1.default.hasMany(puzzleMove_1.default, { foreignKey: 'puzzleId', as: 'validMoves' });
user_1.default.hasMany(challenges_1.default, { foreignKey: 'senderId', as: 'challenge_sender' });
user_1.default.hasMany(challenges_1.default, { foreignKey: 'receiverId', as: 'challenge_receiver' });
challenges_1.default.belongsTo(user_1.default, { foreignKey: 'senderId', as: 'sender' });
challenges_1.default.belongsTo(user_1.default, { foreignKey: 'receiverId', as: 'receiver' });
user_1.default.hasMany(verification_1.default, { foreignKey: 'userId', as: 'user' });
verification_1.default.belongsTo(user_1.default, { foreignKey: 'userId', as: 'user' });
exports.default = {
    User: user_1.default,
    Invitation: invitation_1.default,
    FriendShip: friendship_1.default
};
