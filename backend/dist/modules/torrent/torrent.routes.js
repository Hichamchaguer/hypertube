"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const torrent_controller_1 = require("./torrent.controller");
const router = (0, express_1.Router)();
router.get('/stream/:movieId/:quality', torrent_controller_1.startStream);
router.get('/getStreamPlaylist/:movieId/:quality', torrent_controller_1.getPlaylist);
router.get('/getSegment/:movieId/:quality/:segment', torrent_controller_1.getSegment);
router.get('/availableQualities/:movieId', torrent_controller_1.listQualities);
exports.default = router;
//# sourceMappingURL=torrent.routes.js.map