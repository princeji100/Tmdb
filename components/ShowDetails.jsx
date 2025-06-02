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
                    <div className="relative h-[70vh] sm:h-[80vh] w-full">
                        <motion.div
                            className="absolute inset-0 w-full h-full"
                            style={{
                                backgroundImage: `url(${show.backdrop})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1.05, opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            {/* Improved backdrop gradients */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
                        </motion.div>

                        {/* Hero Content */}
                        <div className="relative container mx-auto px-4 h-full flex items-end pb-16">
                            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-8 w-full">
                                {/* Poster with enhanced hover effects */}
                                <motion.div
                                    className="w-44 md:w-64 shrink-0 mx-auto sm:mx-0"
                                    whileHover={{ scale: 1.05, y: -5 }}
                                >
                                    <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] transition-all duration-300">
                                        <img
                                            src={show.poster}
                                            alt={show.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </motion.div>

                                {/* Show Info with better typography */}
                                <div className="text-white w-full max-w-3xl space-y-6">
                                    <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl font-bold leading-tight tracking-tight drop-shadow-lg">
                                        {show.title}
                                    </motion.h1>

                                    {/* Enhanced metadata badges */}
                                    <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
                                        {show.rating && (
                                            <div className="flex items-center gap-2 bg-yellow-500/10 backdrop-blur-md px-4 py-2 rounded-full border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors">
                                                <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
                                                <span className="font-medium">{show.rating}</span>
                                            </div>
                                        )}
                                        {show.overview?.totalSeasons && (
                                            <div className="flex items-center gap-2 bg-blue-500/10 backdrop-blur-md px-4 py-2 rounded-full border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
                                                <Tv className="w-5 h-5 text-blue-500" />
                                                <span className="font-medium">{show.overview.totalSeasons} Seasons</span>
                                            </div>
                                        )}
                                        {show.overview?.firstAirDate && (
                                            <div className="flex items-center gap-2 bg-green-500/10 backdrop-blur-md px-4 py-2 rounded-full border border-green-500/20 hover:bg-green-500/20 transition-colors">
                                                <Calendar className="w-5 h-5 text-green-500" />
                                                <span className="font-medium">{show.overview.firstAirDate}</span>
                                            </div>
                                        )}
                                    </motion.div>

                                    {/* Description with gradient fade */}
                                    <motion.div variants={itemVariants} className="relative">
                                        <motion.p
                                            variants={itemVariants}
                                            className="text-gray-300 text-lg leading-relaxed line-clamp-4"
                                        >
                                            {show.description}
                                        </motion.p>
                                        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black to-transparent pointer-events-none" />
                                    </motion.div>

                                    {/* Action buttons with enhanced hover effects */}
                                    <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                                        <motion.button
                                            className="group flex items-center gap-2 bg-yellow-500 text-black px-8 py-3 rounded-full hover:bg-yellow-400 transition-all duration-300"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Play className="w-5 h-5" fill="currentColor" />
                                            <span className="font-semibold">Watch Trailer</span>
                                        </motion.button>
                                        <motion.button
                                            className="group flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-full hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/10"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Heart className="w-5 h-5" />
                                            <span className="font-semibold">Add to Watchlist</span>
                                        </motion.button>
                                        <motion.button
                                            className="group flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-full hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/10"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Share2 className="w-5 h-5" />
                                            <span className="font-semibold">Share</span>
                                        </motion.button>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="container mx-auto px-4 py-16">
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
                            {/* Left Column */}
                            <div className="space-y-12">
                                {/* Cast & Crew Section */}
                                <section>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 flex items-center gap-3">
                                        <Award className="w-7 h-7 text-yellow-500" />
                                        Cast & Crew
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        {/* Main Cast */}
                                        <motion.div
                                            className="bg-zinc-900/60 rounded-xl p-6 backdrop-blur-sm shadow-lg border border-white/10"
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <h3 className="text-gray-400 text-lg mb-4">Main Cast</h3>
                                            <div className="space-y-4">
                                                {show.credits?.cast?.slice(0, 5).map((actor) => (
                                                    <motion.div
                                                        key={actor.id}
                                                        className="flex items-center gap-4 group"
                                                        whileHover={{ x: 5 }}
                                                    >
                                                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-500/50">
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
                                                            className="text-lg text-[#c8c8c9] group-hover:text-yellow-500 transition-colors"
                                                        >
                                                            {actor.name}
                                                            <div className="text-sm text-gray-400">{actor.character}</div>
                                                        </Link>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>

                                        {/* Creators - Only show when data exists */}
                                        {show.overview?.creators?.length > 0 && (
                                            <motion.div
                                                className="bg-zinc-900/60 rounded-xl p-6 backdrop-blur-sm shadow-lg border border-white/10"
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                <h3 className="text-gray-400 text-lg mb-4">Created By</h3>
                                                <div className="space-y-4">
                                                    {show.overview.creators.map((creator) => (
                                                        <div key={creator.id} className="flex items-center gap-4">
                                                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-500/50">
                                                                <img
                                                                    src={creator.profile_path
                                                                        ? `https://image.tmdb.org/t/p/w185${creator.profile_path}`
                                                                        : '/placeholder-avatar.jpg'
                                                                    }
                                                                    alt={creator.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <span className="text-lg text-white">{creator.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Seasons Overview - Now clickable */}
                                    <motion.div
                                        className="mt-8 bg-zinc-900/60 rounded-xl p-6 backdrop-blur-sm shadow-lg border border-white/10"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                            <Tv className="w-6 h-6 text-blue-500" />
                                            Seasons Overview
                                        </h3>
                                        <div className="space-y-4">
                                            {show.overview?.seasons?.map((season) => (
                                                <motion.div
                                                    key={season.id}
                                                    className="flex flex-col sm:flex-row gap-4 p-4 bg-zinc-800/50 rounded-lg border border-white/5"
                                                >
                                                    {season.poster_path && (
                                                        <div className="w-24 h-36 rounded-lg overflow-hidden shadow-lg">
                                                            <img
                                                                src={`https://image.tmdb.org/t/p/w185${season.poster_path}`}
                                                                alt={`${season.name} Poster`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-medium text-white mb-2">
                                                            {season.name}
                                                        </h4>
                                                        <div className="text-sm text-gray-400 mb-2">
                                                            {season.episode_count} Episodes • {season.air_date}
                                                        </div>
                                                        <p className="text-gray-300 text-sm line-clamp-2">
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
                            <div className="space-y-8">
                                {/* Show Stats */}
                                <motion.div
                                    className="bg-zinc-900/60 rounded-xl p-6 backdrop-blur-sm shadow-lg border border-white/10"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <Award className="w-6 h-6 text-yellow-500" />
                                        Show Stats
                                    </h3>
                                    <div className="grid gap-4">
                                        <div className="flex justify-between items-center p-4 bg-zinc-800/50 rounded-lg border border-white/5">
                                            <span className="text-gray-400">Rating</span>
                                            <span className="text-white font-medium">{show.rating}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-zinc-800/50 rounded-lg border border-white/5">
                                            <span className="text-gray-400">Seasons</span>
                                            <span className="text-white font-medium">{show.overview?.totalSeasons}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-zinc-800/50 rounded-lg border border-white/5">
                                            <span className="text-gray-400">First Air Date</span>
                                            <span className="text-white font-medium">{show.overview?.firstAirDate}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Similar Shows Section */}
                    {show.similar?.length > 0 && (
                        <div className="container mx-auto px-4 py-16">
                            <motion.div variants={itemVariants}>
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                                        <ThumbsUp className="w-7 h-7 text-yellow-500" />
                                        Similar Shows
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {show.similar.map((similarShow) => (
                                        <motion.div
                                            key={similarShow.id}
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ duration: 0.2 }}
                                        >                                                <Link
                                            to={`/show/${similarShow.id}`}
                                            className="group flex gap-4 p-4 rounded-xl bg-zinc-900/60 backdrop-blur-sm hover:bg-zinc-800/70 transition-all duration-300 border border-white/10 h-full"
                                        >
                                                <div className="w-24 h-36 flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w185${similarShow.poster_path}`}
                                                        alt={similarShow.name}
                                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-lg mb-2 text-white group-hover:text-yellow-500 transition-colors truncate">
                                                        {similarShow.name}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-2">
                                                        <div className="flex items-center">
                                                            <Star className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" />
                                                            <span>{similarShow.vote_average?.toFixed(1)}</span>
                                                        </div>
                                                        <span>•</span>
                                                        <span>{new Date(similarShow.first_air_date).getFullYear()}</span>
                                                    </div>
                                                    <p className="text-gray-400 text-sm line-clamp-3">
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