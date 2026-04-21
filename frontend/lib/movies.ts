export interface Movie {
  id: string;
  title: string;
  year: number;
  duration: string;
  rating: number;
  genres: string[];
  synopsis: string;
  directors: string[];
  actors: string[];
  poster: string;
  backdrop: string;
  watched?: boolean;
}

export const movies: Movie[] = [
  {
    id: "shawshank-redemption",
    title: "The Shawshank Redemption",
    year: 1994,
    duration: "2h 22m",
    rating: 9.3,
    genres: ["Drama"],
    synopsis: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    directors: ["Frank Darabont"],
    actors: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop",
    watched: true
  },
  {
    id: "dark-knight",
    title: "The Dark Knight",
    year: 2008,
    duration: "2h 32m",
    rating: 9.1,
    genres: ["Action", "Crime", "Drama"],
    synopsis: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    directors: ["Christopher Nolan"],
    actors: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1000&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "inception",
    title: "Inception",
    year: 2010,
    duration: "2h 28m",
    rating: 8.8,
    genres: ["Action", "Sci-Fi", "Adventure"],
    synopsis: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    directors: ["Christopher Nolan"],
    actors: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
    poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1000&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "interstellar",
    title: "Interstellar",
    year: 2014,
    duration: "2h 49m",
    rating: 8.7,
    genres: ["Adventure", "Drama", "Sci-Fi"],
    synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    directors: ["Christopher Nolan"],
    actors: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    poster: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1000&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "avengers-endgame",
    title: "Avengers: Endgame",
    year: 2019,
    duration: "3h 01m",
    rating: 8.4,
    genres: ["Action", "Adventure", "Sci-Fi"],
    synopsis: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to restore balance to the universe.",
    directors: ["Anthony Russo", "Joe Russo"],
    actors: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo"],
    poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000&auto=format&fit=crop"
  }
];

export const getMovieById = (id: string) => movies.find(m => m.id === id);
