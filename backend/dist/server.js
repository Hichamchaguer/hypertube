"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_auth_1 = __importDefault(require("./database/routes/user_auth"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require('./oauth2.0/auth');
const { googleAuth, googleCallback } = require('./oauth2.0/auth');
mongoose_1.default.connect('mongodb://localhost:27017/hypertube_server').then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    credentials: true,
    origin: ['*']
}));
const PORT = 3002;
app.use(express_1.default.json());
app.use('/api', user_auth_1.default);
app.get('/auth/google', googleAuth);
app.get('/google/callback', googleCallback);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map