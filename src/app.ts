// eslint-disable-next-line @typescript-eslint/no-require-imports
require('express-async-errors');
import cors from 'cors';
import express from 'express';
import analyzeRouter from './routes/analyze';
import signUpRouter from './routes/signup';
import { connectToDB } from './utils/db';
import loginRouter from './routes/login';
import { Server } from 'socket.io';
import http from 'http';
import { setUpSocket } from './sockets';
const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(cors());

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

setUpSocket(io);

const start = async () => {
    try {
        await connectToDB();
    }
    catch (error) {
        console.log(error);
    }
};

start().then(() => { }).catch(() => console.log('Cannot connect to DB and run Migration'));


app.get('/ping', (_req, res) => {
    console.log('someone pinged here');
    res.send('pong');
});

app.use('/api/analyze', analyzeRouter);
app.use('/api/sign-up', signUpRouter);
app.use('/api/login', loginRouter);




export default server;