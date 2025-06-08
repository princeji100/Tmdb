import { Star, Play, Filter, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { MovieSkeleton } from './MovieSkeleton';
import { useLazyLoad, useImagePreload, useIntersectionObserver } from '../utilities/performance';

const ratingRanges = ['5+', '6+', '7+', '8+', '9+'];

// Enhanced Movie Card Component with Smooth Animations
const OptimizedMovieCard = ({ movie, index }) => {
    const imgRef = useRef();
    const posterUrl = movie.poster || '/placeholder.jpg';

    const isVisible = useLazyLoad(imgRef, { threshold: 0.1 });
    const { isLoaded, error } = useImagePreload(isVisible ? posterUrl : '');

    // Enhanced animation variants
    const cardVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            y: 50,
            rotateX: -15
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            rotateX: 0,
            transition: {
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: -30,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    const imageVariants = {
        hidden: { scale: 1.2, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.8,
                delay: 0.2,
                ease: "easeOut"
            }
        }
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    return (
        <m.div
            key={movie.id}
            layout
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileHover={{
                scale: 1.05,
                y: -10,
                transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.95 }}
            className="group perspective-1000"
        >
            <Link to={`/movie/${movie.id}`} className="block">
                <m.div
                    ref={imgRef}
                    className="aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 relative shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                        transition: { duration: 0.3 }
                    }}
                >
                    {isVisible ? (
                        <m.img
                            src={posterUrl}
                            alt={movie.title}
                            variants={imageVariants}
                            initial="hidden"
                            animate="visible"
                            className={`w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'
                                } ${error ? 'opacity-50' : ''}`}
                            loading="lazy"
                            whileHover={{
                                scale: 1.1,
                                transition: { duration: 0.4, ease: "easeOut" }
                            }}
                        />
                    ) : (
                        <m.div
                            className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900"
                            animate={{
                                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                                transition: { duration: 2, repeat: Infinity, ease: "linear" }
                            }}
                        />
                    )}

                    {/* Enhanced Overlay */}
                    <m.div
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
                        variants={overlayVariants}
                        initial="hidden"
                        whileHover="visible"
                    >
                        <m.div
                            className="absolute bottom-0 left-0 right-0 p-3"
                            initial={{ y: 20, opacity: 0 }}
                            whileHover={{
                                y: 0,
                                opacity: 1,
                                transition: { delay: 0.1, duration: 0.3 }
                            }}
                        >
                            <div className="flex items-center gap-2 text-white">
                                <m.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                                </m.div>
                                <span className="text-sm font-medium">{movie.rating}</span>
                            </div>
                        </m.div>
                        <m.div
                            className="absolute top-3 right-3"
                            initial={{ scale: 0, rotate: -180 }}
                            whileHover={{
                                scale: 1,
                                rotate: 0,
                                transition: { delay: 0.2, duration: 0.4, ease: "backOut" }
                            }}
                        >
                            <Play className="w-8 h-8 text-white drop-shadow-lg" />
                        </m.div>
                    </m.div>
                </m.div>

                {/* Enhanced Movie Info */}
                <m.div
                    className="mt-3 space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.3, duration: 0.4 }
                    }}
                >
                    <m.h3
                        className="text-white font-medium text-sm md:text-base line-clamp-2 transition-colors duration-300"
                        whileHover={{
                            color: "#eab308",
                            scale: 1.02,
                            transition: { duration: 0.2 }
                        }}
                    >
                        {movie.title}
                    </m.h3>
                    <m.div
                        className="flex items-center justify-between text-sm text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            transition: { delay: 0.4, duration: 0.3 }
                        }}
                    >
                        <m.span
                            whileHover={{
                                color: "#9ca3af",
                                scale: 1.05,
                                transition: { duration: 0.2 }
                            }}
                        >
                            {movie.year}
                        </m.span>
                        {movie.genre && movie.genre.length > 0 && (
                            <m.span
                                className="truncate ml-2 px-2 py-1 bg-zinc-800 rounded-full text-xs"
                                whileHover={{
                                    backgroundColor: "#374151",
                                    scale: 1.05,
                                    transition: { duration: 0.2 }
                                }}
                                initial={{ scale: 0 }}
                                animate={{
                                    scale: 1,
                                    transition: { delay: 0.5, duration: 0.3, ease: "backOut" }
                                }}
                            >
                                {movie.genre[0]}
                            </m.span>
                        )}
                    </m.div>
                </m.div>
            </Link>
        </m.div>
    );
};

function MovieList() {
    // State declarations first
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedYears, setSelectedYears] = useState([]);
    const [selectedRatings, setSelectedRatings] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [genres, setGenres] = useState([]);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const [isFiltering, setIsFiltering] = useState(false);

    // Infinite scroll states
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const loadMoreRef = useRef();

    // Intersection observer for infinite scroll
    const isLoadMoreVisible = useIntersectionObserver(loadMoreRef, { threshold: 0.1 });

    // Memoized values
    const availableYears = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const years = [];
        // Generate years from current year back to 1990
        for (let year = currentYear; year >= 1990; year--) {
            years.push(year.toString());
        }
        return years;
    }, []); // Empty dependency array since this doesn't need to update

    // Callbacks
    const handleRetry = useCallback(() => {
        setError(null);
        setRetryCount(prev => prev + 1);
    }, []);

    const toggleGenre = useCallback((genreId) => {
        setIsFiltering(true);
        setSelectedGenres(prev =>
            prev.includes(genreId)
                ? prev.filter(g => g !== genreId)
                : [...prev, genreId]
        );
        // Reset pagination when filters change
        setPage(1);
        setMovies([]);
        setHasMore(true);
        // Add small delay to show loading state
        setTimeout(() => setIsFiltering(false), 300);
    }, []);

    const toggleYear = useCallback((year) => {
        setIsFiltering(true);
        setSelectedYears(prev =>
            prev.includes(year)
                ? prev.filter(y => y !== year)
                : [...prev, year] // Allow multiple year selections
        );
        // Reset pagination when filters change
        setPage(1);
        setMovies([]);
        setHasMore(true);
        // Add small delay to show loading state
        setTimeout(() => setIsFiltering(false), 300);
    }, []);

    const toggleRating = useCallback((rating) => {
        setIsFiltering(true);
        setSelectedRatings(prev =>
            prev.includes(rating)
                ? prev.filter(r => r !== rating)
                : [...prev, rating]
        );
        // Reset pagination when filters change
        setPage(1);
        setMovies([]);
        setHasMore(true);
        // Add small delay to show loading state
        setTimeout(() => setIsFiltering(false), 300);
    }, []);

    const clearFilters = useCallback(() => {
        setSelectedGenres([]);
        setSelectedYears([]);
        setSelectedRatings([]);
        // Reset pagination when filters change
        setPage(1);
        setMovies([]);
        setHasMore(true);
        setIsFiltering(true);
        // Use RAF for smoother state updates
        requestAnimationFrame(() => {
            setIsFiltering(false);
        });
    }, []);

    // Effects - move all useEffects here, before any conditional returns
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

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const fetchMovies = async (pageNum = 1, isLoadMore = false) => {
            try {
                if (isMounted) {
                    if (isLoadMore) {
                        setLoadingMore(true);
                    } else {
                        setIsFiltering(true);
                        setLoading(true);
                    }
                }

                const url = new URL(`${import.meta.env.VITE_TMDB_BASE_URL}/discover/movie`);
                url.searchParams.append('language', 'en-US');
                url.searchParams.append('sort_by', 'popularity.desc');
                url.searchParams.append('page', pageNum.toString());

                // Add filter params
                if (selectedGenres.length > 0) {
                    url.searchParams.append('with_genres', selectedGenres.join(','));
                }
                if (selectedYears.length > 0) {
                    const minYear = Math.min(...selectedYears.map(Number));
                    const maxYear = Math.max(...selectedYears.map(Number));
                    url.searchParams.append('primary_release_date.gte', `${minYear}-01-01`);
                    url.searchParams.append('primary_release_date.lte', `${maxYear}-12-31`);
                }
                if (selectedRatings.length > 0) {
                    const minRating = Math.min(...selectedRatings.map(Number));
                    url.searchParams.append('vote_average.gte', minRating);
                }

                const response = await fetch(url.toString(), {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
                        accept: 'application/json',
                    },
                    signal: controller.signal
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();

                if (isMounted) {
                    const transformedMovies = data.results.map(movie => ({
                        id: movie.id,
                        title: movie.title,
                        poster: movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : '/placeholder.jpg',
                        rating: movie.vote_average?.toFixed(1) ?? 'N/A',
                        year: movie.release_date
                            ? new Date(movie.release_date).getFullYear().toString()
                            : 'N/A',
                        genre: movie.genre_ids
                            ?.map(id => genres.find(g => g.id === id)?.name)
                            .filter(Boolean) ?? []
                    }));

                    if (isLoadMore) {
                        setMovies(prev => [...prev, ...transformedMovies]);
                    } else {
                        setMovies(transformedMovies);
                    }

                    // Update pagination state
                    setHasMore(pageNum < data.total_pages && data.results.length > 0);
                }
            } catch (error) {
                if (error.name === 'AbortError') return;
                if (isMounted) {
                    console.error('Error fetching movies:', error);
                    setError(error.message);
                }
            } finally {
                if (isMounted) {
                    if (isLoadMore) {
                        setLoadingMore(false);
                    } else {
                        setLoading(false);
                        // Add a small delay before removing the filtering state
                        setTimeout(() => {
                            setIsFiltering(false);
                        }, 300);
                    }
                }
            }
        };

        fetchMovies(page, page > 1);

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [selectedGenres, selectedYears, selectedRatings, genres, page, retryCount]);

    // Load more function
    const loadMore = useCallback(() => {
        if (!loadingMore && hasMore && !loading) {
            setPage(prev => prev + 1);
        }
    }, [loadingMore, hasMore, loading]);

    // Auto-load more when intersection observer triggers
    useEffect(() => {
        if (isLoadMoreVisible && hasMore && !loadingMore && !loading) {
            loadMore();
        }
    }, [isLoadMoreVisible, hasMore, loadingMore, loading, loadMore]);

    useEffect(() => {
        if (!isFilterOpen) return;

        const hasActiveFilters =
            selectedGenres.length > 0 ||
            selectedYears.length > 0 ||
            selectedRatings.length > 0;

        if (hasActiveFilters) {
            setIsFiltering(true);
            // Small delay to ensure loading state is visible
            const timer = setTimeout(() => {
                setIsFiltering(false);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [selectedGenres, selectedYears, selectedRatings, isFilterOpen]);

    // Error boundary render
    if (error) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <p className="text-red-500 mb-4">
                        {error}
                    </p>
                    <button
                        onClick={handleRetry}
                        className="px-6 py-2 bg-yellow-500 text-black rounded-full
                            hover:bg-yellow-400 transition-colors"
                    >
                        Try Again
                    </button>
                </m.div>
            </div>
        );
    }

    // Main render
    return (
        <div className="min-h-[calc(100vh-64px)] bg-black">
            <div className="container mx-auto px-4 py-6">
                {/* Header with Filter Toggle */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                        Popular Movies
                    </h1>
                    <button
                        onClick={() => setIsFilterOpen(prev => !prev)}
                        className={`group p-2.5 sm:p-2 rounded-full transition-all duration-300 touch-manipulation self-start sm:self-auto ${isFilterOpen
                            ? 'bg-yellow-500 text-black scale-105'
                            : 'bg-zinc-800 text-white hover:bg-zinc-700 hover:scale-105'
                            }`}
                        aria-label={isFilterOpen ? 'Close filters' : 'Open filters'}
                    >
                        <Filter className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                {/* Filter Section */}
                <AnimatePresence>
                    {isFilterOpen && (
                        <m.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden mb-6 sm:mb-8 bg-zinc-900/50 p-3 sm:p-4 rounded-lg border border-zinc-800"
                        >
                            {/* Genre Filters */}
                            <div className="mb-4 sm:mb-6">
                                <h3 className="text-white text-base sm:text-lg mb-2 sm:mb-3">Genre</h3>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {genres.map(genre => (
                                        <m.button
                                            key={genre.id}
                                            onClick={() => toggleGenre(genre.id)}
                                            disabled={isFiltering}
                                            className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm transition-all duration-200 touch-manipulation relative ${selectedGenres.includes(genre.id)
                                                ? 'bg-yellow-500 text-black scale-105'
                                                : 'bg-zinc-800 text-white hover:bg-zinc-700 active:scale-95'
                                                } ${isFiltering ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {isFiltering && selectedGenres.includes(genre.id) && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                                                </div>
                                            )}
                                            <span className={isFiltering && selectedGenres.includes(genre.id) ? 'opacity-0' : ''}>
                                                {genre.name}
                                            </span>
                                        </m.button>
                                    ))}
                                </div>
                            </div>

                            {/* Year Filters Section */}
                            <div className="mb-4 sm:mb-6">
                                <div className="flex items-center justify-between mb-2 sm:mb-3">
                                    <h3 className="text-white text-base sm:text-lg">Year</h3>
                                    {selectedYears.length > 0 && (
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <span className="text-xs sm:text-sm text-yellow-500">
                                                {selectedYears.length} selected
                                            </span>
                                            <button
                                                onClick={() => setSelectedYears([])}
                                                className="text-gray-400 hover:text-white p-1 touch-manipulation"
                                                aria-label="Clear year filters"
                                            >
                                                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2 max-h-32 sm:max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800">
                                    {availableYears.map(year => (
                                        <m.button
                                            key={year}
                                            onClick={() => toggleYear(year)}
                                            disabled={isFiltering}
                                            className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm transition-all duration-200 touch-manipulation relative ${selectedYears.includes(year)
                                                ? 'bg-yellow-500 text-black scale-105'
                                                : 'bg-zinc-800 text-white hover:bg-zinc-700 active:scale-95'
                                                } ${isFiltering ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {isFiltering && selectedYears.includes(year) && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                                                </div>
                                            )}
                                            <span className={isFiltering && selectedYears.includes(year) ? 'opacity-0' : ''}>
                                                {year}
                                            </span>
                                        </m.button>
                                    ))}
                                </div>
                            </div>

                            {/* Rating Filter */}
                            <div className="mb-4 sm:mb-6">
                                <div className="flex items-center justify-between mb-2 sm:mb-3">
                                    <h3 className="text-white text-base sm:text-lg">Rating</h3>
                                    {selectedRatings.length > 0 && (
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <span className="text-xs sm:text-sm text-yellow-500">
                                                {selectedRatings.length} selected
                                            </span>
                                            <button
                                                onClick={() => setSelectedRatings([])}
                                                className="text-gray-400 hover:text-white p-1 touch-manipulation"
                                                aria-label="Clear rating filters"
                                            >
                                                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {ratingRanges.map(rating => (
                                        <m.button
                                            key={rating}
                                            onClick={() => toggleRating(rating.replace('+', ''))}
                                            disabled={isFiltering}
                                            className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm transition-all duration-200 touch-manipulation flex items-center gap-1 relative ${selectedRatings.includes(rating.replace('+', ''))
                                                ? 'bg-yellow-500 text-black scale-105'
                                                : 'bg-zinc-800 text-white hover:bg-zinc-700 active:scale-95'
                                                } ${isFiltering ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {isFiltering && selectedRatings.includes(rating.replace('+', '')) ? (
                                                <div className="w-3 h-3 sm:w-4 sm:h-4 border border-current border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <Star
                                                    className={`w-3 h-3 sm:w-4 sm:h-4 ${selectedRatings.includes(rating.replace('+', ''))
                                                        ? 'fill-current'
                                                        : ''
                                                        }`}
                                                />
                                            )}
                                            {rating}
                                        </m.button>
                                    ))}
                                </div>
                            </div>

                            {/* Active Filters */}
                            {(selectedGenres.length > 0 || selectedYears.length > 0 || selectedRatings.length > 0) && (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 pt-2 sm:pt-4 border-t border-zinc-800">
                                    <span className="text-gray-400 text-xs sm:text-sm">Active Filters:</span>
                                    <button
                                        onClick={clearFilters}
                                        disabled={isFiltering}
                                        className={`text-yellow-500 text-xs sm:text-sm hover:underline self-start sm:self-auto touch-manipulation py-1 flex items-center gap-2 ${isFiltering ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isFiltering && (
                                            <div className="w-3 h-3 border border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                                        )}
                                        Clear All ({selectedGenres.length + selectedYears.length + selectedRatings.length})
                                    </button>
                                </div>
                            )}
                        </m.div>
                    )}
                </AnimatePresence>

                {/* Movie Grid with improved loading states */}
                <div className="container mx-auto relative">
                    {/* Filtering overlay */}
                    {isFiltering && !loading && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                            <div className="flex items-center gap-3 text-yellow-500">
                                <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-sm sm:text-base">Filtering movies...</span>
                            </div>
                        </div>
                    )}

                    <m.div
                        layout
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6"
                    >
                        {(loading || isFiltering) ? (
                            // Skeleton loading state
                            <AnimatePresence>
                                {[...Array(10)].map((_, i) => (
                                    <m.div
                                        key={`skeleton-${i}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <MovieSkeleton />
                                    </m.div>
                                ))}
                            </AnimatePresence>
                        ) : movies.length > 0 ? (
                            // Optimized Movie grid with lazy loading
                            <AnimatePresence>
                                {movies.map((movie, index) => (
                                    <OptimizedMovieCard
                                        key={movie.id}
                                        movie={movie}
                                        index={index}
                                    />
                                ))}
                            </AnimatePresence>
                        ) : (
                            // Empty state
                            <AnimatePresence>
                                <m.div
                                    key="empty-state"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="col-span-full text-center py-8 sm:py-12"
                                >
                                    <p className="text-gray-400 text-base sm:text-lg">
                                        No movies match your selected filters
                                    </p>
                                    <button
                                        onClick={clearFilters}
                                        className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 transition-colors text-sm sm:text-base"
                                    >
                                        Clear Filters
                                    </button>
                                </m.div>
                            </AnimatePresence>
                        )}

                        {/* Load More Skeletons */}
                        <AnimatePresence>
                            {loadingMore && (
                                <m.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="col-span-full"
                                >
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 mt-6">
                                        {Array.from({ length: 12 }).map((_, i) => (
                                            <m.div
                                                key={`load-more-skeleton-${i}`}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                            >
                                                <MovieSkeleton />
                                            </m.div>
                                        ))}
                                    </div>
                                </m.div>
                            )}
                        </AnimatePresence>

                    </m.div>

                    {/* Infinite Scroll Trigger - Outside Grid */}
                    {!loading && !error && hasMore && (
                        <div
                            ref={loadMoreRef}
                            className="h-20 flex items-center justify-center mt-8"
                        >
                            <div className="text-gray-500 text-sm">
                                {loadingMore ? 'Loading more movies...' : 'Scroll for more'}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MovieList;