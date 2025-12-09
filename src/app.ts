import express, { Application } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import { errorHandler, notFound } from './middleware/errorHandler';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
