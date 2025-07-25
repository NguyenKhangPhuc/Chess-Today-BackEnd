// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-require-imports
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI ? process.env.MONGODB_URI : '';
const PORT = process.env.PORT;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY : '';
const DATABASE_URL = process.env.DATABASE_URL ? process.env.DATABASE_URL : '';
const JWT_SECRET = process.env.SECRET ? process.env.SECRET : '';
export {
    MONGODB_URI,
    PORT,
    OPENAI_API_KEY,
    DATABASE_URL,
    JWT_SECRET

};