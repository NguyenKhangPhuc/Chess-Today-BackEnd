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
const express_1 = __importDefault(require("express"));
const models_1 = __importDefault(require("../models"));
const argon2_1 = __importDefault(require("argon2"));
const verification_1 = require("../helpers/verification");
const verification_2 = __importDefault(require("../models/verification"));
const signUpRouter = express_1.default.Router();
// Route to sign up
signUpRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the user
    const newUser = req.body;
    // Check the password if it exists
    if (newUser.password && newUser.password.length > 8 && newUser.password.length < 16) {
        // If yes -> hash the password
        newUser.password = yield argon2_1.default.hash(newUser.password);
    }
    else {
        // If no -> return error
        res.status(400).json({ error: 'Invalid password, password must be 8-16 words' });
        return;
    }
    const createdUser = yield models_1.default.User.create(newUser);
    if (createdUser) {
        // Create the random code
        const code = (0, verification_1.generateCode)();
        // Hash the code
        const hashedCode = (0, verification_1.hashToken)(code);
        // Delete old verification code and Create the verification code 
        const verificationCode = { hashToken: hashedCode, userId: createdUser.id, expiredAt: new Date(Date.now() + 5 * 60 * 1000) };
        yield verification_2.default.destroy({ where: { userId: createdUser.id } });
        const createdVerificationCode = yield verification_2.default.create(verificationCode);
        if (createdVerificationCode) {
            // Send the verification email
            yield (0, verification_1.sendVerificationEmail)(createdUser.username, code);
        }
    }
    res.status(200).json({ userId: createdUser.id });
    return;
}));
exports.default = signUpRouter;
