"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comments_controller_1 = require("./comments.controller");
const router = (0, express_1.Router)();
router.get('/', comments_controller_1.listComments);
exports.default = router;
//# sourceMappingURL=comments.routes.js.map