import { Star, Clock, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion as m, AnimatePresence } from 'framer-motion';
import { useFetch } from '../services/useFetch';
import { useState, useEffect, useCallback } from 'react';
import { MovieSkeleton } from './MovieSkeleton';

const TopRated = () => {
    // Add genres state
    const [genres, setGenres] = useState([]);
    const [page, setPage] = useState(1);
    const [allMovies, setAllMovies] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const { data: movies, loading, error, retry } = useFetch(
        `/movie/top_rated?language=en-US&vote_average.gte=8&page=${page}`
    );

    // Add genres fetch
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

    // Update movie accumulation effect - remove genres from dependency array
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
                            rating: movie.vote_average?.toFixed(1) ?? 'N/A',
                            year: movie.release_date?.split('-')[0] ?? 'N/A',
                            genre: movie.genre_ids
                                ?.map(id => {
                                    const genre = genres.find(g => g.id === id);
                                    return genre?.name;
                                })
                                .filter(Boolean) ?? [],
                            duration: movie.runtime
                                ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
                                : null
                        });
                    }
                });
                return newMovies;
            });
            setHasMore(movies.length === 20); // Assuming 20 is page size
        }
    }, [movies]); // Remove genres from dependency array

    // Handle load more with error handling
    const handleLoadMore = useCallback(async () => {
        if (loadingMore || !hasMore) return;

        try {
            setLoadingMore(true);
            // Add artificial delay for better UX
            await new Promise(resolve => setTimeout(resolve, 800));
            setPage(prev => prev + 1);
        } catch (error) {
            console.error('Error loading more movies:', error);
        }
    }, [loadingMore, hasMore]);

    // Handle retry
    const handleRetry = useCallback(() => {
        retry();
    }, [retry]);

    return (
        <div className="min-h-screen bg-black text-white py-4 sm:py-8 px-2 sm:px-4">
            {/* Header Section */}
            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="container mx-auto mb-6 sm:mb-12"
            >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                    <h1 className="text-2xl sm:text-4xl font-bold">Top Rated Movies</h1>
                    <div className="flex items-center bg-yellow-500/20 px-3 py-1 rounded-full self-start sm:self-auto">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 mr-1" fill="currentColor" />
                        <span className="text-yellow-500 font-semibold text-sm sm:text-base">8.0+ Rating</span>
                    </div>
                </div>
                <p className="text-gray-400 text-sm sm:text-base">
                    Exceptional films that received outstanding ratings from audiences worldwide
                </p>
            </m.div>

            {/* Error State with Retry */}
            <AnimatePresence mode="wait">
                {error && (
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="container mx-auto text-center py-12"
                    >
                        <div className="max-w-md mx-auto bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                            <p className="text-red-500 mb-4">{error.message}</p>
                            {!error.isRetrying && (
                                <button
                                    onClick={handleRetry}
                                    className="flex items-center gap-2 mx-auto px-4 py-2 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 transition-colors"
                                >
                                    <RefreshCcw className="w-4 h-4" />
                                    Try Again
                                </button>
                            )}
                        </div>
                    </m.div>
                )}
            </AnimatePresence>

            {/* Movie Grid with Loading States */}
            <div className="container mx-auto">
                <AnimatePresence mode="wait">
                    <m.div
                        layout
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6"
                    >
                        {(loading && page === 1) ? (
                            // Initial loading state
                            Array.from({ length: 8 }).map((_, i) => (
                                <m.div
                                    key={`skeleton-${i}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2, delay: i * 0.05 }}
                                >
                                    <MovieSkeleton />
                                </m.div>
                            ))
                        ) : allMovies.length > 0 ? (
                            // Movies grid
                            allMovies.map((movie, index) => (
                                <m.div
                                    key={movie.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Link
                                        to={`/movie/${movie.id}`}
                                        className="bg-zinc-900/50 rounded-xl overflow-hidden group hover:bg-zinc-800/50 transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        {/* Poster */}
                                        <div className="relative aspect-[2/3] overflow-hidden">
                                            <img
                                                src={movie.poster}
                                                alt={movie.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                            {/* Rating Badge */}
                                            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
                                                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                                                <span className="text-sm font-semibold">{movie.rating}</span>
                                            </div>
                                        </div>

                                        {/* Movie Info */}
                                        <div className="p-4">
                                            <h2 className="text-lg font-semibold mb-2 group-hover:text-yellow-500 transition-colors line-clamp-1">
                                                {movie.title}
                                            </h2>
                                            <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
                                                {movie.duration && (
                                                    <>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            <span>{movie.duration}</span>
                                                        </div>
                                                        <span>•</span>
                                                    </>
                                                )}
                                                <span>{movie.year}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {movie.genre?.slice(0, 2).map((genre) => (
                                                    <span
                                                        key={genre}
                                                        className="text-xs px-2 py-1 bg-zinc-800 rounded-full"
                                                    >
                                                        {genre}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </Link>
                                </m.div>
                            ))
                        ) : (
                            // Empty state
                            <m.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full text-center py-12"
                            >
                                <p className="text-gray-400">No movies found.</p>
                            </m.div>
                        )}
                    </m.div>
                </AnimatePresence>

                {/* Load More Section with Loading State */}
                <AnimatePresence>
                    {loadingMore && (
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mt-6"
                        >
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <m.div
                                        key={`load-more-skeleton-${i}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: i * 0.05 }}
                                    >
                                        <MovieSkeleton />
                                    </m.div>
                                ))}
                            </div>
                        </m.div>
                    )}
                </AnimatePresence>

                {/* Load More Button */}
                {!loading && !error && hasMore && (
                    <div className="flex justify-center mt-6 sm:mt-8">
                        <button
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-yellow-500 
                            text-black rounded-full hover:bg-yellow-400 flex items-center justify-center
                            gap-2 disabled:bg-yellow-500/50 disabled:cursor-not-allowed 
                            transition-colors max-w-sm mx-4 sm:mx-0"
                        >
                            {loadingMore ? (
                                <>
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-black 
                                    border-t-transparent rounded-full animate-spin"
                                    />
                                    <span>Loading more movies...</span>
                                </>
                            ) : (
                                <>
                                    <span>Load More Movies</span>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopRated;
