// eslint-disable-next-line @typescript-eslint/no-require-imports
require('express-async-errors');
import cors from 'cors';
import express from 'express';
import { connect } from 'mongoose';
import { MONGODB_URI } from './utils/config';
import analyzeRouter from './routes/analyze';
const app = express();
app.use(express.json());
app.use(cors());

run().catch(err => console.log(err));

async function run() {
    // 4. Connect to MongoDB
    await connect(MONGODB_URI);
}


app.get('/ping', (_req, res) => {
    console.log('someone pinged here');
    res.send('pong');
});

app.use('/api/analyze', analyzeRouter);

export default app;