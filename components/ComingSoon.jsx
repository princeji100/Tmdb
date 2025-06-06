import { Clock, Calendar, RefreshCcw, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion as m, AnimatePresence } from 'framer-motion';
import { useFetch } from '../services/useFetch';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { MovieSkeleton } from './MovieSkeleton';
import { useRef } from 'react';

const ComingSoon = () => {
    const [genres, setGenres] = useState([]);
    const [page, setPage] = useState(1);
    const [allMovies, setAllMovies] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'recent'
    const loadMoreRef = useRef();

    // Dynamic endpoint based on active tab
    const endpoint = useMemo(() => {
        if (activeTab === 'upcoming') {
            return `/movie/upcoming?language=en-US&page=${page}`;
        } else {
            return `/movie/now_playing?language=en-US&page=${page}`;
        }
    }, [activeTab, page]);

    // Fetch movies based on active tab
    const { data: movies, loading, error, retry } = useFetch(endpoint);

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

    // Handle movie accumulation with date filtering
    useEffect(() => {
        if (movies) {
            setAllMovies(prev => {
                // If it's page 1 or tab switch, start fresh
                const isFirstPage = page === 1;
                const newMovies = isFirstPage ? [] : [...prev];

                const today = new Date();
                const todayStr = today.toISOString().split('T')[0];

                // Get date 30 days ago for recent movies
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

                movies.forEach(movie => {
                    // Only add movies that haven't been added yet
                    if (!newMovies.find(m => m.id === movie.id)) {
                        // Check if movie has a valid release date
                        if (movie.release_date) {
                            let shouldInclude = false;

                            if (activeTab === 'upcoming') {
                                // For upcoming: be more lenient to ensure we get content
                                // Include movies from past week to future
                                const oneWeekAgo = new Date();
                                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                                const oneWeekAgoStr = oneWeekAgo.toISOString().split('T')[0];
                                shouldInclude = movie.release_date >= oneWeekAgoStr;
                            } else {
                                // For recent: include movies released in the last 30 days
                                shouldInclude = movie.release_date >= thirtyDaysAgoStr && movie.release_date <= todayStr;
                            }

                            if (shouldInclude) {
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
                        }
                    }
                });

                // For load more: if we didn't get enough new movies, add all remaining movies from API
                if (!isFirstPage && newMovies.length - prev.length < 5) {
                    movies.forEach(movie => {
                        if (!newMovies.find(m => m.id === movie.id) && movie.release_date) {
                            // Add any movie to ensure load more shows content
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
                }

                // Sort movies by release date
                if (activeTab === 'upcoming') {
                    // Upcoming: earliest first
                    return newMovies.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
                } else {
                    // Recent: latest first
                    return newMovies.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                }
            });
            setHasMore(movies.length === 20);
        }
    }, [movies, genres, activeTab, page]);

    // Reset loading more state when new data is received
    useEffect(() => {
        if (movies && loadingMore) {
            setLoadingMore(false);
        }
    }, [movies, loadingMore]);

    // Ensure we start with upcoming tab loaded
    useEffect(() => {
        if (activeTab === 'upcoming' && allMovies.length === 0 && !loading && !error) {
            // If no movies are loaded for upcoming tab, ensure we have the right state
            setPage(1);
        }
    }, [activeTab, allMovies.length, loading, error]);

    // Handle load more
    const handleLoadMore = useCallback(async () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
        setPage(prev => prev + 1);
    }, [loadingMore, hasMore]);

    // Handle tab switching
    const handleTabSwitch = useCallback((tab) => {
        if (tab !== activeTab) {
            setActiveTab(tab);
            setPage(1);
            setAllMovies([]);
            setHasMore(true);
            setLoadingMore(false);
        }
    }, [activeTab]);

    // Manual load more - no auto-loading

    return (
        <div className="min-h-screen bg-black text-white py-4 sm:py-8 px-2 sm:px-4">
            {/* Header */}
            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="container mx-auto mb-6 sm:mb-12"
            >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <h1 className="text-2xl sm:text-4xl font-bold">New & Upcoming</h1>
                    <div className="flex items-center bg-yellow-500/20 px-3 py-1 rounded-full self-start sm:self-auto">
                        <Film className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 mr-1" />
                        <span className="text-yellow-500 font-semibold text-sm sm:text-base">
                            Latest Movies
                        </span>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    <button
                        onClick={() => handleTabSwitch('upcoming')}
                        className={`flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${activeTab === 'upcoming'
                            ? 'bg-yellow-500 text-black'
                            : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                            }`}
                    >
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="whitespace-nowrap">Coming Soon</span>
                    </button>
                    <button
                        onClick={() => handleTabSwitch('recent')}
                        className={`flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${activeTab === 'recent'
                            ? 'bg-yellow-500 text-black'
                            : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                            }`}
                    >
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="whitespace-nowrap">Recently Released</span>
                    </button>
                </div>

                <p className="text-gray-400 text-sm sm:text-base">
                    {activeTab === 'upcoming'
                        ? 'Discover the most anticipated upcoming movie releases'
                        : 'Check out the latest movies released in the past 30 days'
                    }
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
                            ) : allMovies.length === 0 && !loading ? (
                                <m.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-full text-center py-12"
                                >
                                    <div className="max-w-md mx-auto bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                                        {activeTab === 'upcoming' ? (
                                            <>
                                                <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                                                <h3 className="text-xl font-semibold mb-2">No Upcoming Movies Found</h3>
                                                <p className="text-gray-400">
                                                    We couldn't find any movies with future release dates. Check back later for new releases!
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <Calendar className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                                                <h3 className="text-xl font-semibold mb-2">No Recent Movies Found</h3>
                                                <p className="text-gray-400">
                                                    We couldn't find any movies released in the past 30 days. Try checking the upcoming releases!
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </m.div>
                            ) : (
                                allMovies.map((movie, index) => (
                                    <m.div
                                        key={movie.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.4,
                                            delay: Math.min(index * 0.03, 0.5),
                                            ease: "easeOut"
                                        }}
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
                                                    onError={(e) => {
                                                        e.target.src = '/placeholder.jpg';
                                                    }}
                                                />
                                                {/* Status Badge */}
                                                <div className="absolute top-1 sm:top-2 left-1 sm:left-2">
                                                    <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-semibold rounded-full ${activeTab === 'upcoming'
                                                        ? 'bg-blue-500/90 text-white'
                                                        : 'bg-green-500/90 text-white'
                                                        }`}>
                                                        {activeTab === 'upcoming' ? 'Upcoming' : 'New'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Movie Info */}
                                            <div className="p-2 sm:p-3 md:p-4">
                                                <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-2 group-hover:text-yellow-500 transition-colors line-clamp-1">
                                                    {movie.title}
                                                </h2>
                                                <div className="flex items-center gap-1 sm:gap-2 md:gap-3 text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                                                        <span className="text-xs sm:text-sm">
                                                            {movie.releaseDate ?
                                                                new Date(movie.releaseDate).toLocaleDateString('en-GB', {
                                                                    day: '2-digit',
                                                                    month: '2-digit',
                                                                    year: 'numeric'
                                                                }) : 'TBA'
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-1 sm:gap-2">
                                                    {movie.genre?.slice(0, 2).map((genre) => (
                                                        <span
                                                            key={genre}
                                                            className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-zinc-800 rounded-full"
                                                        >
                                                            {genre}
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
                <AnimatePresence>
                    {!loading && !error && hasMore && (
                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex justify-center mt-6 sm:mt-8"
                        >
                            <m.button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 
                                    disabled:bg-yellow-500/50 disabled:cursor-not-allowed transition-all duration-300
                                    shadow-lg hover:shadow-xl transform text-sm sm:text-base"
                            >
                                <AnimatePresence mode="wait">
                                    {loadingMore ? (
                                        <m.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                            Loading...
                                        </m.div>
                                    ) : (
                                        <m.span
                                            key="text"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            Load More Movies
                                        </m.span>
                                    )}
                                </AnimatePresence>
                            </m.button>
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
                                <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                                <span>Loading more movies...</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComingSoon;