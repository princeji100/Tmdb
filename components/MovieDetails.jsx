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
    ThumbsUp,
    AlertCircle,
    RefreshCw,
    Home
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
        <div className="relative min-h-[60vh] sm:min-h-[50vh] md:min-h-[55vh] lg:min-h-[60vh] w-full">
            <div className="absolute inset-0 bg-gradient-radial from-zinc-800/50 to-black animate-pulse" />
            <div className="relative container mx-auto px-4 sm:px-6 md:px-8 h-full flex flex-col justify-end py-4 sm:py-6 md:py-8 pb-6 sm:pb-8 md:pb-12">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 w-full">
                    <div className="w-24 xs:w-28 sm:w-36 md:w-48 lg:w-56 xl:w-64 mx-auto sm:mx-0 aspect-[2/3] bg-gradient-to-br from-zinc-700/50 to-zinc-800/50 rounded-lg sm:rounded-xl shadow-2xl animate-pulse" />
                    <div className="space-y-3 sm:space-y-4 md:space-y-6 flex-1 text-center sm:text-left">
                        <div className="h-6 sm:h-8 md:h-10 lg:h-12 bg-gradient-to-r from-zinc-700/50 to-zinc-800/50 rounded-lg w-4/5 mx-auto sm:mx-0 animate-pulse" />
                        <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 sm:gap-2 md:gap-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-6 sm:h-7 md:h-8 bg-gradient-to-r from-zinc-700/50 to-zinc-800/50 rounded-full w-16 sm:w-20 md:w-24 animate-pulse" />
                            ))}
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-2.5 sm:h-3 md:h-3.5 bg-gradient-to-r from-zinc-700/50 to-zinc-800/50 rounded w-full animate-pulse"
                                    style={{ width: `${100 - (i * 10)}%` }} />
                            ))}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
                            <div className="h-8 sm:h-9 md:h-10 bg-yellow-500/20 rounded-full w-full sm:w-32 md:w-40 animate-pulse" />
                            <div className="h-8 sm:h-9 md:h-10 bg-zinc-700/50 rounded-full w-full sm:w-32 md:w-40 animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Details Section */}
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] xl:grid-cols-[1fr_350px] gap-6 sm:gap-8 md:gap-10 lg:gap-12">
                {/* Left Column */}
                <div className="space-y-4 sm:space-y-6 md:space-y-8">
                    <div className="h-6 sm:h-7 md:h-8 lg:h-10 bg-gradient-to-r from-zinc-700/50 to-zinc-800/50 rounded-lg w-36 sm:w-40 md:w-48 animate-pulse" />
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8">
                        {[1, 2].map(i => (
                            <div key={i} className="bg-zinc-900/60 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 h-32 sm:h-40 md:h-48 lg:h-56 animate-pulse" />
                        ))}
                    </div>
                    {/* Production Section */}
                    <div className="bg-zinc-900/60 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 animate-pulse">
                        <div className="h-5 sm:h-6 md:h-7 lg:h-8 bg-gradient-to-r from-zinc-700/50 to-zinc-800/50 rounded-lg w-24 sm:w-28 md:w-32 lg:w-40 mb-3 sm:mb-4 md:mb-6" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="bg-zinc-800/50 rounded-lg p-2 sm:p-3 md:p-4 h-16 sm:h-18 md:h-20 lg:h-24 animate-pulse" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4 sm:space-y-6 md:space-y-8">
                    {[1, 2].map(i => (
                        <div key={i} className="bg-zinc-900/60 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 h-32 sm:h-40 md:h-48 lg:h-56 animate-pulse" />
                    ))}
                </div>
            </div>

            {/* Related Movies Section */}
            <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-16 space-y-3 sm:space-y-4 md:space-y-6">
                <div className="h-6 sm:h-7 md:h-8 lg:h-10 bg-gradient-to-r from-zinc-700/50 to-zinc-800/50 rounded-lg w-32 sm:w-36 md:w-40 lg:w-48 animate-pulse" />
                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-zinc-900/60 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 h-20 sm:h-22 md:h-24 lg:h-28 animate-pulse" />
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="min-h-screen bg-gradient-to-b from-black to-zinc-900 flex items-center justify-center p-4"
                >
                    <div className="text-center max-w-md mx-auto">
                        <div className="inline-block p-4 bg-red-500/10 rounded-full mb-6">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">Movie Not Found</h2>
                        <p className="text-gray-400 mb-8">
                            {error || 'The movie you\'re looking for doesn\'t exist or has been removed.'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={() => window.history.back()}
                                className="px-6 py-3 bg-yellow-500 text-black rounded-full 
                                    hover:bg-yellow-400 transition-all duration-300
                                    flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Go Back
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="px-6 py-3 bg-zinc-700 text-white rounded-full 
                                    hover:bg-zinc-600 transition-all duration-300
                                    flex items-center justify-center gap-2"
                            >
                                <Home className="w-4 h-4" />
                                Go Home
                            </button>
                        </div>
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
                    <div className="relative min-h-[60vh] sm:min-h-[50vh] md:min-h-[55vh] lg:min-h-[60vh] xl:min-h-[65vh] w-full">
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
                            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
                        </motion.div>
                        <div className="relative container mx-auto px-4 sm:px-6 md:px-8 h-full flex flex-col justify-end py-4 sm:py-6 md:py-8 lg:py-10 pb-6 sm:pb-8 md:pb-10 lg:pb-14">
                            <motion.div
                                className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-full max-w-7xl mx-auto"
                                variants={itemVariants}
                            >
                                {/* Poster */}
                                <motion.div
                                    className="w-24 xs:w-28 sm:w-36 md:w-48 lg:w-56 xl:w-64 shrink-0 mx-auto sm:mx-0"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="aspect-[2/3] rounded-lg sm:rounded-xl overflow-hidden shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300 ring-2 ring-white/10 hover:ring-yellow-500/50">
                                        <img
                                            src={movie.poster}
                                            alt={movie.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </motion.div>
                                {/* Info */}
                                <motion.div
                                    className="text-white w-full max-w-3xl mt-2 sm:mt-0 text-center sm:text-left flex-1 min-w-0"
                                    variants={itemVariants}
                                >
                                    <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 lg:mb-6 leading-tight drop-shadow-lg">
                                        {movie.title}
                                    </h1>
                                    {/* Metadata */}
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 text-xs sm:text-sm mb-3 sm:mb-4 md:mb-6">
                                        <motion.div
                                            className="flex items-center bg-black/50 px-2 sm:px-2.5 md:px-3 lg:px-4 py-1 sm:py-1.5 rounded-full backdrop-blur-sm border border-white/20 hover:border-yellow-500/50 transition-all duration-300"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <Star className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4 text-yellow-500 mr-1 sm:mr-1.5" fill="currentColor" />
                                            <span className="font-semibold text-xs sm:text-sm">{movie.rating}</span>
                                        </motion.div>
                                        <motion.div
                                            className="flex items-center bg-black/50 px-2 sm:px-2.5 md:px-3 lg:px-4 py-1 sm:py-1.5 rounded-full backdrop-blur-sm border border-white/20 hover:border-blue-500/50 transition-all duration-300"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <Clock className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4 text-blue-400 mr-1 sm:mr-1.5" />
                                            <span className="text-xs sm:text-sm">{movie.duration}</span>
                                        </motion.div>
                                        <motion.div
                                            className="flex items-center bg-black/50 px-2 sm:px-2.5 md:px-3 lg:px-4 py-1 sm:py-1.5 rounded-full backdrop-blur-sm border border-white/20 hover:border-green-500/50 transition-all duration-300"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <Calendar className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4 text-green-400 mr-1 sm:mr-1.5" />
                                            <span className="text-xs sm:text-sm">{movie.year}</span>
                                        </motion.div>
                                    </div>
                                    {/* Genres */}
                                    <div className="flex flex-wrap justify-center sm:justify-start gap-1 sm:gap-1.5 md:gap-2 mb-3 sm:mb-4 md:mb-6">
                                        {movie.genre.map((genre) => (
                                            <motion.span
                                                key={genre}
                                                className="px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 bg-white/10 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm hover:bg-yellow-500/30 transition-all duration-300 cursor-pointer border border-white/10 hover:border-yellow-500/50"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                {genre}
                                            </motion.span>
                                        ))}
                                    </div>
                                    {/* Description */}
                                    <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed mb-3 sm:mb-4 md:mb-6 line-clamp-2 sm:line-clamp-3 md:line-clamp-4 transition-all duration-300">
                                        {movie.description}
                                    </p>
                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 sm:gap-2.5 md:gap-3">
                                        <motion.button
                                            className="group flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-4 sm:px-5 md:px-6 lg:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-full hover:from-yellow-400 hover:to-yellow-300 transition-all duration-300 shadow-lg hover:shadow-yellow-500/25 text-xs sm:text-sm md:text-base font-semibold w-full"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Play className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5 group-hover:animate-pulse" fill="currentColor" />
                                            <span>Watch Trailer</span>
                                        </motion.button>
                                        <div className="flex gap-1.5 sm:gap-2 md:gap-3 w-full">
                                            <motion.button
                                                className="group flex items-center justify-center gap-1 sm:gap-1.5 bg-white/10 text-white px-2.5 sm:px-3 md:px-4 py-2.5 sm:py-3 md:py-3.5 rounded-full hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-red-500/50 text-xs sm:text-sm font-medium flex-1"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Heart className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5 group-hover:fill-red-500 group-hover:text-red-500 transition-all duration-300" />
                                                <span className="hidden xs:inline sm:hidden md:inline">Watchlist</span>
                                                <span className="xs:hidden sm:inline md:hidden">♡</span>
                                            </motion.button>
                                            <motion.button
                                                className="group flex items-center justify-center gap-1 sm:gap-1.5 bg-white/10 text-white px-2.5 sm:px-3 md:px-4 py-2.5 sm:py-3 md:py-3.5 rounded-full hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-blue-500/50 text-xs sm:text-sm font-medium flex-1"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Share2 className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                                                <span>Share</span>
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>

                        </div>

                    </div>
                    {/* Details Section */}
                    <div className="container mx-auto px-3 sm:px-4 lg:px-6 pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-8 sm:pb-12 lg:pb-16">
                        <motion.div
                            className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] xl:grid-cols-[1fr_380px] gap-6 sm:gap-8 lg:gap-10 xl:gap-12"
                            variants={itemVariants}
                        >
                            {/* Cast & Crew */}
                            <div className="text-white">
                                <motion.h2
                                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 md:mb-6 lg:mb-8 flex items-center gap-2 sm:gap-3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="p-1.5 sm:p-2 md:p-2.5 bg-yellow-500/20 rounded-lg">
                                        <Award className="w-4 sm:w-5 md:w-6 lg:w-7 h-4 sm:h-5 md:h-6 lg:h-7 text-yellow-500" />
                                    </div>
                                    Cast & Crew
                                </motion.h2>
                                <div className="space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                                        {/* Director */}
                                        <motion.div
                                            className="group bg-gradient-to-br from-zinc-900/80 to-zinc-900/60 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 backdrop-blur-sm shadow-xl border border-white/10 hover:border-yellow-500/30 transition-all duration-300"
                                            whileHover={{ scale: 1.01, y: -1 }}
                                            transition={{ duration: 0.2 }}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                        >
                                            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 md:mb-4">
                                                <div className="p-1 sm:p-1.5 bg-blue-500/20 rounded-lg">
                                                    <Film className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5 text-blue-400" />
                                                </div>
                                                <h3 className="text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg font-semibold">Director</h3>
                                            </div>
                                            {movie.credits.crew
                                                .filter(person => person.job === 'Director')
                                                .map(director => (
                                                    <div key={director.id} className="flex items-center gap-2 sm:gap-3 md:gap-4 p-1.5 sm:p-2 md:p-3 rounded-lg sm:rounded-xl bg-white/5 group-hover:bg-white/10 transition-all duration-300">
                                                        <div className="relative">
                                                            <div className="w-10 sm:w-12 md:w-14 lg:w-16 h-10 sm:h-12 md:h-14 lg:h-16 rounded-full overflow-hidden border-2 border-yellow-500/50 group-hover:border-yellow-500/80 transition-all duration-300 shadow-lg">
                                                                <img
                                                                    src={director.profile_path
                                                                        ? `https://image.tmdb.org/t/p/w185${director.profile_path}`
                                                                        : '/placeholder-avatar.jpg'
                                                                    }
                                                                    alt={director.name}
                                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                                />
                                                            </div>
                                                            <div className="absolute -bottom-0.5 -right-0.5 w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                                                                <Award className="w-1.5 sm:w-2 md:w-2.5 h-1.5 sm:h-2 md:h-2.5 text-black" />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <span className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white block leading-tight group-hover:text-yellow-400 transition-colors duration-300">
                                                                {director.name}
                                                            </span>
                                                            <span className="text-xs text-gray-400 block mt-0.5">
                                                                Director
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                        </motion.div>
                                        {/* Cast */}
                                        <motion.div
                                            className="group bg-gradient-to-br from-zinc-900/80 to-zinc-900/60 rounded-2xl p-4 sm:p-5 lg:p-6 backdrop-blur-sm shadow-xl border border-white/10 hover:border-yellow-500/30 transition-all duration-300"
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            transition={{ duration: 0.2 }}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                        >
                                            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                                <div className="p-1.5 bg-purple-500/20 rounded-lg">
                                                    <Building className="w-4 sm:w-5 h-4 sm:h-5 text-purple-400" />
                                                </div>
                                                <h3 className="text-gray-300 text-sm sm:text-base lg:text-lg font-semibold">Main Cast</h3>
                                            </div>
                                            <div className="space-y-2 sm:space-y-3">
                                                {movie.credits.cast.slice(0, 4).map((actor, index) => (
                                                    <motion.div
                                                        key={actor.id}
                                                        className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group/item"
                                                        whileHover={{ x: 5, scale: 1.02 }}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                    >
                                                        <div className="relative">
                                                            <div className="w-10 sm:w-12 lg:w-14 h-10 sm:h-12 lg:h-14 rounded-full overflow-hidden border-2 border-yellow-500/50 group-hover/item:border-yellow-500/80 transition-all duration-300 shadow-lg">
                                                                <img
                                                                    src={actor.profile_path
                                                                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                                                        : '/placeholder-avatar.jpg'
                                                                    }
                                                                    alt={actor.name}
                                                                    className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                                                                />
                                                            </div>
                                                            <div className="absolute -bottom-0.5 -right-0.5 w-3 sm:w-4 h-3 sm:h-4 bg-green-500 rounded-full border-2 border-zinc-900"></div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <Link
                                                                to={`/actor/${actor.id}`}
                                                                className="block group-hover/item:text-yellow-400 transition-colors duration-300"
                                                            >
                                                                <div className="font-semibold text-xs sm:text-sm lg:text-base text-white truncate leading-tight">
                                                                    {actor.name}
                                                                </div>
                                                                <div className="text-xs sm:text-sm text-gray-400 truncate leading-tight mt-0.5">
                                                                    {actor.character}
                                                                </div>
                                                            </Link>
                                                        </div>
                                                        <div className="opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                                                            <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                                                <span className="text-xs font-bold text-yellow-400">→</span>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                                {movie.credits.cast.length > 4 && (
                                                    <motion.div
                                                        className="text-center pt-2"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 0.5 }}
                                                    >
                                                        <span className="text-xs sm:text-sm text-gray-400 bg-white/5 px-3 py-1.5 rounded-full">
                                                            +{movie.credits.cast.length - 4} more cast members
                                                        </span>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Production Details - Now full width */}
                                    <motion.div
                                        className="group bg-gradient-to-br from-zinc-900/80 to-zinc-900/60 rounded-2xl p-4 sm:p-5 lg:p-6 backdrop-blur-sm shadow-xl border border-white/10 hover:border-yellow-500/30 transition-all duration-300 col-span-full"
                                        whileHover={{ scale: 1.01, y: -2 }}
                                        transition={{ duration: 0.2 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="flex items-center gap-2 mb-4 sm:mb-6">
                                            <div className="p-2 bg-cyan-500/20 rounded-lg">
                                                <Building2 className="w-5 sm:w-6 lg:w-7 h-5 sm:h-6 lg:h-7 text-cyan-400" />
                                            </div>
                                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                                                Production Companies
                                            </h3>
                                        </div>

                                        <div className="space-y-4 sm:space-y-6">
                                            {/* Production Companies Grid */}
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                                                {movie.overview.productionCompanies.map((company, index) => (
                                                    <motion.div
                                                        key={company.id}
                                                        className="group/company bg-gradient-to-br from-zinc-800/60 to-zinc-800/40 rounded-xl p-3 sm:p-4 flex flex-col items-center text-center border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
                                                        whileHover={{ scale: 1.05, y: -2 }}
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: index * 0.1 }}
                                                    >
                                                        <div className="w-full h-12 sm:h-16 flex items-center justify-center mb-2 sm:mb-3">
                                                            {company.logo ? (
                                                                <img
                                                                    src={company.logo}
                                                                    alt={company.name}
                                                                    className="max-h-full max-w-full object-contain group-hover/company:scale-110 transition-transform duration-300"
                                                                />
                                                            ) : (
                                                                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                                                                    <Building className="w-4 sm:w-5 h-4 sm:h-5 text-gray-300" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="text-white text-xs sm:text-sm font-medium leading-tight group-hover/company:text-cyan-300 transition-colors duration-300 line-clamp-2">
                                                            {company.name}
                                                        </span>
                                                    </motion.div>
                                                ))}
                                            </div>

                                            {/* Keywords section */}
                                            {movie.overview.keywords.length > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.3 }}
                                                >
                                                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                                        <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                                                            <BookOpen className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-400" />
                                                        </div>
                                                        <h4 className="text-gray-300 text-sm sm:text-base font-semibold">Keywords</h4>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {movie.overview.keywords.map((keyword, index) => (
                                                            <motion.span
                                                                key={keyword}
                                                                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-zinc-800/60 to-zinc-800/40 rounded-full text-white text-xs sm:text-sm font-medium border border-white/10 hover:border-emerald-400/50 hover:bg-emerald-500/10 transition-all duration-300 cursor-pointer"
                                                                whileHover={{ scale: 1.05 }}
                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: 0.4 + (index * 0.05) }}
                                                            >
                                                                {keyword}
                                                            </motion.span>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                                {/* Movie Summary */}
                                <motion.div
                                    className="group bg-gradient-to-br from-zinc-900/80 to-zinc-900/60 rounded-2xl p-4 sm:p-5 lg:p-6 backdrop-blur-sm shadow-xl border border-white/10 hover:border-emerald-500/30 transition-all duration-300"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    transition={{ duration: 0.2 }}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                >
                                    <div className="flex items-center gap-2 mb-4 sm:mb-6">
                                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                                            <BookOpen className="w-5 sm:w-6 lg:w-7 h-5 sm:h-6 lg:h-7 text-emerald-400" />
                                        </div>
                                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                                            Movie Summary
                                        </h3>
                                    </div>

                                    {movie.overview.summary.tagline && (
                                        <motion.div
                                            className="relative p-4 sm:p-5 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20 mb-4 sm:mb-6"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <div className="absolute top-2 left-2 text-yellow-500/60">
                                                <span className="text-2xl">"</span>
                                            </div>
                                            <div className="text-sm sm:text-base lg:text-lg italic text-yellow-400 font-medium text-center pt-2">
                                                {movie.overview.summary.tagline}
                                            </div>
                                            <div className="absolute bottom-2 right-2 text-yellow-500/60 rotate-180">
                                                <span className="text-2xl">"</span>
                                            </div>
                                        </motion.div>
                                    )}

                                    <div className="space-y-4 sm:space-y-6">
                                        <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10">
                                            <p className="text-gray-300 leading-relaxed text-sm sm:text-base lg:text-lg">
                                                {movie.overview.summary.plot}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                            <motion.div
                                                className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-3 sm:p-4 rounded-xl border border-blue-500/20"
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Award className="w-4 sm:w-5 h-4 sm:h-5 text-blue-400" />
                                                    <div className="text-blue-300 text-xs sm:text-sm font-semibold">Director</div>
                                                </div>
                                                <div className="text-white font-medium text-sm sm:text-base lg:text-lg">
                                                    {movie.overview.summary.director}
                                                </div>
                                            </motion.div>
                                            {movie.overview.summary.writers.length > 0 && (
                                                <motion.div
                                                    className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-3 sm:p-4 rounded-xl border border-purple-500/20"
                                                    whileHover={{ scale: 1.02 }}
                                                >
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <BookOpen className="w-4 sm:w-5 h-4 sm:h-5 text-purple-400" />
                                                        <div className="text-purple-300 text-xs sm:text-sm font-semibold">Writers</div>
                                                    </div>
                                                    <div className="text-white font-medium text-sm sm:text-base lg:text-lg">
                                                        {movie.overview.summary.writers.join(', ')}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Technical Details */}
                                <motion.div
                                    className="group bg-gradient-to-br from-zinc-900/80 to-zinc-900/60 rounded-2xl p-4 sm:p-5 lg:p-6 backdrop-blur-sm shadow-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    transition={{ duration: 0.2 }}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                >
                                    <div className="flex items-center gap-2 mb-4 sm:mb-6">
                                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                                            <Film className="w-5 sm:w-6 lg:w-7 h-5 sm:h-6 lg:h-7 text-cyan-400" />
                                        </div>
                                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                                            Technical Details
                                        </h3>
                                    </div>

                                    <div className="space-y-3 sm:space-y-4">
                                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                            <motion.div
                                                className="bg-gradient-to-br from-orange-500/10 to-red-500/10 p-3 sm:p-4 rounded-xl border border-orange-500/20 text-center"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                <Clock className="w-5 sm:w-6 h-5 sm:h-6 text-orange-400 mx-auto mb-2" />
                                                <div className="text-orange-300 text-xs sm:text-sm font-semibold mb-1">Runtime</div>
                                                <div className="text-white font-bold text-sm sm:text-base lg:text-lg">
                                                    {movie.overview.runtime}
                                                </div>
                                            </motion.div>
                                            <motion.div
                                                className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-3 sm:p-4 rounded-xl border border-green-500/20 text-center"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                <Calendar className="w-5 sm:w-6 h-5 sm:h-6 text-green-400 mx-auto mb-2" />
                                                <div className="text-green-300 text-xs sm:text-sm font-semibold mb-1">Release</div>
                                                <div className="text-white font-bold text-sm sm:text-base lg:text-lg">
                                                    {movie.overview.releaseDate}
                                                </div>
                                            </motion.div>
                                        </div>

                                        <div className="space-y-2 sm:space-y-3">
                                            <motion.div
                                                className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20"
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                                    <span className="text-yellow-300 text-sm sm:text-base font-semibold">Budget</span>
                                                </div>
                                                <span className="text-white font-bold text-sm sm:text-base lg:text-lg">
                                                    {movie.overview.budget}
                                                </span>
                                            </motion.div>
                                            <motion.div
                                                className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20"
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                    <span className="text-green-300 text-sm sm:text-base font-semibold">Revenue</span>
                                                </div>
                                                <span className="text-white font-bold text-sm sm:text-base lg:text-lg">
                                                    {movie.overview.revenue}
                                                </span>
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Related Movies */}
                        <motion.div
                            className="text-white mt-8 sm:mt-12 lg:mt-16"
                            variants={itemVariants}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileInView={{ opacity: 1, y: 0 }}
                        >
                            <motion.div
                                className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="p-2 sm:p-2.5 bg-yellow-500/20 rounded-lg">
                                    <ThumbsUp className="w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8 text-yellow-500" />
                                </div>
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                                    You Might Also Like
                                </h2>
                            </motion.div>
                            <div className="grid gap-3 sm:gap-4 lg:gap-6">
                                {movie.similar.map((relatedMovie, index) => (
                                    <motion.div
                                        key={relatedMovie.id}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link
                                            to={`/movie/${relatedMovie.id}`}
                                            className="group flex gap-3 sm:gap-4 lg:gap-6 p-3 sm:p-4 lg:p-5 rounded-2xl bg-gradient-to-r from-zinc-900/80 to-zinc-900/60 backdrop-blur-sm hover:from-zinc-800/80 hover:to-zinc-800/60 transition-all duration-300 border border-white/10 hover:border-yellow-500/30 shadow-lg hover:shadow-xl hover:shadow-yellow-500/10"
                                        >
                                            <div className="relative">
                                                <div className="w-16 sm:w-20 lg:w-24 h-20 sm:h-28 lg:h-32 flex-shrink-0 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w185${relatedMovie.poster_path}`}
                                                        alt={relatedMovie.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                </div>
                                                <div className="absolute -top-1 -right-1 w-6 sm:w-7 h-6 sm:h-7 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                                                    <Play className="w-3 sm:w-4 h-3 sm:h-4 text-black" fill="currentColor" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-center min-w-0 flex-1">
                                                <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 group-hover:text-yellow-400 transition-colors line-clamp-2 leading-tight">
                                                    {relatedMovie.title}
                                                </h3>
                                                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400 mb-2">
                                                    <div className="flex items-center bg-yellow-500/20 px-2 py-1 rounded-full">
                                                        <Star className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-500 mr-1" fill="currentColor" />
                                                        <span className="font-semibold text-yellow-400">{relatedMovie.vote_average.toFixed(1)}</span>
                                                    </div>
                                                    <div className="flex items-center bg-blue-500/20 px-2 py-1 rounded-full">
                                                        <Calendar className="w-3 sm:w-4 h-3 sm:h-4 text-blue-400 mr-1" />
                                                        <span className="font-semibold text-blue-300">{new Date(relatedMovie.release_date).getFullYear()}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs sm:text-sm text-gray-500 font-medium">Click to explore</span>
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <div className="w-6 sm:w-8 h-6 sm:h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                                            <span className="text-yellow-400 font-bold text-sm sm:text-base">→</span>
                                                        </div>
                                                    </div>
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