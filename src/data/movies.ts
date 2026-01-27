export interface Movie {
  id: number;
  title: string;
  poster: string;
  rating: number;
  votes: string;
  genres: string[];
}

export const featuredMovie = {
  title: "Pushpa 2: The Rule",
  description: "After escaping the clutches of the police, Pushpa Raj rises to become the undisputed king of the red sandalwood smuggling syndicate. But when a formidable new enemy enters the scene, Pushpa must protect his empire and his loved ones.",
  backgroundImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80",
  rating: "UA",
  duration: "3h 21m",
  genre: "Action / Drama / Thriller",
};

export const nowPlayingMovies: Movie[] = [
  {
    id: 1,
    title: "Pushpa 2: The Rule",
    poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80",
    rating: 9.2,
    votes: "245.5K",
    genres: ["Action", "Drama"],
  },
  {
    id: 2,
    title: "Mufasa: The Lion King",
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80",
    rating: 8.8,
    votes: "120.3K",
    genres: ["Adventure", "Animation"],
  },
  {
    id: 3,
    title: "Moana 2",
    poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&q=80",
    rating: 8.5,
    votes: "89.2K",
    genres: ["Adventure", "Animation"],
  },
  {
    id: 4,
    title: "Baby John",
    poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&q=80",
    rating: 7.9,
    votes: "56.8K",
    genres: ["Action", "Thriller"],
  },
  {
    id: 5,
    title: "Marco",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80",
    rating: 9.0,
    votes: "34.1K",
    genres: ["Action", "Drama"],
  },
];

export const upcomingMovies: Movie[] = [
  {
    id: 6,
    title: "Game Changer",
    poster: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&q=80",
    rating: 0,
    votes: "Coming Soon",
    genres: ["Action", "Drama"],
  },
  {
    id: 7,
    title: "Azaad",
    poster: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&q=80",
    rating: 0,
    votes: "Coming Soon",
    genres: ["Drama", "Period"],
  },
  {
    id: 8,
    title: "Emergency",
    poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80",
    rating: 0,
    votes: "Coming Soon",
    genres: ["Biography", "Drama"],
  },
  {
    id: 9,
    title: "Fateh",
    poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80",
    rating: 0,
    votes: "Coming Soon",
    genres: ["Action", "Thriller"],
  },
  {
    id: 10,
    title: "Sky Force",
    poster: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=400&q=80",
    rating: 0,
    votes: "Coming Soon",
    genres: ["Action", "War"],
  },
];

export const trendingMovies: Movie[] = [
  {
    id: 11,
    title: "Dune: Part Two",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80",
    rating: 9.1,
    votes: "892.4K",
    genres: ["Sci-Fi", "Adventure"],
  },
  {
    id: 12,
    title: "Oppenheimer",
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80",
    rating: 9.3,
    votes: "1.2M",
    genres: ["Biography", "Drama"],
  },
  {
    id: 13,
    title: "Kalki 2898 AD",
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80",
    rating: 8.7,
    votes: "567.8K",
    genres: ["Sci-Fi", "Action"],
  },
  {
    id: 14,
    title: "Stree 2",
    poster: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&q=80",
    rating: 8.9,
    votes: "445.2K",
    genres: ["Horror", "Comedy"],
  },
  {
    id: 15,
    title: "Deadpool & Wolverine",
    poster: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&q=80",
    rating: 8.6,
    votes: "789.1K",
    genres: ["Action", "Comedy"],
  },
];
