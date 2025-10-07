import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { connectDb } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import moderationRoutes from './routes/moderationRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import smsRoutes from './routes/smsRoutes.js';

import { Server as SocketIOServer } from 'socket.io';
import { setupSockets } from './sockets/index.js';

const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: { origin: env.corsOrigins.length ? env.corsOrigins : '*', methods: ['GET','POST','PUT','DELETE'] }
});
setupSockets(io);

// Attach io to request for controllers to emit
app.use((req, res, next) => { req.io = io; next(); });

app.use(helmet());
app.use(cors({ origin: (origin, cb) => cb(null, true), credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 300 });
app.use(limiter);

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/moderation', moderationRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api', smsRoutes);
app.use('/api/resources', resourceRoutes);

app.use(errorHandler);

async function start() {
  await connectDb();
  server.listen(env.port, () => console.log(`API listening on :${env.port}`));
}

if (process.env.NODE_ENV !== 'test') {
  start();
}

export { app, server };
