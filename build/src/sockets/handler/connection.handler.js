"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerConnectionHandlers = registerConnectionHandlers;
const user_1 = __importDefault(require("../../models/user"));
const onlineUsers_1 = require("../state/onlineUsers");
function registerConnectionHandlers(socket) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        console.log("User connected", socket.id);
        if ((_a = socket.user) === null || _a === void 0 ? void 0 : _a.id) {
            // If the user connected and is logged in -> add they to the current online users map
            onlineUsers_1.onlineUsers.add(socket.user.id, socket.id);
            console.log(socket.user.id, socket.id);
            // Update the user status
            yield user_1.default.update({ isOnline: true, onlineAt: new Date() }, { where: { id: socket.user.id } });
        }
        socket.on("disconnect", () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log("Client disconnected:", socket.id);
            if ((_a = socket.user) === null || _a === void 0 ? void 0 : _a.id) {
                // If the user disconnect -> remove them from the current online users map
                onlineUsers_1.onlineUsers.remove(socket.user.id);
                yield user_1.default.update({ isOnline: false, onlineAt: new Date() }, { where: { id: socket.user.id } });
            }
        }));
        // Handle when user logout, delete the user info and remove from the map
        socket.on("logout_user", () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log('log out user');
            if ((_a = socket.user) === null || _a === void 0 ? void 0 : _a.id) {
                onlineUsers_1.onlineUsers.remove(socket.user.id);
                yield user_1.default.update({ isOnline: false, onlineAt: new Date() }, { where: { id: socket.user.id } });
                socket.user = undefined;
                socket.emit("logout_user");
            }
        }));
    });
}
