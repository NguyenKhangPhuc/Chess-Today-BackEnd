// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-require-imports
require('dotenv').config();
// Get the key from .env environment
const MONGODB_URI = process.env.MONGODB_URI ? process.env.MONGODB_URI : '';
const PORT = process.env.PORT;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY : '';
const DATABASE_URL = process.env.DATABASE_URL ? process.env.DATABASE_URL : '';
const JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : '';
const SMTP_HOST = process.env.SMTP_HOST ? process.env.SMTP_HOST : '';
const SMTP_PORT = process.env.SMTP_PORT ? process.env.SMTP_PORT : '';
const SMTP_USER = process.env.SMTP_USER ? process.env.SMTP_USER : '';
const SMTP_PASS = process.env.SMTP_PASS ? process.env.SMTP_PASS : '';
export {
    MONGODB_URI,
    PORT,
    OPENAI_API_KEY,
    DATABASE_URL,
    JWT_SECRET,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS
};