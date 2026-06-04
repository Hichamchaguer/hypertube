"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const library_controller_1 = require("./library.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/library', auth_middleware_1.authMiddleware, library_controller_1.getLibrary);
router.post('/library/toggle', auth_middleware_1.authMiddleware, library_controller_1.toggleFavorite);
exports.default = router;
//# sourceMappingURL=library.routes.js.map