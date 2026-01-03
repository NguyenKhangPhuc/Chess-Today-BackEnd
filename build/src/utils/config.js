"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMTP_PASS = exports.SMTP_USER = exports.SMTP_PORT = exports.SMTP_HOST = exports.JWT_SECRET = exports.DATABASE_URL = exports.OPENAI_API_KEY = exports.PORT = exports.MONGODB_URI = void 0;
// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-require-imports
require('dotenv').config();
// Get the key from .env environment
const MONGODB_URI = process.env.MONGODB_URI ? process.env.MONGODB_URI : '';
exports.MONGODB_URI = MONGODB_URI;
const PORT = process.env.PORT;
exports.PORT = PORT;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY : '';
exports.OPENAI_API_KEY = OPENAI_API_KEY;
const DATABASE_URL = process.env.DATABASE_URL ? process.env.DATABASE_URL : '';
exports.DATABASE_URL = DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : '';
exports.JWT_SECRET = JWT_SECRET;
const SMTP_HOST = process.env.SMTP_HOST ? process.env.SMTP_HOST : '';
exports.SMTP_HOST = SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT ? process.env.SMTP_PORT : '';
exports.SMTP_PORT = SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER ? process.env.SMTP_USER : '';
exports.SMTP_USER = SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS ? process.env.SMTP_PASS : '';
exports.SMTP_PASS = SMTP_PASS;
