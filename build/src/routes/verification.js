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
const verification_1 = __importDefault(require("../models/verification"));
const user_1 = __importDefault(require("../models/user"));
const verification_2 = require("../helpers/verification");
const enum_1 = require("../types/enum");
const verificationRouter = express_1.default.Router();
// Route to create a verification code and send mail to user
verificationRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the user, if exists -> create the random 6 number code and send to the user email
    console.log(req.body);
    const foundUser = yield user_1.default.findOne({ where: { username: req.body.username } });
    if (!foundUser) {
        res.status(400).json({ error: 'Incorrect Username' });
        return;
    }
    // Generate code
    const code = (0, verification_2.generateCode)();
    const hashCode = (0, verification_2.hashToken)(code);
    let verificationCode;
    if (req.body.type == enum_1.VERIFICATION_TYPE.AUTHENTICATION) {
        verificationCode = { hashToken: hashCode, userId: foundUser.id, expiredAt: new Date(Date.now() + 60 * 5 * 1000), type: req.body.type };
    }
    else if (req.body.type == enum_1.VERIFICATION_TYPE.PASSWORD_RESET) {
        verificationCode = { hashToken: hashCode, userId: foundUser.id, expiredAt: new Date(Date.now() + 60 * 2 * 1000), type: req.body.type };
    }
    else {
        res.status(400).json({ error: 'Incorrect Type' });
        return;
    }
    // Destroy all previous code of this type
    yield verification_1.default.destroy({ where: { userId: foundUser.id, type: req.body.type } });
    // Create the code
    const createdVerificationCode = yield verification_1.default.create(verificationCode);
    if (!createdVerificationCode) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    // Send it to user mail
    yield (0, verification_2.sendVerificationEmail)(req.body.username, code);
    res.status(200).json({ message: "Code sent to user's mail" });
    return;
}));
verificationRouter.post('/verify-code', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the user and find the verification code based on the userid
    const foundUser = yield user_1.default.findOne({ where: { username: req.body.username } });
    if (!foundUser) {
        res.status(400).json({ error: 'Incorrect Username' });
        return;
    }
    // Found the verification code, compare the received code with the stored code
    const foundVerificationCode = yield verification_1.default.findOne({ where: { userId: foundUser.id, type: enum_1.VERIFICATION_TYPE.AUTHENTICATION } });
    if (!foundVerificationCode) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    if ((0, verification_2.hashToken)(req.body.code) != foundVerificationCode.hashToken) {
        res.status(401).json({ error: 'Invalid code' });
        return;
    }
    if (foundVerificationCode.expiredAt < new Date()) {
        res.status(401).json({ error: 'Expired code' });
        return;
    }
    // If match and not expired -> update the verified to be true
    yield user_1.default.update({ isVerified: true }, { where: { id: foundUser.id } });
    res.status(200).json({ message: 'Verify successfully' });
    return;
}));
exports.default = verificationRouter;
