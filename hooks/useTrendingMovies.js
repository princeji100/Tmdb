import { useState, useEffect } from 'react';

export function useTrendingMovies() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_TMDB_BASE_URL}/trending/movie/day?language=en-US`, {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
                        accept: 'application/json',
                    },
                });

                if (!res.ok) throw new Error('Failed to fetch trending movies');

                const json = await res.json();
                
                const movies = json.results.slice(0, 5).map(movie => ({
                    id: movie.id,
                    title: movie.title,
                    year: new Date(movie.release_date).getFullYear(),
                    rating: movie.vote_average.toFixed(1),
                    duration: "2h 30m", // We'll need another API call for runtime
                    genre: movie.genre_ids, // We'll convert these IDs later
                    description: movie.overview,
                    backgroundImage: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
                    posterImage: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                }));

                setData(movies);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchTrending();
    }, []);

    return { data, loading, error };
}