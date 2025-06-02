import { Clock, Calendar, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion as m, AnimatePresence } from 'framer-motion';
import { useFetch } from '../services/useFetch';
import { useState, useEffect, useCallback } from 'react';
import { MovieSkeleton } from './MovieSkeleton';

const ComingSoon = () => {
    const [genres, setGenres] = useState([]);
    const [page, setPage] = useState(1);
    const [allMovies, setAllMovies] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    // Fetch upcoming movies
    const { data: movies, loading, error, retry } = useFetch(
        `/movie/upcoming?language=en-US&page=${page}`
    );

    // Fetch genres
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_TMDB_BASE_URL}/genre/movie/list?language=en`,
                    {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
                            accept: 'application/json',
                        },
                    }
                );
                const data = await response.json();
                setGenres(data.genres);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };

        fetchGenres();
    }, []);

    // Handle movie accumulation
    useEffect(() => {
        if (movies) {
            setAllMovies(prev => {
                const newMovies = [...prev];
                movies.forEach(movie => {
                    if (!newMovies.find(m => m.id === movie.id)) {
                        newMovies.push({
                            id: movie.id,
                            title: movie.title,
                            poster: movie.poster_path
                                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                : '/placeholder.jpg',
                            releaseDate: movie.release_date,
                            genre: movie.genre_ids
                                ?.map(id => {
                                    const genre = genres.find(g => g.id === id);
                                    return genre?.name;
                                })
                                .filter(Boolean) ?? []
                        });
                    }
                });
                return newMovies;
            });
            setHasMore(movies.length === 20);
        }
    }, [movies, genres]);

    // Handle load more
    const handleLoadMore = useCallback(async () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
        setPage(prev => prev + 1);
    }, [loadingMore, hasMore]);

    return (
        <div className="min-h-screen bg-black text-white py-4 sm:py-8 px-2 sm:px-4">
            {/* Header */}
            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="container mx-auto mb-6 sm:mb-12"
            >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                    <h1 className="text-2xl sm:text-4xl font-bold">Coming Soon</h1>
                    <div className="flex items-center bg-yellow-500/20 px-3 py-1 rounded-full self-start sm:self-auto">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 mr-1" />
                        <span className="text-yellow-500 font-semibold text-sm sm:text-base">
                            Upcoming Releases
                        </span>
                    </div>
                </div>
                <p className="text-gray-400 text-sm sm:text-base">
                    Discover the most anticipated upcoming movie releases
                </p>
            </m.div>

            {/* Movie Grid */}
            <div className="container mx-auto">
                <AnimatePresence mode="wait">
                    {error ? (
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-12"
                        >
                            <p className="text-red-500 mb-4">{error.message}</p>
                            <button
                                onClick={retry}
                                className="px-6 py-2 bg-yellow-500 text-black rounded-full hover:bg-yellow-400"
                            >
                                <RefreshCcw className="w-4 h-4 inline mr-2" />
                                Try Again
                            </button>
                        </m.div>
                    ) : (
                        <m.div
                            layout
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6"
                        >
                            {(loading && page === 1) ? (
                                Array.from({ length: 10 }).map((_, i) => (
                                    <m.div
                                        key={`skeleton-${i}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.2, delay: i * 0.05 }}
                                    >
                                        <MovieSkeleton />
                                    </m.div>
                                ))
                            ) : (
                                allMovies.map((movie, index) => (
                                    <m.div
                                        key={movie.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <Link to={`/movie/${movie.id}`} className="block group">
                                            <div className="aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 relative">
                                                <img
                                                    src={movie.poster}
                                                    alt={movie.title}
                                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <div className="mt-2">
                                                <h3 className="text-white font-medium text-sm sm:text-base line-clamp-1">
                                                    {movie.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <Calendar className="w-4 h-4 text-yellow-500" />
                                                    {new Date(movie.releaseDate).toLocaleDateString()}
                                                </div>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {movie.genre.slice(0, 2).map(g => (
                                                        <span
                                                            key={g}
                                                            className="text-xs px-2 py-0.5 bg-zinc-800 text-gray-300 rounded-full"
                                                        >
                                                            {g}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </Link>
                                    </m.div>
                                ))
                            )}
                        </m.div>
                    )}
                </AnimatePresence>

                {/* Load More Button */}
                {!loading && !error && hasMore && (
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="px-6 py-3 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 
                                disabled:bg-yellow-500/50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loadingMore ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                    Loading...
                                </div>
                            ) : (
                                'Load More Movies'
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComingSoon;