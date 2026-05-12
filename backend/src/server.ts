import express from 'express';
import mongoose from 'mongoose';
import routes from './database/routes/user_auth';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
require('./oauth2.0/auth');
const { googleAuth, googleCallBack } = require('./oauth2.0/auth');

mongoose.connect('mongodb://localhost:27017/hypertube_server').then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

const app = express();
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}));
app.use(passport.initialize());
const PORT = 3002;
app.use(express.json()); 
app.use('/api', routes);
app.get('/auth/google', googleAuth);
app.get('/google/callback', googleCallBack);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});