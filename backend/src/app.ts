import express from 'express';
import cors from "cors";
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import ticketRoutes from './routes/ticketRoutes';

const app = express();
app.use(bodyParser.json());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true, 
}));

app.get('/', (_req, res) => res.json({ ok: true }));

app.use('/auth', authRoutes);
app.use('/tickets', ticketRoutes);

export default app;
