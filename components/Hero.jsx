import React, { useState, useEffect } from 'react';
import { Play, Star, Clock, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTrendingMovies } from '../hooks/useTrendingMovies';

const Hero = () => {
    const { data: movies, loading, error } = useTrendingMovies();
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentMovie = movies[currentIndex];

    // Auto-rotate featured movies
    useEffect(() => {
        if (!movies.length) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === movies.length - 1 ? 0 : prevIndex + 1
            );
        }, 8000);

        return () => clearInterval(interval);
    }, [movies.length]);

    if (loading) {
        return (
            <div className="relative h-[50vh] sm:h-[60vh] md:h-[75vh] lg:h-[85vh] w-full bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-yellow-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error || !currentMovie) {
        return (
            <div className="relative h-[60vh] sm:h-[75vh] lg:h-[85vh] w-full bg-black flex items-center justify-center">
                <div className="text-white text-xl">Failed to load trending movies</div>
            </div>
        );
    }

    return (
        <div className="relative h-[60vh] sm:h-[75vh] lg:h-[85vh] w-full">
            {/* Background Image with Preload */}
            {movies.map((movie, index) => (
                <div
                    key={movie.id}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                    style={{
                        backgroundImage: `url(${movie.backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
                </div>
            ))}

            {/* Content */}
            <div className="relative container mx-auto px-4 h-full flex items-center">
                <div className="max-w-2xl text-white animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
                        {currentMovie.title}
                    </h1>

                    {/* Movie Info */}
                    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm mb-3 sm:mb-6">
                        <div className="flex items-center">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 mr-1" />
                            <span>{currentMovie.rating}</span>
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mr-1" />
                            <span>{currentMovie.duration}</span>
                        </div>
                        <span>{currentMovie.year}</span>
                    </div>

                    <p className="text-gray-300 mb-4 sm:mb-8 text-sm sm:text-base lg:text-lg line-clamp-3 sm:line-clamp-none">
                        {currentMovie.description}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex gap-2 sm:gap-4">
                        <button className="group flex items-center gap-1 sm:gap-2 bg-yellow-500 text-black px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-yellow-400 transition-colors text-sm sm:text-base">
                            <Play className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-pulse" />
                            Watch Trailer
                        </button>
                        <Link
                            to={`/movie/${currentMovie.id}`}
                            className="group flex items-center gap-1 sm:gap-2 bg-white/20 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-white/30 transition-colors text-sm sm:text-base"
                        >
                            <Info className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-y-0.5 transition-transform" />
                            More Info
                        </Link>
                    </div>
                </div>
            </div>

            {/* Movie Indicators */}
            <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1 sm:gap-2">
                {movies.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all ${currentIndex === index ? 'bg-yellow-500 w-6 sm:w-8' : 'bg-gray-500'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Hero;
