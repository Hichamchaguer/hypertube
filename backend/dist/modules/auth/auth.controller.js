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
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = exports.currentUser = exports.logout = exports.login = exports.register = void 0;
const auth_service_1 = require("./auth.service");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, auth_service_1.registerUser)(req.body);
        return res.send(user);
    }
    catch (err) {
        if ((err === null || err === void 0 ? void 0 : err.code) === 11000) {
            return res.status(400).json({ message: 'Username or email already exists.' });
        }
        return res.status(500).json({ message: 'Internal server error while creating user.' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = yield (0, auth_service_1.loginUser)(req.body);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.send({ message: 'Login successful' });
    }
    catch (err) {
        return res.status(401).json({ error: 'Unauthenticated' });
    }
});
exports.login = login;
const logout = (_req, res) => {
    res.cookie('jwt', '', { maxAge: 0 });
    return res.send({ message: 'Logout successful' });
};
exports.logout = logout;
const currentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt;
        const user = yield (0, auth_service_1.getUserFromToken)(token);
        if (!user) {
            return res.status(401).json({ error: 'Unauthenticated' });
        }
        return res.send(user);
    }
    catch (err) {
        return res.status(404).json({ error: 'Error fetching user' });
    }
});
exports.currentUser = currentUser;
const listUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, auth_service_1.getAllUsers)();
        return res.send({ message: users });
    }
    catch (err) {
        return res.status(500).json({ error: 'Error fetching users' });
    }
});
exports.listUsers = listUsers;
//# sourceMappingURL=auth.controller.js.map