"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
require('./oauth2.0/auth');
const { googleAuth, googleCallBack } = require('./oauth2.0/auth');
const movies_routes_1 = __importDefault(require("./modules/movies/movies.routes"));
const torrent_routes_1 = __importDefault(require("./modules/torrent/torrent.routes"));
const users_routes_1 = __importDefault(require("./modules/users/users.routes"));
const comments_routes_1 = __importDefault(require("./modules/comments/comments.routes"));
const history_routes_1 = __importDefault(require("./modules/history/history.routes"));
const library_routes_1 = __importDefault(require("./modules/library/library.routes"));
mongoose_1.default.connect('mongodb://localhost:27017/hypertube_server').then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
const frontendOrigins = (process.env.FRONTEND_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
app.use((0, cors_1.default)({
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
app.use(passport_1.default.initialize());
const PORT = 3002;
app.use(express_1.default.json());
// User authentication routes
app.use('/api', auth_routes_1.default);
app.use('/api', history_routes_1.default);
app.use('/api', library_routes_1.default);
app.get('/auth/google', googleAuth);
app.get('/google/callback', googleCallBack);
// Movies route
app.use('/api', movies_routes_1.default);
// Torrent streaming routes (placeholder for now)
app.use('/api/torrent', torrent_routes_1.default);
// Users + comments modules (placeholders)
app.use('/api/users', users_routes_1.default);
app.use('/api/comments', comments_routes_1.default);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map