"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const history_controller_1 = require("./history.controller");
const authMiddleware_1 = require("../../authMiddleware");
const router = (0, express_1.Router)();
router.get('/history', authMiddleware_1.authMiddleware, history_controller_1.getHistory);
router.post('/history', authMiddleware_1.authMiddleware, history_controller_1.addMovieToHistory);
exports.default = router;
//# sourceMappingURL=history.routes.js.map