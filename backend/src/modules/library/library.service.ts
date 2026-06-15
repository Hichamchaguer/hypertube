import Library from '../../database/models/library';
import Video from '../../database/models/video';
import { fetchMovieById } from '../movies/movies.service';

export const toggleFavorite = async (userId: string, movieId: string) => {
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

    // 2. Check if already in library
    const existing = await Library.findOne({ user_id: userId, video_id: video._id });

    if (existing) {
      await Library.deleteOne({ _id: existing._id });
      return { success: true, action: 'removed' };
    } else {
      await Library.create({ user_id: userId, video_id: video._id });
      return { success: true, action: 'added' };
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};

export const getUserLibrary = async (userId: string) => {
  try {
    const library = await Library.find({ user_id: userId })
      .populate('video_id')
      .sort({ addedAt: -1 });
    
    return library.map((item: any) => ({
      libraryId: item._id,
      addedAt: item.addedAt,
      movie: item.video_id,
    }));
  } catch (error) {
    console.error('Error getting user library:', error);
    throw error;
  }
};
