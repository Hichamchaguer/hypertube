"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedIn = void 0;
const passport_1 = __importDefault(require("passport"));
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const user_1 = __importDefault(require("../database/models/user"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
passport_1.default.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = profile.emails[0].value;
        let user = yield user_1.default.findOne({ email });
        if (!user) {
            // generate username
            let username = profile.displayName.replace(/\s+/g, '').toLowerCase();
            console.log('Generated username:', username);
            user = yield user_1.default.create({
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
            yield user.save();
        }
        return done(null, user);
    }
    catch (err) {
        return done(err, null);
    }
})));
const googleAuth = passport_1.default.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
});
const googleCallBack = [passport_1.default.authenticate('google', {
        session: false,
        failureRedirect: '/api/login',
    }),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = jsonwebtoken_1.default.sign({ id: req.user._id }, 'secret');
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: false, // for http false and for https true
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });
            return res.redirect('http://localhost:3000/dashboard');
        }
        catch (err) {
            res.status(500).json({ error: 'Authentication failed' });
        }
    })
];
const isLoggedIn = (req, res, next) => {
    console.log('user authorized is ', req.user);
    req.user ? next() : res.sendStatus(401);
};
exports.isLoggedIn = isLoggedIn;
module.exports = {
    googleAuth,
    googleCallBack
};
//# sourceMappingURL=auth.js.map