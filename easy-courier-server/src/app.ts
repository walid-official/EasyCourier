import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import uploadRoutes from './routes/upload.routes';
import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/order', orderRoutes);

// Root route
app.get('/', (_req, res) => {
  res.send('🚚 EasyCourier API is running...');
});

export default app;
