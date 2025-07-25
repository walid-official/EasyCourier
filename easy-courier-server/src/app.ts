import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import { Server } from 'socket.io';

import uploadRoutes from './routes/upload.routes';
import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';
import assignRoutes from './routes/assignRoutes';
import { registerChatHandlers } from './sockets/chat.socket';

const app = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('⚡ New client connected:', socket.id);
  registerChatHandlers(io, socket);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/assignments', assignRoutes);

// Root route
app.get('/', (_req, res) => {
  res.send('🚚 EasyCourier API is running...');
});


export { server }; 
