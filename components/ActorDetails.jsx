import {
    User, TrendingUp, Film,
    Twitter, Facebook, Instagram, Calendar,
    MapPin, Star
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useActorDetails } from '../hooks/useActorDetails';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ActorDetailsSkeleton from '../components/ActorDetailsSkeleton';

const ActorDetails = () => {
    const { id } = useParams();
    const { data: actor, loading, error } = useActorDetails(id);
    const [prevId, setPrevId] = useState(id);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        if (id !== prevId) {
            setIsTransitioning(true);
            setPrevId(id);
            window.scrollTo({ top: 0, behavior: 'auto' });
        }

        // Wrap the check in a try-catch to handle potential JSON parsing errors
        try {
            if (actor?.id === Number(id)) {
                setIsTransitioning(false);
            }
        } catch (error) {
            console.error('Error comparing actor IDs:', error);
            setIsTransitioning(false);
        }
    }, [id, actor, prevId]);

    const isLoading = loading || isTransitioning || !actor || actor.id !== Number(id);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                staggerChildren: 0.2
            }
        },
        exit: { opacity: 0 }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <AnimatePresence mode="wait" initial={false}>
            {isLoading ? (
                <ActorDetailsSkeleton key={`skeleton-${id}`} />
            ) : error ? (
                <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="min-h-screen bg-black flex items-center justify-center"
                >
                    <div className="text-white text-xl bg-red-500/20 px-8 py-6 rounded-xl backdrop-blur-sm border border-red-500/20">
                        <span className="text-red-400">Error:</span> {error || 'Actor not found'}
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    key={`actor-${id}`}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="min-h-screen bg-gradient-to-b from-black via-zinc-900/50 to-black overflow-x-hidden"
                >
                    {/* Hero Section with enhanced backdrop */}
                    <div className="relative w-full h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]">
                        {/* Animated Backdrop */}
                        <motion.div
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0 w-full h-full"
                            style={{
                                backgroundImage: `url(${actor.backdrop})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center center',
                                backgroundRepeat: 'no-repeat',
                                filter: 'brightness(0.6)',
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
                        </motion.div>

                        {/* Content with enhanced animations */}
                        <div className="relative z-10 h-full flex items-center justify-center">
                            <div className="container mx-auto px-4 sm:px-6 md:px-8">
                                <motion.div
                                    variants={itemVariants}
                                    className="flex flex-col items-center justify-center text-center w-full max-w-4xl mx-auto"
                                >
                                    {/* Actor Photo with floating effect */}
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        className="w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64 shrink-0 mx-auto mb-6 sm:mb-8"
                                    >
                                        <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_50px_rgba(234,179,8,0.4)] transition-all duration-300 ring-2 ring-white/20 hover:ring-yellow-500/60">
                                            <img
                                                src={actor.photo}
                                                alt={actor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Actor Info with enhanced typography */}
                                    <div className="text-white w-full space-y-4 sm:space-y-5 md:space-y-6 text-center flex flex-col items-center">
                                        <motion.h1
                                            variants={itemVariants}
                                            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight drop-shadow-2xl text-center"
                                        >
                                            {actor.name}
                                        </motion.h1>

                                        {/* Info badges with glass effect */}
                                        <motion.div
                                            variants={itemVariants}
                                            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5"
                                        >
                                            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full border border-white/20 hover:bg-white/20 transition-colors">
                                                <Calendar className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4 text-yellow-500" />
                                                <span className="text-xs sm:text-sm font-medium">{actor.birthDate}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full border border-white/20 hover:bg-white/20 transition-colors">
                                                <MapPin className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4 text-yellow-500" />
                                                <span className="text-xs sm:text-sm font-medium">{actor.birthPlace}</span>
                                            </div>
                                        </motion.div>

                                        {/* Biography preview */}
                                        <motion.p
                                            variants={itemVariants}
                                            className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed text-center max-w-3xl line-clamp-3 sm:line-clamp-4 md:line-clamp-5"
                                        >
                                            {actor.biography}
                                        </motion.p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content and Sidebar Section */}
                    <div className="container mx-auto px-4 sm:px-6 md:px-8 pt-8 sm:pt-12 md:pt-16 lg:pt-20 pb-8 sm:pb-12 lg:pb-16">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] xl:grid-cols-[1fr_350px] gap-6 sm:gap-8 md:gap-10 lg:gap-12">
                                {/* Main Content */}
                                <div className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
                                    {/* Biography Section */}
                                    <section className="text-center lg:text-left">
                                        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4 md:mb-6 flex items-center justify-center lg:justify-start gap-2 sm:gap-3">
                                            <User className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7 text-yellow-500" />
                                            Biography
                                        </h2>
                                        <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed text-center lg:text-left">
                                            {actor.biography}
                                        </p>
                                    </section>
                                    {/* Known For Section */}
                                    <section className="text-center lg:text-left">
                                        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6 md:mb-8 flex items-center justify-center lg:justify-start gap-2 sm:gap-3">
                                            <TrendingUp className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7 text-yellow-500" />
                                            Known For
                                        </h2>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 justify-items-center lg:justify-items-start">
                                            {actor.knownFor.map((movie) => (
                                                <Link
                                                    key={movie.id}
                                                    to={`/movie/${movie.id}`}
                                                    className="group"
                                                >
                                                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 sm:mb-3 ring-1 ring-white/10 hover:ring-yellow-500/50 transition-all duration-300">
                                                        <img
                                                            src={movie.poster}
                                                            alt={movie.title}
                                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                                                        />
                                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <Film className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-white" />
                                                        </div>
                                                    </div>
                                                    <h3 className="text-white font-medium group-hover:text-yellow-500 transition-colors text-xs sm:text-sm md:text-base line-clamp-2">
                                                        {movie.title}
                                                    </h3>
                                                    <p className="text-gray-400 text-xs sm:text-sm line-clamp-1">{movie.role}</p>
                                                    <p className="text-gray-400 text-xs sm:text-sm">{movie.year}</p>
                                                </Link>
                                            ))}
                                        </div>
                                    </section>
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-4 sm:space-y-6 md:space-y-8 flex flex-col items-center lg:items-start">
                                    {/* Personal Info */}
                                    <div className="bg-zinc-900/60 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 backdrop-blur-sm border border-white/10 w-full max-w-md lg:max-w-none">
                                        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-5 md:mb-6 text-center lg:text-left">Personal Info</h3>
                                        <div className="space-y-3 sm:space-y-4">
                                            <div>
                                                <h4 className="text-gray-400 text-xs sm:text-sm">Birth Name</h4>
                                                <p className="text-white text-sm sm:text-base">{actor.personalInfo.birthName}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-gray-400 text-xs sm:text-sm">Gender</h4>
                                                <p className="text-white text-sm sm:text-base">{actor.personalInfo.gender}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-gray-400 text-xs sm:text-sm">Birthday</h4>
                                                <p className="text-white flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                                                    <Calendar className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                                                    {actor.birthDate}
                                                    {actor.personalInfo.age && ` (${actor.personalInfo.age} years old)`}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="text-gray-400 text-xs sm:text-sm">Place of Birth</h4>
                                                <p className="text-white flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                                                    <MapPin className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                                                    {actor.birthPlace}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="text-gray-400 text-xs sm:text-sm">Known Credits</h4>
                                                <p className="text-white text-sm sm:text-base">{actor.personalInfo.knownCredits} movies</p>
                                            </div>
                                            {actor.personalInfo.deathday && (
                                                <div>
                                                    <h4 className="text-gray-400 text-xs sm:text-sm">Died</h4>
                                                    <p className="text-white text-sm sm:text-base">{actor.personalInfo.deathday}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Social Media Links */}
                                    {(actor.socialMedia.instagram || actor.socialMedia.twitter || actor.socialMedia.facebook) && (
                                        <div className="flex justify-center lg:justify-start gap-2 sm:gap-3 md:gap-4">
                                            {actor.socialMedia.instagram && (
                                                <a
                                                    href={`https://instagram.com/${actor.socialMedia.instagram}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-zinc-900/60 p-2 sm:p-2.5 md:p-3 rounded-full hover:bg-zinc-800/70 hover:scale-110 transition-all duration-300 border border-white/10 hover:border-pink-500/50"
                                                >
                                                    <Instagram className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-white hover:text-pink-400 transition-colors" />
                                                </a>
                                            )}
                                            {actor.socialMedia.twitter && (
                                                <a
                                                    href={`https://twitter.com/${actor.socialMedia.twitter}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-zinc-900/60 p-2 sm:p-2.5 md:p-3 rounded-full hover:bg-zinc-800/70 hover:scale-110 transition-all duration-300 border border-white/10 hover:border-blue-500/50"
                                                >
                                                    <Twitter className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-white hover:text-blue-400 transition-colors" />
                                                </a>
                                            )}
                                            {actor.socialMedia.facebook && (
                                                <a
                                                    href={`https://facebook.com/${actor.socialMedia.facebook}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-zinc-900/60 p-2 sm:p-2.5 md:p-3 rounded-full hover:bg-zinc-800/70 hover:scale-110 transition-all duration-300 border border-white/10 hover:border-blue-600/50"
                                                >
                                                    <Facebook className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-white hover:text-blue-500 transition-colors" />
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ActorDetails;
