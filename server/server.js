import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import billRoutes from './routes/billRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://electricity-bill-sun3aopb2-yash-maskes-projects-93f4ac16.vercel.app'
  ],
  credentials: true
}));

app.use(express.json());

const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

app.use('/api/save', billRoutes);

// No app.listen() ❌
// Instead export app for Vercel to use ✅
export default app;
