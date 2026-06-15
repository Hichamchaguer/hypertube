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
exports.getAllUsers = exports.getUserFromToken = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../../database/models/user"));
const registerUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hashedPassword = yield bcryptjs_1.default.hash(payload.password, salt);
    const user = yield user_1.default.create({
        firstName: payload.firstName,
        lastName: payload.lastName,
        username: payload.username,
        email: payload.email,
        password: hashedPassword,
    });
    return user.save();
});
exports.registerUser = registerUser;
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findOne({ username: payload.username });
    if (!user || !user.password) {
        throw new Error('Invalid username or password');
    }
    const validPassword = yield bcryptjs_1.default.compare(payload.password, user.password);
    if (!validPassword) {
        throw new Error('Invalid username or password');
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id }, 'secret');
    return { token };
});
exports.loginUser = loginUser;
const getUserFromToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        return null;
    }
    const decoded = jsonwebtoken_1.default.verify(token, 'secret');
    return user_1.default.findOne({ _id: decoded.id });
});
exports.getUserFromToken = getUserFromToken;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return user_1.default.find();
});
exports.getAllUsers = getAllUsers;
//# sourceMappingURL=auth.service.js.map