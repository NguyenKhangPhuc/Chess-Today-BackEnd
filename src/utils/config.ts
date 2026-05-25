// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-require-imports
require('dotenv').config();
// Get the key from .env environment
const PORT = process.env.PORT;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY : '';
const DATABASE_URL = process.env.DATABASE_URL ? process.env.DATABASE_URL : '';
const JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : '';
const SMTP_HOST = process.env.SMTP_HOST ? process.env.SMTP_HOST : '';
const SMTP_PORT = process.env.SMTP_PORT ? process.env.SMTP_PORT : '';
const SMTP_USER = process.env.SMTP_USER ? process.env.SMTP_USER : '';
const SMTP_PASS = process.env.SMTP_PASS ? process.env.SMTP_PASS : '';
const RESEND_API_KEY = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY : '';
const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
export {
    PORT,
    OPENAI_API_KEY,
    DATABASE_URL,
    JWT_SECRET,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    NODE_ENV,
    RESEND_API_KEY
};