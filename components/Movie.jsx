import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion as m } from 'framer-motion';

const Movie = ({ movie }) => {
  return (
    <Link to={`/movie/${movie.id}`} className="block group">
      <div className="aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 relative">
        <img
          src={movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : '/placeholder.jpg'}
          alt={movie.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 text-white">
              <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
              <span>{movie.vote_average?.toFixed(1) ?? 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <h3 className="text-white font-medium text-sm sm:text-base line-clamp-1">
          {movie.title}
        </h3>
        <div className="text-sm text-gray-400">
          {movie.release_date?.split('-')[0] ?? 'N/A'}
        </div>
      </div>
    </Link>
  );
};

export default Movie;