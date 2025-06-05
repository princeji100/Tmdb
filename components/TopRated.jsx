import { Star, Clock, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion as m, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import { MovieSkeleton } from './MovieSkeleton';
import { InlineLoader } from './LoadingStates';
import { usePaginatedData } from '../hooks/usePaginatedData';
import { useIntersectionObserver } from '../utilities/performance';

const TopRated = () => {
    // Add genres state
    const [genres, setGenres] = useState([]);
    const loadMoreRef = useRef();

    // Use the paginated data hook
    const {
        data: allMovies,
        loading,
        loadingMore,
        error,
        hasMore,
        loadMore,
        retry
    } = usePaginatedData('/movie/top_rated?language=en-US&vote_average.gte=8');

    // Intersection observer for infinite scroll
    const isLoadMoreVisible = useIntersectionObserver(loadMoreRef, { threshold: 0.1 });

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

    // Auto-load more when intersection observer triggers
    useEffect(() => {
        if (isLoadMoreVisible && hasMore && !loadingMore && !loading) {
            loadMore();
        }
    }, [isLoadMoreVisible, hasMore, loadingMore, loading, loadMore]);

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
                <m.div
                    layout
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6"
                >
                    {loading ? (
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

                {/* Infinite Scroll Trigger */}
                {!loading && !error && hasMore && (
                    <div
                        ref={loadMoreRef}
                        className="flex justify-center mt-6 sm:mt-8 py-4"
                    >
                        {loadingMore && (
                            <div className="flex items-center gap-2 text-yellow-500">
                                <InlineLoader size="sm" className="border-yellow-500 border-t-transparent" />
                                <span>Loading more movies...</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopRated;
