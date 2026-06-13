import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import mongoose from 'mongoose';
import authRoutes from './modules/auth/auth.routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
require('./oauth2.0/auth');
const { googleAuth, googleCallBack } = require('./oauth2.0/auth');
import moviesRoutes from './modules/movies/movies.routes';
import torrentRoutes from './modules/torrent/torrent.routes';
import usersRoutes from './modules/users/users.routes';
import commentsRoutes from './modules/comments/comments.routes';
import historyRoutes from './modules/history/history.routes';
import libraryRoutes from './modules/library/library.routes';


mongoose.connect('mongodb://hicham:123@mongodb:27017/hypertube_server?authSource=admin').then(() => {
  console.log('Connected to Mongodb');
}).catch((err) => {
  console.error('Error connecting to Mongodb:', err);
});

const app = express();
app.use(cookieParser());
const frontendOrigins = (process.env.FRONTEND_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  credentials: true,
  origin: (origin, callback) => {
    console.log('CORS request from origin:', origin);
    if (!origin || frontendOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.log('CORS rejected for origin:', origin);
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
}));

app.use(passport.initialize());
const PORT = 3002;
app.use(express.json());

// User authentication routes
app.use('/api', authRoutes);
app.use('/api', historyRoutes);
app.use('/api', libraryRoutes);

app.get('/auth/google', googleAuth);
app.get('/google/callback', googleCallBack);

// Movies route
app.use('/api', moviesRoutes);

// Torrent streaming routes (placeholder for now)
app.use('/api/torrent', torrentRoutes);

// Users + comments modules (placeholders)
app.use('/api/users', usersRoutes);
app.use('/api/comments', commentsRoutes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});