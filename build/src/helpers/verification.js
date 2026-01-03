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
exports.sendVerificationEmail = sendVerificationEmail;
exports.generateCode = generateCode;
exports.hashToken = hashToken;
const mailer_1 = require("../infrastructure/mailer");
const crypto_1 = __importDefault(require("crypto"));
function sendVerificationEmail(email, code) {
    return __awaiter(this, void 0, void 0, function* () {
        yield mailer_1.mailer.sendMail({
            from: "nguyenkhangphuc012024@gmail.com",
            to: email,
            subject: "Verify your email, the code will expire in 5 minutes",
            html: `<h2>${code}</h2>`,
        });
    });
}
function generateCode() {
    return crypto_1.default.randomInt(100000, 999999).toString();
}
function hashToken(token) {
    return crypto_1.default
        .createHash("sha256")
        .update(token)
        .digest("hex");
}
