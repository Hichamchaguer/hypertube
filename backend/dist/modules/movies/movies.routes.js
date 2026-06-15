"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movies_controller_1 = require("./movies.controller");
const router = (0, express_1.Router)();
router.get('/movies', movies_controller_1.getMovies);
router.get('/movies/:id', movies_controller_1.getMovieById);
router.get('/search', movies_controller_1.searchMoviesHandler);
exports.default = router;
//# sourceMappingURL=movies.routes.js.map