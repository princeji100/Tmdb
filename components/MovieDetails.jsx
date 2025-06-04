import {
    Star,
    Clock,
    Calendar,
    Play,
    Share2,
    Award,
    Film,
    Building,
    Building2,
    BookOpen,
    Heart,
    ThumbsUp
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useMovieDetails } from '../hooks/useMovieDetails';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const MovieDetailsSkeleton = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-b from-black to-zinc-900 overflow-x-hidden"
    >
        {/* Hero Section */}
        <div className="relative h-[60vh] sm:h-[70vh] w-full">
            <div className="absolute inset-0 bg-gradient-radial from-zinc-800/50 to-black animate-pulse" />
            <div className="relative container mx-auto px-4 sm:px-6 h-full flex items-end pb-8 sm:pb-16">
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 w-full">
                    <div className="w-32 sm:w-44 md:w-64 lg:w-80 xl:w-96 mx-auto sm:mx-0 aspect-[2/3] bg-gradient-to-br from-zinc-700/50 to-zinc-800/50 rounded-xl shadow-2xl animate-pulse" />
                    <div className="space-y-4 sm:space-y-8 flex-1 text-center sm:text-left">
                        <div className="h-8 sm:h-12 bg-gradient-to-r from-zinc-700/50 to-zinc-800/50 rounded-lg w-3/4 mx-auto sm:mx-0 animate-pulse" />
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-8 sm:h-10 bg-gradient-to-r from-zinc-700/50 to-zinc-800/50 rounded-full w-20 sm:w-24 animate-pulse" />
                            ))}
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-3 sm:h-4 bg-gradient-to-r from-zinc-700/50 to-zinc-800/50 rounded w-full animate-pulse"
                                    style={{ width: `${100 - (i * 10)}%` }} />
                            ))}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                            <div className="h-10 sm:h-12 bg-yellow-500/20 rounded-full w-full sm:w-40 animate-pulse" />
                            <div className="h-10 sm:h-12 bg-zinc-700/50 rounded-full w-full sm:w-40 animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Details Section */}
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 sm:gap-12">
                {/* Left Column */}
                <div className="space-y-6 sm:space-y-8">
                    <div className="h-8 sm:h-10 bg-gradient-to-r from-zinc-700/50 to-zinc-800/50 rounded-lg w-48 animate-pulse" />
                    <div className="grid grid-cols-1 gap-6 sm:gap-8">
                        {[1, 2].map(i => (
                            <div key={i} className="bg-zinc-900/60 rounded-xl p-4 sm:p-6 h-48 sm:h-64 animate-pulse" />
                        ))}
                    </div>
                    {/* Production Section */}
                    <div className="bg-zinc-900/60 rounded-xl p-4 sm:p-6 animate-pulse">
                        <div className="h-6 sm:h-8 bg-gradient-to-r from-zinc-700/50 to-zinc-800/50 rounded-lg w-32 sm:w-40 mb-4 sm:mb-6" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="bg-zinc-800/50 rounded-lg p-3 sm:p-4 h-20 sm:h-24 animate-pulse" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6 sm:space-y-8">
                    {[1, 2].map(i => (
                        <div key={i} className="bg-zinc-900/60 rounded-xl p-4 sm:p-6 h-48 sm:h-64 animate-pulse" />
                    ))}
                </div>
            </div>

            {/* Related Movies Section */}
            <div className="mt-12 sm:mt-16 space-y-4 sm:space-y-6">
                <div className="h-8 sm:h-10 bg-gradient-to-r from-zinc-700/50 to-zinc-800/50 rounded-lg w-40 sm:w-48 animate-pulse" />
                <div className="space-y-3 sm:space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-zinc-900/60 rounded-xl p-3 sm:p-4 h-24 sm:h-28 animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    </motion.div>
);

const MovieDetails = () => {
    const { id } = useParams();
    const { data: movie, loading, error } = useMovieDetails(id);
    const [prevId, setPrevId] = useState(id);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Update useEffect to handle loading states better
    useEffect(() => {
        // Always set transitioning when ID changes
        if (id !== prevId) {
            setIsTransitioning(true);
            setPrevId(id);
            window.scrollTo({ top: 0, behavior: 'auto' }); // Change to instant scroll
        }

        // Only remove loading state when we have new data
        if (movie?.id === Number(id)) {
            setIsTransitioning(false);
        }
    }, [id, movie, prevId]);

    // Simplified loading check
    const isLoading = loading || isTransitioning || !movie || movie.id !== Number(id);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                staggerChildren: 0.2
            }
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    return (
        <AnimatePresence mode="wait" initial={false}>
            {isLoading ? (
                <MovieDetailsSkeleton key={`skeleton-${id}`} /> // Add key to force remount
            ) : error ? (
                <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="min-h-screen bg-gradient-to-b from-black to-zinc-900 flex items-center justify-center"
                >
                    <div className="text-white text-xl bg-red-500/20 px-8 py-6 rounded-xl backdrop-blur-sm border border-red-500/20">
                        <span className="text-red-400">Error:</span> {error || 'Movie not found'}
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    key={`movie-${id}`} // Add key to force remount
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="min-h-screen bg-gradient-to-b from-black to-zinc-900 overflow-x-hidden"
                >
                    {/* Hero Section */}
                    <div className="relative h-[60vh] sm:h-[70vh] w-full">
                        <motion.div
                            className="absolute inset-0 w-full h-full scale-105 transition-all duration-1000"
                            style={{
                                backgroundImage: `url(${movie.backdrop})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                filter: 'brightness(0.6)',
                            }}
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1.05, opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent" />
                        </motion.div>
                        <div className="relative container mx-auto px-4 sm:px-6 h-full flex flex-col sm:flex-row items-end pb-8 sm:pb-16">
                            <motion.div
                                className="flex flex-col sm:flex-row gap-6 sm:gap-8 w-full"
                                variants={itemVariants}
                            >
                                {/* Poster */}
                                <motion.div
                                    className="w-32 sm:w-44 md:w-64 lg:w-80 xl:w-96 shrink-0 mx-auto sm:mx-0"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300">
                                        <img
                                            src={movie.poster}
                                            alt={movie.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </motion.div>
                                {/* Info */}
                                <motion.div
                                    className="text-white w-full max-w-2xl mt-4 sm:mt-0 text-center sm:text-left"
                                    variants={itemVariants}
                                >
                                    <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight drop-shadow-lg">
                                        {movie.title}
                                    </h1>
                                    {/* Metadata */}
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-xs sm:text-sm lg:text-base mb-6 sm:mb-8">
                                        <motion.div
                                            className="flex items-center bg-black/40 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm border border-white/10"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <Star className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-500 mr-1 sm:mr-2" fill="currentColor" />
                                            <span className="font-semibold">{movie.rating}</span>
                                        </motion.div>
                                        <motion.div
                                            className="flex items-center bg-black/40 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm border border-white/10"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-blue-400 mr-1 sm:mr-2" />
                                            <span>{movie.duration}</span>
                                        </motion.div>
                                        <motion.div
                                            className="flex items-center bg-black/40 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm border border-white/10"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <Calendar className="w-4 sm:w-5 h-4 sm:h-5 text-green-400 mr-1 sm:mr-2" />
                                            <span>{movie.year}</span>
                                        </motion.div>
                                    </div>
                                    {/* Genres */}
                                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-6 sm:mb-8">
                                        {movie.genre.map((genre) => (
                                            <motion.span
                                                key={genre}
                                                className="px-3 sm:px-4 py-1 sm:py-1.5 bg-white/10 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm hover:bg-yellow-500/30 transition-all duration-300 cursor-pointer border border-white/10"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                {genre}
                                            </motion.span>
                                        ))}
                                    </div>
                                    {/* Description */}
                                    <p className="text-gray-300 text-sm sm:text-lg leading-relaxed mb-6 sm:mb-8 line-clamp-3 sm:line-clamp-4 transition-all duration-300">
                                        {movie.description}
                                    </p>
                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                        <motion.button
                                            className="group flex items-center justify-center gap-2 bg-yellow-500 text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-yellow-400 transition-all duration-300 shadow-lg text-sm sm:text-base w-full sm:w-auto"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Play className="w-4 sm:w-5 h-4 sm:h-5 group-hover:animate-pulse" fill="currentColor" />
                                            <span className="font-semibold">Watch Trailer</span>
                                        </motion.button>
                                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                                            <motion.button
                                                className="group flex items-center justify-center gap-2 bg-white/10 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/10 text-sm sm:text-base w-full sm:w-auto"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Heart className="w-4 sm:w-5 h-4 sm:h-5 group-hover:fill-red-500 group-hover:text-red-500 transition-all duration-300" />
                                                <span className="font-semibold hidden md:inline">Add to Watchlist</span>
                                                <span className="font-semibold md:hidden">Watchlist</span>
                                            </motion.button>
                                            <motion.button
                                                className="group flex items-center justify-center gap-2 bg-white/10 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/10 text-sm sm:text-base w-full sm:w-auto"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Share2 className="w-4 sm:w-5 h-4 sm:h-5 group-hover:-translate-y-1 transition-transform duration-300" />
                                                <span className="font-semibold">Share</span>
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>

                        </div>

                    </div>
                    {/* Details Section */}
                    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
                        <motion.div
                            className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 sm:gap-12"
                            variants={itemVariants}
                        >
                            {/* Cast & Crew */}
                            <div className="text-white">
                                <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
                                    <Award className="w-6 sm:w-8 h-6 sm:h-8 text-yellow-500" />
                                    Cast & Crew
                                </h2>
                                <div className="grid grid-cols-1 gap-6 sm:gap-8">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                                        {/* Director */}
                                        <motion.div
                                            className="bg-zinc-900/60 rounded-xl p-4 sm:p-6 backdrop-blur-sm shadow-lg border border-white/10"
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <h3 className="text-gray-400 text-base sm:text-lg mb-3 sm:mb-4">Director</h3>
                                            {movie.credits.crew
                                                .filter(person => person.job === 'Director')
                                                .map(director => (
                                                    <div key={director.id} className="flex items-start gap-3 sm:gap-4 min-h-[60px] sm:min-h-[64px]">
                                                        <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full overflow-hidden border-2 border-yellow-500/50 shrink-0">
                                                            <img
                                                                src={director.profile_path
                                                                    ? `https://image.tmdb.org/t/p/w185${director.profile_path}`
                                                                    : '/placeholder-avatar.jpg'
                                                                }
                                                                alt={director.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0 py-2 sm:py-1">
                                                            <span className="text-sm sm:text-base font-medium text-white block leading-5">
                                                                {director.name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                        </motion.div>
                                        {/* Cast */}
                                        <motion.div
                                            className="bg-zinc-900/60 rounded-xl p-4 sm:p-6 backdrop-blur-sm shadow-lg border border-white/10"
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <h3 className="text-gray-400 text-base sm:text-lg mb-3 sm:mb-4">Cast</h3>
                                            <div className="space-y-4 sm:space-y-4">
                                                {movie.credits.cast.slice(0, 5).map((actor) => (
                                                    <motion.div
                                                        key={actor.id}
                                                        className="flex items-start gap-3 sm:gap-4 group min-h-[60px] sm:min-h-[64px]"
                                                        whileHover={{ x: 5 }}
                                                    >
                                                        <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full overflow-hidden border-2 border-yellow-500/50 shrink-0">
                                                            <img
                                                                src={actor.profile_path
                                                                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                                                    : '/placeholder-avatar.jpg'
                                                                }
                                                                alt={actor.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0 py-2 sm:py-1">
                                                            <Link
                                                                to={`/actor/${actor.id}`}
                                                                className="block group-hover:text-yellow-500 transition-colors"
                                                            >
                                                                <div className="font-medium text-sm sm:text-base text-white truncate leading-5 mb-1">
                                                                    {actor.name}
                                                                </div>
                                                                <div className="text-xs sm:text-sm text-gray-400 truncate leading-4">
                                                                    {actor.character}
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Production Details - Now full width */}
                                    <motion.div
                                        className="bg-zinc-900/60 rounded-xl p-4 sm:p-6 backdrop-blur-sm shadow-lg border border-white/10 col-span-full"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                                            <Building2 className="w-5 sm:w-6 h-5 sm:h-6 text-blue-500" />
                                            Production
                                        </h3>

                                        <div className="space-y-4 sm:space-y-6">
                                            {/* Update grid columns for better space usage */}
                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
                                                {movie.overview.productionCompanies.map(company => (
                                                    <motion.div
                                                        key={company.id}
                                                        className="bg-zinc-800/50 rounded-lg p-3 sm:p-4 flex flex-col items-center text-center border border-white/5"
                                                        whileHover={{ scale: 1.05 }}
                                                    >
                                                        {company.logo ? (
                                                            <img
                                                                src={company.logo}
                                                                alt={company.name}
                                                                className="h-8 sm:h-12 object-contain mb-2"
                                                            />
                                                        ) : (
                                                            <Building className="w-8 sm:w-12 h-8 sm:h-12 text-gray-500 mb-2" />
                                                        )}
                                                        <span className="text-white text-xs sm:text-sm leading-tight">
                                                            {company.name}
                                                        </span>
                                                    </motion.div>
                                                ))}
                                            </div>

                                            {/* Keywords section */}
                                            {movie.overview.keywords.length > 0 && (
                                                <div>
                                                    <h4 className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3">Keywords</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {movie.overview.keywords.map(keyword => (
                                                            <motion.span
                                                                key={keyword}
                                                                className="px-2 sm:px-3 py-1 sm:py-1.5 bg-zinc-800/50 rounded-full text-white text-xs sm:text-sm border border-white/5"
                                                                whileHover={{ scale: 1.05 }}
                                                            >
                                                                {keyword}
                                                            </motion.span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6 sm:space-y-8">
                                {/* Movie Summary */}
                                <motion.div
                                    className="bg-zinc-900/60 rounded-xl p-4 sm:p-6 backdrop-blur-sm shadow-lg border border-white/10"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                                        <BookOpen className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-500" />
                                        Movie Summary
                                    </h3>

                                    {movie.overview.summary.tagline && (
                                        <div className="text-base sm:text-lg italic text-yellow-500 mb-4 sm:mb-6 font-medium">
                                            "{movie.overview.summary.tagline}"
                                        </div>
                                    )}

                                    <div className="space-y-4 sm:space-y-6">
                                        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                                            {movie.overview.summary.plot}
                                        </p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div className="bg-zinc-800/50 p-3 sm:p-4 rounded-lg border border-white/5">
                                                <div className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">Director</div>
                                                <div className="text-white font-medium text-sm sm:text-base">
                                                    {movie.overview.summary.director}
                                                </div>
                                            </div>
                                            {movie.overview.summary.writers.length > 0 && (
                                                <div className="bg-zinc-800/50 p-3 sm:p-4 rounded-lg border border-white/5">
                                                    <div className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">Writers</div>
                                                    <div className="text-white font-medium text-sm sm:text-base">
                                                        {movie.overview.summary.writers.join(', ')}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Technical Details */}
                                <motion.div
                                    className="bg-zinc-900/60 rounded-xl p-4 sm:p-6 backdrop-blur-sm shadow-lg border border-white/10"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                                        <Film className="w-5 sm:w-6 h-5 sm:h-6 text-cyan-500" />
                                        Movie Details
                                    </h3>

                                    <div className="grid gap-3 sm:gap-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div className="bg-zinc-800/50 p-3 sm:p-4 rounded-lg border border-white/5">
                                                <div className="text-gray-400 text-xs sm:text-sm">Runtime</div>
                                                <div className="text-white font-medium text-sm sm:text-base">
                                                    {movie.overview.runtime}
                                                </div>
                                            </div>
                                            <div className="bg-zinc-800/50 p-3 sm:p-4 rounded-lg border border-white/5">
                                                <div className="text-gray-400 text-xs sm:text-sm">Release Date</div>
                                                <div className="text-white font-medium text-sm sm:text-base">
                                                    {movie.overview.releaseDate}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2 sm:space-y-3">
                                            <div className="flex items-center justify-between p-3 sm:p-4 bg-zinc-800/50 rounded-lg border border-white/5">
                                                <span className="text-gray-400 text-sm sm:text-base">Budget</span>
                                                <span className="text-white font-medium text-sm sm:text-base">
                                                    {movie.overview.budget}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 sm:p-4 bg-zinc-800/50 rounded-lg border border-white/5">
                                                <span className="text-gray-400 text-sm sm:text-base">Revenue</span>
                                                <span className="text-white font-medium text-sm sm:text-base">
                                                    {movie.overview.revenue}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Related Movies */}
                        <motion.div
                            className="text-white mt-12 sm:mt-16"
                            variants={itemVariants}
                        >
                            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
                                <ThumbsUp className="w-6 sm:w-8 h-6 sm:h-8 text-yellow-500" />
                                Related Movies
                            </h2>
                            <div className="grid gap-3 sm:gap-4">
                                {movie.similar.map((relatedMovie) => (
                                    <motion.div
                                        key={relatedMovie.id}
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Link
                                            to={`/movie/${relatedMovie.id}`}
                                            className="group flex gap-3 sm:gap-6 p-3 sm:p-4 rounded-xl bg-zinc-900/60 backdrop-blur-sm hover:bg-zinc-800/70 transition-all duration-300 border border-white/10"
                                        >
                                            <div className="w-16 sm:w-20 h-20 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w185${relatedMovie.poster_path}`}
                                                    alt={relatedMovie.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col justify-center min-w-0 flex-1">
                                                <h3 className="font-medium text-sm sm:text-lg mb-1 sm:mb-2 group-hover:text-yellow-500 transition-colors line-clamp-2">
                                                    {relatedMovie.title}
                                                </h3>
                                                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400">
                                                    <div className="flex items-center">
                                                        <Star className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-500 mr-1" fill="currentColor" />
                                                        {relatedMovie.vote_average.toFixed(1)}
                                                    </div>
                                                    <span>•</span>
                                                    <span>{new Date(relatedMovie.release_date).getFullYear()}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MovieDetails;