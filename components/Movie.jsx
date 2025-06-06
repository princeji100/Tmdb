import { Star, Play, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion as m } from 'framer-motion';
import { useRef } from 'react';
import { useLazyLoad, useImagePreload } from '../utilities/performance';

const Movie = ({ movie, index = 0 }) => {
  const imgRef = useRef();
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder.jpg';

  const isVisible = useLazyLoad(imgRef, { threshold: 0.1 });
  const { isLoaded, error } = useImagePreload(isVisible ? posterUrl : '');

  // Enhanced animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 60,
      rotateY: -15
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateY: 0,
      transition: {
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    hover: {
      scale: 1.05,
      y: -10,
      rotateY: 5,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 1.3, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1,
        delay: 0.2,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.15,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const playButtonVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.5,
        delay: 0.3,
        ease: "backOut"
      }
    }
  };

  const infoVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <m.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group perspective-1000"
    >
      <Link to={`/movie/${movie.id}`} className="block">
        <m.div
          ref={imgRef}
          className="aspect-[2/3] rounded-xl overflow-hidden bg-zinc-900 relative shadow-lg hover:shadow-2xl transition-shadow duration-500"
          whileHover={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
            transition: { duration: 0.3 }
          }}
        >
          {/* Enhanced Image with Loading States */}
          {isVisible ? (
            <m.img
              src={posterUrl}
              alt={movie.title}
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className={`w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'
                } ${error ? 'opacity-50' : ''}`}
              loading="lazy"
            />
          ) : (
            <m.div
              className="w-full h-full bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-900"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          )}

          {/* Enhanced Gradient Overlay */}
          <m.div
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Play Button */}
            <m.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              variants={playButtonVariants}
              initial="hidden"
              whileHover="visible"
            >
              <m.div
                className="w-16 h-16 bg-yellow-500/90 rounded-full flex items-center justify-center backdrop-blur-sm"
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "rgba(234, 179, 8, 1)",
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-6 h-6 text-black ml-1" fill="currentColor" />
              </m.div>
            </m.div>

            {/* Rating Badge */}
            <m.div
              className="absolute top-3 right-3"
              variants={overlayVariants}
              initial="hidden"
              whileHover="visible"
            >
              <m.div
                className="flex items-center gap-1 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(0, 0, 0, 0.9)",
                  transition: { duration: 0.2 }
                }}
              >
                <m.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                </m.div>
                <span className="text-white text-sm font-semibold">
                  {movie.vote_average?.toFixed(1) ?? 'N/A'}
                </span>
              </m.div>
            </m.div>

            {/* Bottom Info Overlay */}
            <m.div
              className="absolute bottom-0 left-0 right-0 p-4"
              variants={overlayVariants}
              initial="hidden"
              whileHover="visible"
            >
              <m.div
                className="space-y-2"
                initial={{ y: 20, opacity: 0 }}
                whileHover={{
                  y: 0,
                  opacity: 1,
                  transition: { delay: 0.1, duration: 0.3 }
                }}
              >
                <h4 className="text-white font-bold text-lg line-clamp-2 drop-shadow-lg">
                  {movie.title}
                </h4>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {movie.release_date?.split('-')[0] ?? 'N/A'}
                    </span>
                  </div>
                  {movie.runtime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{movie.runtime}min</span>
                    </div>
                  )}
                </div>
              </m.div>
            </m.div>
          </m.div>
        </m.div>

        {/* Enhanced Movie Info */}
        <m.div
          className="mt-4 space-y-2"
          variants={infoVariants}
          initial="hidden"
          animate="visible"
        >
          <m.h3
            className="text-white font-semibold text-base line-clamp-2 leading-tight"
            whileHover={{
              color: "#eab308",
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            {movie.title}
          </m.h3>

          <m.div
            className="flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { delay: 0.5, duration: 0.3 }
            }}
          >
            <m.div
              className="flex items-center gap-2 text-gray-400"
              whileHover={{
                color: "#9ca3af",
                transition: { duration: 0.2 }
              }}
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {movie.release_date?.split('-')[0] ?? 'N/A'}
              </span>
            </m.div>

            <m.div
              className="flex items-center gap-1 px-2 py-1 bg-zinc-800/50 rounded-full"
              whileHover={{
                backgroundColor: "rgba(39, 39, 42, 0.8)",
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                transition: { delay: 0.6, duration: 0.3, ease: "backOut" }
              }}
            >
              <Star className="w-3 h-3 text-yellow-500" fill="currentColor" />
              <span className="text-xs text-white font-medium">
                {movie.vote_average?.toFixed(1) ?? 'N/A'}
              </span>
            </m.div>
          </m.div>
        </m.div>
      </Link>
    </m.div>
  );
};

export default Movie;