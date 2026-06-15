import History from '../../database/models/watch_history';
import Video from '../../database/models/video';
import { fetchMovieById } from '../movies/movies.service';

export const addToHistory = async (userId: string, movieId: string) => {
  try {
    const isImdbId = (id: string) => /^tt\d+$/i.test(id);
    
    // 1. Ensure video exists in our database
    let video;
    if (isImdbId(movieId)) {
      video = await Video.findOne({ imdbId: movieId });
    } else {
      video = await Video.findOne({ tmdbId: Number(movieId) });
    }

    if (!video) {
      // Fetch details from TMDB to ensure we have the minimum data
      const movieInfo = await fetchMovieById(movieId);
      video = new Video({
        tmdbId: movieInfo.id,
        imdbId: movieInfo.imdbId,
        title: movieInfo.title,
        year: movieInfo.year,
        duration: movieInfo.runtime,
        rating: movieInfo.rating,
        genres: movieInfo.genres,
        synopsis: movieInfo.synopsis,
        poster: movieInfo.poster,
        backdrop: movieInfo.backdrop,
      });
      await video.save();
    }

    // 2. Add or update history record
    await History.findOneAndUpdate(
      { user_id: userId, video_id: video._id },
      { watchAt: new Date() },
      { upsert: true, new: true }
    );

    return { success: true };
  } catch (error) {
    console.error('Error adding to history:', error);
    throw error;
  }
};

export const getUserHistory = async (userId: string) => {
  try {
    const history = await History.find({ user_id: userId })
      .populate('video_id')
      .sort({ watchAt: -1 })
      .limit(50);
    
    return history.map((item: any) => ({
      historyId: item._id,
      watchAt: item.watchAt,
      movie: item.video_id,
    }));
  } catch (error) {
    console.error('Error getting user history:', error);
    throw error;
  }
};
