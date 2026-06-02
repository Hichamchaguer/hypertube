import passport from 'passport';
const GoogleStrategy = require('passport-google-oauth20').Strategy;
import User from '../database/models/user';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  async (accessToken:any, refreshToken:any, profile:any, done:any) => {

        try {
            const email = profile.emails[0].value;
            let user = await User.findOne({ email });

            if (!user) {
                // generate username
                let username = profile.displayName.replace(/\s+/g, '').toLowerCase();
                console.log('Generated username:', username);

                user = await User.create({
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    username: username,
                    email: email,
                    password: null,
                    provider: 'google',
                    providerId: profile.id,
                    profilePicture: profile.photos[0].value,
                    createdAt: new Date()
                });
                await user.save();
            }
            return done(null, user);
        }
        catch (err) {
            return done(err, null);
        }
  }
));

const googleAuth = passport.authenticate('google',
{
    scope: ['profile', 'email'],
    session: false,
    prompt: 'select_account'
});

const googleCallBack = [ passport.authenticate('google',
       { 
          session: false,
          failureRedirect: '/api/login',
       }
    ),
    async (req:any, res:any) => {
        try {
            const token = jwt.sign({ id: req.user._id }, 'secret');
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: false, // for http false and for https true
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3001'}/dashboard`);
        }
        catch (err) {
            res.status(500).json({ error: 'Authentication failed' });
        }
    }
];

export const isLoggedIn = (req:any, res:any, next:any) => {
    console.log('user authorized is ', req.user);
    req.user ? next() : res.sendStatus(401);
};

module.exports = {
    googleAuth,
    googleCallBack
};