import axios from 'axios';

const createTmdbClient = () => {
  const baseURL = process.env.TMDB_BASE_URL;
  const apiKey = process.env.TMDB_API_KEY;

  if (!baseURL || !apiKey) {
    throw new Error('TMDB_BASE_URL or TMDB_API_KEY is not defined in environment');
  }

  return axios.create({
    baseURL,
    params: {
      api_key: apiKey,
    },
  });
};

const isImdbId = (id: string) => /^tt\d+$/i.test(id);

export const resolveMovieIds = async (movieId: string) => {
  const tmdb = createTmdbClient();
  if (isImdbId(movieId)) {
    const response = await tmdb.get(`/find/${movieId}`,
      {
        params: {
          external_source: 'imdb_id',
        },
      },
    );

    const result = response.data?.movie_results?.[0];
    if (!result?.id) {
      throw new Error('TMDB movie not found for IMDb id');
    }

    return {
      tmdbId: String(result.id),
      imdbId: movieId,
    };
  }

  return {
    tmdbId: movieId,
    imdbId: null as string | null,
  };
};

export const fetchPopularMovies = async () => {
  const tmdb = createTmdbClient();
  const response = await tmdb.get('/movie/popular', {
    params: {
      language: 'en-US',
      page: 1,
    },
  });

  const movies = response.data.results.map((movie: any) => ({
    id: movie.id,
    title: movie.title,
    year: movie.release_date?.split('-')[0],
    rating: movie.vote_average,
    poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
    backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null,
    synopsis: movie.overview,
    genres: movie.genre_ids,
  }));

  return {
    page: response.data.page,
    results: movies,
    total_pages: response.data.total_pages,
  };
};

export const fetchMovieById = async (id: string) => {
  const tmdb = createTmdbClient();
  const response = await tmdb.get(`/movie/${id}`, {
    params: {
      append_to_response: 'credits,videos,external_ids',
    },
  });

  const movie = response.data;

  return {
    id: movie.id,
    imdbId: movie.external_ids?.imdb_id || null,
    title: movie.title,
    year: movie.release_date?.split('-')[0],
    rating: movie.vote_average,
    genres: movie.genres.map((g: any) => g.name),
    synopsis: movie.overview,
    runtime: movie.runtime || 0,
    poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
    backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null,
    directors: movie.credits.crew
      .filter((c: any) => c.job === 'Director')
      .map((d: any) => d.name),
    actors: movie.credits.cast.slice(0, 8).map((actor: any) => ({
      name: actor.name,
      character: actor.character,
      profile: actor.profile_path
        ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
        : null,
    })),
    trailer: movie.videos.results.find((video: any) => video.type === 'Trailer')
      ?.key,
  };
};

export const fetchMovieDetailsById = async (movieId: string) => {
  const { tmdbId, imdbId } = await resolveMovieIds(movieId);
  const tmdb = createTmdbClient();
  const response = await tmdb.get(`/movie/${tmdbId}`,
    {
      params: {
        append_to_response: 'credits,videos,external_ids',
      },
    },
  );

  const movie = response.data;
  const resolvedImdbId = movie.external_ids?.imdb_id || imdbId;

  return {
    id: movie.id,
    tmdbId: String(movie.id),
    imdbId: resolvedImdbId || null,
    title: movie.title,
    year: movie.release_date?.split('-')[0] || '',
    rating: movie.vote_average ?? 0,
    genres: movie.genres?.map((g: any) => g.name) || [],
    synopsis: movie.overview || '',
    runtime: movie.runtime || 0,
    poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
    backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null,
    directors: movie.credits?.crew
      ?.filter((c: any) => c.job === 'Director')
      .map((d: any) => d.name) || [],
    actors: movie.credits?.cast
      ?.slice(0, 8)
      .map((actor: any) => ({
        name: actor.name,
        character: actor.character,
        profile: actor.profile_path
          ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
          : null,
      })) || [],
    trailer: movie.videos?.results
      ?.find((video: any) => video.type === 'Trailer')
      ?.key,
  };
};

export const searchMovies = async (query: string) => {
  const tmdb = createTmdbClient();
  const response = await tmdb.get('/search/movie', {
    params: {
      query,
    },
  });

  return response.data.results.map((movie: any) => ({
    id: movie.id,
    title: movie.title,
    year: movie.release_date?.split('-')[0],
    rating: movie.vote_average,
    poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
    backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null,
    synopsis: movie.overview,
    genres: movie.genre_ids,
  }));
};
