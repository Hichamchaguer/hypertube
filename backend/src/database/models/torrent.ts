import mongoose from 'mongoose';

const torrentSchema = new mongoose.Schema({
  movie_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
  quality: { type: String, required: true },
  magnetLink: { type: String, required: true },
  size: { type: String },
  seeders: { type: Number, default: 0 },
  leechers: { type: Number, default: 0 },
  downloadStatus: {
    type: String,
    enum: ['not_started', 'downloading', 'completed'],
    default: 'not_started',
  },
  hlsPlaylistPath: { type: String, default: null },
  lastWatched: { type: Date, default: null },
});

torrentSchema.index({ movie_id: 1, quality: 1 }, { unique: true });

torrentSchema.set('timestamps', true);

const Torrent = mongoose.model('Torrent', torrentSchema);

export default Torrent;
