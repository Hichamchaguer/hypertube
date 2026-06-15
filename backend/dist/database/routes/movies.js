"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const archive_controller_1 = require("../../services/archive.controller");
const router = express_1.default.Router();
router.get('/movies', archive_controller_1.getMovies);
router.get('/movies/:id', archive_controller_1.getMoviesById);
router.get('/search', archive_controller_1.searchMovies);
exports.default = router;
//# sourceMappingURL=movies.js.map