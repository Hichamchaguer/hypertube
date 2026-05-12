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
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const routes = express_1.default.Router();
const isLoggedIn = (req, res, next) => {
    req.user ? next() : res.sendStatus(401);
};
exports.isLoggedIn = isLoggedIn;
routes.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(req.body.password, salt);
        const user = yield user_1.default.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        res.send(yield user.save());
        console.log(user_1.default);
    }
    catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Error creating user' });
    }
}));
// login via jwt 
routes.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findOne({ username: req.body.username });
        console.log('>>>>> User:', user);
        if (!user || !user.password) {
            return res.status(404).send({ error: 'Invalid username or password 1' });
        }
        const validPassword = yield bcryptjs_1.default.compare(req.body.password, user.password);
        if (!validPassword) {
            console.log('Invalid password for user:', req.body.username);
            return res.status(400).send({ error: 'Invalid username or password 2' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, 'secret');
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        res.send({ message: 'Login successful' });
    }
    catch (err) {
        res.status(401).json({ error: 'Unauthenticated' });
    }
}));
routes.get('/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.send({ user: 'Unauthenticated1' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, 'secret');
        const user = yield user_1.default.findOne({ _id: decoded.id });
        console.log('>>>>> User:', user);
        if (!user) {
            return res.send({ user: 'Unauthenticated2' });
        }
        res.send(user);
    }
    catch (err) {
        console.error('Error fetching user:', err);
        res.status(404).json({ error: 'Error fetching user' });
    }
}));
routes.post('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 0 });
    res.send({ message: 'Logout successful' });
});
routes.get('/profile', exports.isLoggedIn, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find();
        res.send({ message: users.map((u) => u.username) });
    }
    catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Error fetching users' });
    }
}));
exports.default = routes;
//# sourceMappingURL=user_auth.js.map