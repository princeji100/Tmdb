import {
    Star, Clock, Calendar, Play, Share2,
    Award, Tv, Building2, BookOpen,
    Heart, ThumbsUp
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useShowDetails } from '../hooks/useShowDetails';
import { useEffect, useState } from 'react';

const ShowDetailsSkeleton = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-b from-black to-zinc-900 overflow-x-hidden"
    >
        <div className="relative h-[70vh] w-full">
            <div className="absolute inset-0 bg-gradient-radial from-zinc-800/50 to-black animate-pulse" />
            <div className="relative container mx-auto px-4 h-full flex items-end pb-16">
                <div className="flex flex-col sm:flex-row gap-8 w-full">
                    <div className="w-44 md:w-64 aspect-[2/3] bg-gradient-to-br from-zinc-700/50 to-zinc-800/50 rounded-xl shadow-2xl animate-pulse" />
                    <div className="space-y-8 flex-1">
                        <div className="h-12 bg-gradient-to-r from-zinc-700/50 to-zinc-800/50 rounded-lg w-3/4 animate-pulse" />
                        <div className="flex gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-10 bg-gradient-to-r from-zinc-700/50 to-zinc-800/50 rounded-full w-24 animate-pulse" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
);

const ShowDetails = () => {
    const { id } = useParams();
    const { data: show, loading, error } = useShowDetails(id);
    const [prevId, setPrevId] = useState(id);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        if (id !== prevId) {
            setIsTransitioning(true);
            setPrevId(id);
            window.scrollTo({ top: 0, behavior: 'auto' });
        }

        if (show?.id === Number(id)) {
            setIsTransitioning(false);
        }
    }, [id, show, prevId]);

    const isLoading = loading || isTransitioning || !show;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.5, staggerChildren: 0.2 }
        },
        exit: { opacity: 0 }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100, damping: 15 }
        }
    };

    return (
        <AnimatePresence mode="wait" initial={false}>
            {isLoading ? (
                <ShowDetailsSkeleton key={`skeleton-${id}`} />
            ) : error ? (
                <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="min-h-screen bg-gradient-to-b from-black to-zinc-900 flex items-center justify-center"
                >
                    <div className="text-white text-xl bg-red-500/20 px-8 py-6 rounded-xl backdrop-blur-sm border border-red-500/20">
                        <span className="text-red-400">Error:</span> {error || 'Show not found'}
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    key={`show-${id}`}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="min-h-screen bg-gradient-to-b from-black to-zinc-900 overflow-x-hidden"
                >
                    {/* Enhanced Hero Section */}
                    <div className="relative min-h-[60vh] sm:min-h-[50vh] md:min-h-[55vh] lg:min-h-[60vh] xl:min-h-[65vh] w-full">
                        <motion.div
                            className="absolute inset-0 w-full h-full scale-105 transition-all duration-1000"
                            style={{
                                backgroundImage: `url(${show.backdrop})`,
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

                        {/* Hero Content */}
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
                                            src={show.poster}
                                            alt={show.title}
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
                                        {show.title}
                                    </h1>

                                    {/* Metadata */}
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 text-xs sm:text-sm mb-3 sm:mb-4 md:mb-6">
                                        {show.rating && (
                                            <motion.div
                                                className="flex items-center bg-black/50 px-2 sm:px-2.5 md:px-3 lg:px-4 py-1 sm:py-1.5 rounded-full backdrop-blur-sm border border-white/20 hover:border-yellow-500/50 transition-all duration-300"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                <Star className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4 text-yellow-500 mr-1 sm:mr-1.5" fill="currentColor" />
                                                <span className="font-semibold text-xs sm:text-sm">{show.rating}</span>
                                            </motion.div>
                                        )}
                                        {show.overview?.totalSeasons && (
                                            <motion.div
                                                className="flex items-center bg-black/50 px-2 sm:px-2.5 md:px-3 lg:px-4 py-1 sm:py-1.5 rounded-full backdrop-blur-sm border border-white/20 hover:border-blue-500/50 transition-all duration-300"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                <Tv className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4 text-blue-400 mr-1 sm:mr-1.5" />
                                                <span className="text-xs sm:text-sm">{show.overview.totalSeasons} Seasons</span>
                                            </motion.div>
                                        )}
                                        {show.overview?.firstAirDate && (
                                            <motion.div
                                                className="flex items-center bg-black/50 px-2 sm:px-2.5 md:px-3 lg:px-4 py-1 sm:py-1.5 rounded-full backdrop-blur-sm border border-white/20 hover:border-green-500/50 transition-all duration-300"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                <Calendar className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4 text-green-400 mr-1 sm:mr-1.5" />
                                                <span className="text-xs sm:text-sm">{show.overview.firstAirDate}</span>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-5 md:mb-6 text-center sm:text-left line-clamp-3 sm:line-clamp-4 md:line-clamp-5">
                                        {show.description}
                                    </p>

                                    {/* Action buttons */}
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                                        <motion.button
                                            className="flex items-center justify-center gap-1.5 sm:gap-2 bg-yellow-500 text-black px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full hover:bg-yellow-400 transition-all duration-300 text-sm sm:text-base font-semibold"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Play className="w-4 sm:w-5 h-4 sm:h-5" fill="currentColor" />
                                            <span>Watch Trailer</span>
                                        </motion.button>
                                        <motion.button
                                            className="flex items-center justify-center gap-1.5 sm:gap-2 bg-white/10 text-white px-4 sm:px-6 py-2 sm:py-2.5 md:py-3 rounded-full hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/10 text-sm sm:text-base font-semibold"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Heart className="w-4 sm:w-5 h-4 sm:h-5" />
                                            <span className="hidden sm:inline">Add to Watchlist</span>
                                            <span className="sm:hidden">Watchlist</span>
                                        </motion.button>
                                        <motion.button
                                            className="flex items-center justify-center gap-1.5 sm:gap-2 bg-white/10 text-white px-4 sm:px-6 py-2 sm:py-2.5 md:py-3 rounded-full hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/10 text-sm sm:text-base font-semibold"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Share2 className="w-4 sm:w-5 h-4 sm:h-5" />
                                            <span>Share</span>
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12 lg:py-16">
                        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] xl:grid-cols-[1fr_350px] gap-6 sm:gap-8 md:gap-10 lg:gap-12">
                            {/* Left Column */}
                            <div className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12 order-2 lg:order-1">
                                {/* Cast & Crew Section */}
                                <section className="text-left">
                                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-5 md:mb-6 lg:mb-8 flex items-center gap-2 sm:gap-3">
                                        <Award className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7 text-yellow-500" />
                                        Cast & Crew
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                                        {/* Main Cast */}
                                        <motion.div
                                            className="bg-zinc-900/60 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 backdrop-blur-sm shadow-lg border border-white/10"
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <h3 className="text-gray-400 text-base sm:text-lg mb-3 sm:mb-4">Main Cast</h3>
                                            <div className="space-y-3 sm:space-y-4">
                                                {show.credits?.cast?.slice(0, 5).map((actor) => (
                                                    <motion.div
                                                        key={actor.id}
                                                        className="flex items-center gap-3 sm:gap-4 group"
                                                        whileHover={{ x: 5 }}
                                                    >
                                                        <div className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 rounded-full overflow-hidden border-2 border-yellow-500/50 shrink-0">
                                                            <img
                                                                src={actor.profile_path
                                                                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                                                    : '/placeholder-avatar.jpg'
                                                                }
                                                                alt={actor.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <Link
                                                            to={`/actor/${actor.id}`}
                                                            className="text-sm sm:text-base md:text-lg text-[#c8c8c9] group-hover:text-yellow-500 transition-colors min-w-0 flex-1"
                                                        >
                                                            <div className="font-medium truncate">{actor.name}</div>
                                                            <div className="text-xs sm:text-sm text-gray-400 truncate">{actor.character}</div>
                                                        </Link>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>

                                        {/* Creators - Only show when data exists */}
                                        {show.overview?.creators?.length > 0 && (
                                            <motion.div
                                                className="bg-zinc-900/60 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 backdrop-blur-sm shadow-lg border border-white/10"
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                <h3 className="text-gray-400 text-base sm:text-lg mb-3 sm:mb-4">Created By</h3>
                                                <div className="space-y-3 sm:space-y-4">
                                                    {show.overview.creators.map((creator) => (
                                                        <div key={creator.id} className="flex items-center gap-3 sm:gap-4">
                                                            <div className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 rounded-full overflow-hidden border-2 border-yellow-500/50 shrink-0">
                                                                <img
                                                                    src={creator.profile_path
                                                                        ? `https://image.tmdb.org/t/p/w185${creator.profile_path}`
                                                                        : '/placeholder-avatar.jpg'
                                                                    }
                                                                    alt={creator.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <span className="text-sm sm:text-base md:text-lg text-white font-medium truncate">{creator.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </section>

                                {/* Seasons Overview */}
                                <section className="text-left">
                                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-5 md:mb-6 lg:mb-8 flex items-center gap-2 sm:gap-3">
                                        <Tv className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7 text-blue-500" />
                                        Seasons Overview
                                    </h2>
                                    <motion.div
                                        className="bg-zinc-900/60 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 backdrop-blur-sm shadow-lg border border-white/10"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div className="space-y-3 sm:space-y-4">
                                            {show.overview?.seasons?.map((season) => (
                                                <motion.div
                                                    key={season.id}
                                                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 bg-zinc-800/50 rounded-lg border border-white/5"
                                                >
                                                    {season.poster_path && (
                                                        <div className="w-20 sm:w-24 h-30 sm:h-36 rounded-lg overflow-hidden shadow-lg shrink-0 mx-auto sm:mx-0">
                                                            <img
                                                                src={`https://image.tmdb.org/t/p/w185${season.poster_path}`}
                                                                alt={`${season.name} Poster`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 text-center sm:text-left">
                                                        <h4 className="text-base sm:text-lg font-medium text-white mb-1 sm:mb-2">
                                                            {season.name}
                                                        </h4>
                                                        <div className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
                                                            {season.episode_count} Episodes • {season.air_date}
                                                        </div>
                                                        <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">
                                                            {season.overview || 'No overview available.'}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </section>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 order-1 lg:order-2">
                                {/* Show Stats */}
                                <motion.div
                                    className="bg-zinc-900/60 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 backdrop-blur-sm shadow-lg border border-white/10"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-5 md:mb-6 flex items-center gap-2">
                                        <Award className="w-5 sm:w-6 h-5 sm:h-6 text-yellow-500" />
                                        Show Stats
                                    </h3>
                                    <div className="grid gap-3 sm:gap-4">
                                        <div className="flex justify-between items-center p-3 sm:p-4 bg-zinc-800/50 rounded-lg border border-white/5">
                                            <span className="text-gray-400 text-sm sm:text-base">Rating</span>
                                            <span className="text-white font-medium text-sm sm:text-base">{show.rating}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 sm:p-4 bg-zinc-800/50 rounded-lg border border-white/5">
                                            <span className="text-gray-400 text-sm sm:text-base">Seasons</span>
                                            <span className="text-white font-medium text-sm sm:text-base">{show.overview?.totalSeasons}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 sm:p-4 bg-zinc-800/50 rounded-lg border border-white/5">
                                            <span className="text-gray-400 text-sm sm:text-base">First Air Date</span>
                                            <span className="text-white font-medium text-sm sm:text-base">{show.overview?.firstAirDate}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Similar Shows Section */}
                    {show.similar?.length > 0 && (
                        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12 lg:py-16">
                            <motion.div variants={itemVariants}>
                                <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6 lg:mb-8">
                                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
                                        <ThumbsUp className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7 text-yellow-500" />
                                        Similar Shows
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                                    {show.similar.map((similarShow) => (
                                        <motion.div
                                            key={similarShow.id}
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Link
                                                to={`/show/${similarShow.id}`}
                                                className="group flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-zinc-900/60 backdrop-blur-sm hover:bg-zinc-800/70 transition-all duration-300 border border-white/10 h-full"
                                            >
                                                <div className="w-20 sm:w-24 h-30 sm:h-36 flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w185${similarShow.poster_path}`}
                                                        alt={similarShow.name}
                                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-sm sm:text-base md:text-lg mb-1 sm:mb-2 text-white group-hover:text-yellow-500 transition-colors line-clamp-2">
                                                        {similarShow.name}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
                                                        <div className="flex items-center">
                                                            <Star className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-500 mr-1" fill="currentColor" />
                                                            <span>{similarShow.vote_average?.toFixed(1)}</span>
                                                        </div>
                                                        <span>•</span>
                                                        <span>{new Date(similarShow.first_air_date).getFullYear()}</span>
                                                    </div>
                                                    <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">
                                                        {similarShow.overview}
                                                    </p>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ShowDetails;