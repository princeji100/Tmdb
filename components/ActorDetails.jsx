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

    // Add error handling to the sort function
    const sortedFilmography = actor?.filmography?.sort((a, b) => {
        try {
            return new Date(b.releaseDate) - new Date(a.releaseDate);
        } catch (error) {
            console.error('Error sorting filmography:', error);
            return 0;
        }
    }) || [];

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
                    <div className="relative h-[70vh] sm:h-[80vh] w-full">
                        {/* Animated Backdrop */}
                        <motion.div
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0 w-full h-full"
                            style={{
                                backgroundImage: `url(${actor.backdrop})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                filter: 'brightness(0.5)',
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
                        </motion.div>

                        {/* Content with enhanced animations */}
                        <div className="relative container mx-auto px-4 h-full flex items-end pb-16">
                            <motion.div
                                variants={itemVariants}
                                className="flex flex-col sm:flex-row gap-8 sm:gap-12 w-full"
                            >
                                {/* Actor Photo with floating effect */}
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="w-40 sm:w-52 md:w-64 shrink-0 mx-auto sm:mx-0"
                                >
                                    <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] transition-shadow duration-300">
                                        <img
                                            src={actor.photo}
                                            alt={actor.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </motion.div>

                                {/* Actor Info with enhanced typography */}
                                <div className="text-white w-full max-w-3xl space-y-6">
                                    <motion.h1
                                        variants={itemVariants}
                                        className="text-4xl sm:text-6xl font-bold leading-tight tracking-tight drop-shadow-lg"
                                    >
                                        {actor.name}
                                    </motion.h1>

                                    {/* Info badges with glass effect */}
                                    <motion.div
                                        variants={itemVariants}
                                        className="flex flex-wrap items-center gap-4"
                                    >
                                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-colors">
                                            <Calendar className="w-4 h-4 text-yellow-500" />
                                            <span className="text-sm font-medium">{actor.birthDate}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-colors">
                                            <MapPin className="w-4 h-4 text-yellow-500" />
                                            <span className="text-sm font-medium">{actor.birthPlace}</span>
                                        </div>
                                    </motion.div>

                                    {/* Biography preview */}
                                    <motion.p
                                        variants={itemVariants}
                                        className="text-gray-300 text-lg leading-relaxed line-clamp-4"
                                    >
                                        {actor.biography}
                                    </motion.p>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Main Content and Sidebar Section */}
                    <div className="container mx-auto px-4 py-10 sm:py-16">
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
                            {/* Main Content */}
                            <div className="space-y-12">
                                {/* Biography Section */}
                                <section>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                                        <User className="w-7 h-7 text-yellow-500" />
                                        Biography
                                    </h2>
                                    <p className="text-gray-300 text-lg leading-relaxed">
                                        {actor.biography}
                                    </p>
                                </section>
                                {/* Known For Section */}
                                <section>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 flex items-center gap-3">
                                        <TrendingUp className="w-7 h-7 text-yellow-500" />
                                        Known For
                                    </h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                        {actor.knownFor.map((movie) => (
                                            <Link
                                                key={movie.id}
                                                to={`/movie/${movie.id}`}
                                                className="group"
                                            >
                                                <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3">
                                                    <img
                                                        src={movie.poster}
                                                        alt={movie.title}
                                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Film className="w-8 h-8 text-white" />
                                                    </div>
                                                </div>
                                                <h3 className="text-white font-medium group-hover:text-yellow-500 transition-colors">
                                                    {movie.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm">{movie.role}</p>
                                                <p className="text-gray-400 text-sm">{movie.year}</p>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-8">
                                {/* Personal Info */}
                                <div className="bg-zinc-900/60 rounded-xl p-6 backdrop-blur-sm border border-white/10">
                                    <h3 className="text-xl font-bold text-white mb-6">Personal Info</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-gray-400 text-sm">Birth Name</h4>
                                            <p className="text-white">{actor.personalInfo.birthName}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-gray-400 text-sm">Gender</h4>
                                            <p className="text-white">{actor.personalInfo.gender}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-gray-400 text-sm">Birthday</h4>
                                            <p className="text-white flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                {actor.birthDate}
                                                {actor.personalInfo.age && `(${actor.personalInfo.age} years old)`}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-gray-400 text-sm">Place of Birth</h4>
                                            <p className="text-white flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                {actor.birthPlace}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-gray-400 text-sm">Known Credits</h4>
                                            <p className="text-white">{actor.personalInfo.knownCredits} movies</p>
                                        </div>
                                        {actor.personalInfo.deathday && (
                                            <div>
                                                <h4 className="text-gray-400 text-sm">Died</h4>
                                                <p className="text-white">{actor.personalInfo.deathday}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Social Media Links */}
                                {(actor.socialMedia.instagram || actor.socialMedia.twitter || actor.socialMedia.facebook) && (
                                    <div className="flex gap-4">
                                        {actor.socialMedia.instagram && (
                                            <a
                                                href={`https://instagram.com/${actor.socialMedia.instagram}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-zinc-900/60 p-3 rounded-full hover:bg-zinc-800/70 transition-colors"
                                            >
                                                <Instagram className="w-6 h-6 text-white" />
                                            </a>
                                        )}
                                        {actor.socialMedia.twitter && (
                                            <a
                                                href={`https://twitter.com/${actor.socialMedia.twitter}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-zinc-900/60 p-3 rounded-full hover:bg-zinc-800/70 transition-colors"
                                            >
                                                <Twitter className="w-6 h-6 text-white" />
                                            </a>
                                        )}
                                        {actor.socialMedia.facebook && (
                                            <a
                                                href={`https://facebook.com/${actor.socialMedia.facebook}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-zinc-900/60 p-3 rounded-full hover:bg-zinc-800/70 transition-colors"
                                            >
                                                <Facebook className="w-6 h-6 text-white" />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ActorDetails;
