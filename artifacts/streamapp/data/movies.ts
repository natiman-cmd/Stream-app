export interface Movie {
  id: string;
  title: string;
  genre: string;
  year: number;
  rating: number;
  duration: string;
  description: string;
  poster: ReturnType<typeof require>;
  isFeatured?: boolean;
  progress?: number;
}

const posterScifi = require("../assets/images/poster-scifi.png");
const posterAction = require("../assets/images/poster-action.png");
const posterDrama = require("../assets/images/poster-drama.png");

export const MOVIES: Movie[] = [
  {
    id: "1",
    title: "Interstellar",
    genre: "Sci-Fi",
    year: 2014,
    rating: 8.7,
    duration: "2h 49m",
    description:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    poster: posterScifi,
    isFeatured: true,
  },
  {
    id: "2",
    title: "Inception",
    genre: "Sci-Fi",
    year: 2010,
    rating: 8.8,
    duration: "2h 28m",
    description:
      "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
    poster: posterScifi,
  },
  {
    id: "3",
    title: "Dune",
    genre: "Sci-Fi",
    year: 2021,
    rating: 8.0,
    duration: "2h 35m",
    description:
      "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset.",
    poster: posterScifi,
    progress: 0.35,
  },
  {
    id: "4",
    title: "The Dark Knight",
    genre: "Action",
    year: 2008,
    rating: 9.0,
    duration: "2h 32m",
    description:
      "Batman faces the Joker, a criminal mastermind who wants to plunge Gotham City into anarchy.",
    poster: posterAction,
  },
  {
    id: "5",
    title: "Mad Max: Fury Road",
    genre: "Action",
    year: 2015,
    rating: 8.1,
    duration: "2h 0m",
    description:
      "In a post-apocalyptic wasteland, Max teams with a mysterious woman to flee a warlord.",
    poster: posterAction,
    progress: 0.72,
  },
  {
    id: "6",
    title: "John Wick",
    genre: "Action",
    year: 2014,
    rating: 7.4,
    duration: "1h 41m",
    description:
      "An ex-hit-man comes out of retirement to track down the gangsters that took everything from him.",
    poster: posterAction,
  },
  {
    id: "7",
    title: "Oppenheimer",
    genre: "Drama",
    year: 2023,
    rating: 8.3,
    duration: "3h 0m",
    description:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    poster: posterDrama,
    progress: 0.15,
  },
  {
    id: "8",
    title: "The Godfather",
    genre: "Drama",
    year: 1972,
    rating: 9.2,
    duration: "2h 55m",
    description:
      "The aging patriarch of an organized crime dynasty transfers control to his reluctant son.",
    poster: posterDrama,
  },
  {
    id: "9",
    title: "Whiplash",
    genre: "Drama",
    year: 2014,
    rating: 8.5,
    duration: "1h 47m",
    description:
      "A promising young drummer enrolls at a cut-throat music conservatory where his teacher will stop at nothing.",
    poster: posterDrama,
  },
  {
    id: "10",
    title: "Avatar",
    genre: "Sci-Fi",
    year: 2009,
    rating: 7.8,
    duration: "2h 42m",
    description:
      "A paraplegic Marine dispatched to the moon Pandora becomes torn between following orders and protecting the world.",
    poster: posterScifi,
  },
  {
    id: "11",
    title: "Top Gun: Maverick",
    genre: "Action",
    year: 2022,
    rating: 8.2,
    duration: "2h 11m",
    description:
      "After thirty years, Maverick is still pushing the envelope as a top naval aviator.",
    poster: posterAction,
  },
  {
    id: "12",
    title: "Parasite",
    genre: "Drama",
    year: 2019,
    rating: 8.5,
    duration: "2h 12m",
    description:
      "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    poster: posterDrama,
  },
];

export const FEATURED_MOVIE = MOVIES.find((m) => m.isFeatured) ?? MOVIES[0];
export const TRENDING = MOVIES.slice(0, 6);
export const NEW_RELEASES = [
  MOVIES[3],
  MOVIES[6],
  MOVIES[10],
  MOVIES[11],
  MOVIES[1],
  MOVIES[8],
];
export const CONTINUE_WATCHING = MOVIES.filter(
  (m) => m.progress !== undefined
);
