import { Star, Play, Filter, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { MovieSkeleton } from './MovieSkeleton';
import { ContentLoader, ButtonLoader, CardSkeleton, TextSkeleton } from './LoadingStates';

const ratingRanges = ['5+', '6+', '7+', '8+', '9+'];

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
        setSelectedGenres(prev =>
            prev.includes(genreId)
                ? prev.filter(g => g !== genreId)
                : [...prev, genreId]
        );
    }, []); // Remove setLoading from here

    const toggleYear = useCallback((year) => {
        setSelectedYears(prev =>
            prev.includes(year)
                ? prev.filter(y => y !== year)
                : [...prev, year] // Allow multiple year selections
        );
    }, []); // Remove setLoading from here

    // Add this function after other toggle handlers
    const toggleRating = useCallback((rating) => {
        setSelectedRatings(prev =>
            prev.includes(rating)
                ? prev.filter(r => r !== rating)
                : [...prev, rating]
        );
    }, []); // Remove setLoading from here

    const clearFilters = useCallback(() => {
        setSelectedGenres([]);
        setSelectedYears([]);
        setSelectedRatings([]);
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

        const fetchMovies = async () => {
            try {
                if (isMounted) {
                    setIsFiltering(true);
                    setLoading(true);
                }

                const url = new URL(`${import.meta.env.VITE_TMDB_BASE_URL}/discover/movie`);
                url.searchParams.append('language', 'en-US');
                url.searchParams.append('sort_by', 'popularity.desc');

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

                    setMovies(transformedMovies);
                }
            } catch (error) {
                if (error.name === 'AbortError') return;
                if (isMounted) {
                    console.error('Error fetching movies:', error);
                    setError(error.message);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                    // Add a small delay before removing the filtering state
                    setTimeout(() => {
                        setIsFiltering(false);
                    }, 300);
                }
            }
        };

        fetchMovies();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [selectedGenres, selectedYears, selectedRatings, genres]);

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
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                        Popular Movies
                    </h1>
                    <button
                        onClick={() => setIsFilterOpen(prev => !prev)}
                        className={`group p-2 rounded-full transition-colors ${isFilterOpen
                            ? 'bg-yellow-500 text-black'
                            : 'bg-zinc-800 text-white hover:bg-zinc-700'
                            }`}
                    >
                        <Filter className="size-6" />
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
                            className="overflow-hidden mb-8 bg-zinc-900/50 p-4 rounded-lg border border-zinc-800"
                        >
                            {/* Genre Filters */}
                            <div className="mb-6">
                                <h3 className="text-white text-lg mb-3">Genre</h3>
                                <div className="flex flex-wrap gap-2">
                                    {genres.map(genre => (
                                        <m.button
                                            key={genre.id}
                                            onClick={() => toggleGenre(genre.id)}
                                            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${selectedGenres.includes(genre.id)
                                                ? 'bg-yellow-500 text-black'
                                                : 'bg-zinc-800 text-white hover:bg-zinc-700'
                                                }`}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {genre.name}
                                        </m.button>
                                    ))}
                                </div>
                            </div>

                            {/* Year Filters Section */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-white text-lg">Year</h3>
                                    {selectedYears.length > 0 && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-yellow-500">
                                                {selectedYears.length} selected
                                            </span>
                                            <button
                                                onClick={() => setSelectedYears([])}
                                                className="text-gray-400 hover:text-white"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800">
                                    {availableYears.map(year => (
                                        <m.button
                                            key={year}
                                            onClick={() => toggleYear(year)}
                                            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${selectedYears.includes(year)
                                                ? 'bg-yellow-500 text-black'
                                                : 'bg-zinc-800 text-white hover:bg-zinc-700'
                                                }`}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {year}
                                        </m.button>
                                    ))}
                                </div>
                            </div>

                            {/* Rating Filter */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-white text-lg">Rating</h3>
                                    {selectedRatings.length > 0 && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-yellow-500">
                                                {selectedRatings.length} selected
                                            </span>
                                            <button
                                                onClick={() => setSelectedRatings([])}
                                                className="text-gray-400 hover:text-white"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {ratingRanges.map(rating => (
                                        <m.button
                                            key={rating}
                                            onClick={() => toggleRating(rating.replace('+', ''))}
                                            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${selectedRatings.includes(rating.replace('+', ''))
                                                ? 'bg-yellow-500 text-black'
                                                : 'bg-zinc-800 text-white hover:bg-zinc-700'
                                                }`}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Star
                                                className={`w-4 h-4 inline-block mr-1 ${selectedRatings.includes(rating.replace('+', ''))
                                                    ? 'fill-current'
                                                    : ''
                                                    }`}
                                            />
                                            {rating}
                                        </m.button>
                                    ))}
                                </div>
                            </div>

                            {/* Active Filters */}
                            {(selectedGenres.length > 0 || selectedYears.length > 0 || selectedRatings.length > 0) && (
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-gray-400 text-sm">Active Filters:</span>
                                    <button
                                        onClick={clearFilters}
                                        className="text-yellow-500 text-sm hover:underline"
                                    >
                                        Clear All
                                    </button>
                                </div>
                            )}
                        </m.div>
                    )}
                </AnimatePresence>

                {/* Movie Grid with improved loading states */}
                <div className="container mx-auto px-4">
                    <m.div
                        layout
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {(loading || isFiltering) ? (
                                // Skeleton loading state
                                [...Array(10)].map((_, i) => (
                                    <m.div
                                        key={`skeleton-${i}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <MovieSkeleton />
                                    </m.div>
                                ))
                            ) : movies.length > 0 ? (
                                // Movie grid
                                movies.map(movie => (
                                    <m.div
                                        key={movie.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Link
                                            to={`/movie/${movie.id}`}
                                            className="group relative"
                                        >
                                            {/* Movie Poster */}
                                            <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                                                <img
                                                    src={movie.poster}
                                                    alt={movie.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                {/* Overlay */}
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-black p-3 rounded-full transform scale-0 group-hover:scale-100 transition-transform">
                                                        <Play className="w-6 h-6" fill="currentColor" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Movie Info */}
                                            <div className="mt-2">
                                                <h3 className="text-white font-medium text-sm sm:text-base line-clamp-1">
                                                    {movie.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <div className="flex items-center">
                                                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                                        {movie.rating}
                                                    </div>
                                                    <span>•</span>
                                                    <span>{movie.year}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {movie.genre.map(g => (
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
                            ) : (
                                // Empty state
                                <m.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-full text-center py-12"
                                >
                                    <p className="text-gray-400 text-lg">
                                        No movies match your selected filters
                                    </p>
                                </m.div>
                            )}
                        </AnimatePresence>
                    </m.div>
                </div>
            </div>
        </div>
    );
}

export default MovieList;