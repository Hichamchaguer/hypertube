"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
router.post('/register', auth_controller_1.register);
router.post('/login', auth_controller_1.login);
router.get('/user', auth_controller_1.currentUser);
router.post('/logout', auth_controller_1.logout);
router.get('/profile', auth_middleware_1.authMiddleware, auth_controller_1.listUsers);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map