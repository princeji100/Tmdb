import { useState } from 'react';
import Hero from "../components/Hero";
import Carousel from "../components/Carousel";
import { TrendingUp, Star, Clock, Award } from 'lucide-react';
import { useFetch } from '../services/useFetch';
import { motion as m } from 'framer-motion';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useA11y } from '../hooks/useA11y';
function App() {
  const [activeCategory, setActiveCategory] = useState('trending');

  // Initialize accessibility features
  useA11y();

  // Fetch different movie categories
  const { data: trendingMovies, loading: trendingLoading } = useFetch('/trending/movie/day?language=en-US');
  const { data: topRatedMovies, loading: topRatedLoading } = useFetch('/movie/top_rated?language=en-US');
  const { data: upcomingMovies, loading: upcomingLoading } = useFetch('/movie/upcoming?language=en-US');
  const { data: awardWinners, loading: awardsLoading } = useFetch('/movie/popular?language=en-US');

  const categories = [
    { id: 'trending', label: 'Trending Now', icon: TrendingUp, data: trendingMovies, loading: trendingLoading },
    { id: 'toprated', label: 'Top Rated', icon: Star, data: topRatedMovies, loading: topRatedLoading },
    { id: 'upcoming', label: 'Coming Soon', icon: Clock, data: upcomingMovies, loading: upcomingLoading },
    { id: 'awards', label: 'Award Winners', icon: Award, data: awardWinners, loading: awardsLoading }
  ];

  const activeData = categories.find(category => category.id === activeCategory);

  return (
    <div className="min-h-screen bg-black">
      <ErrorBoundary>
        <Hero />

        <div className="bg-black text-white py-4 sm:py-8">
          <div className="container mx-auto px-4">
            {/* Categories Navigation */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              {categories.map(({ id, label, icon: Icon }) => (
                <m.button
                  key={id}
                  onClick={() => setActiveCategory(id)}
                  className={`px-3 sm:px-6 py-2 sm:py-3 rounded-full transition-colors 
                    flex items-center gap-1 sm:gap-2 text-sm sm:text-base 
                    ${activeCategory === id
                      ? 'bg-yellow-500 text-black'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                    }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 
                    ${activeCategory === id ? 'text-black' : 'text-yellow-500'}`}
                  />
                  {label}
                </m.button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Movie Section with Error Handling */}
        <div className="bg-black pb-8 sm:pb-12">
          <div className="container mx-auto">
            {activeData.loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[2/3] bg-zinc-800 rounded-lg mb-2" />
                    <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-zinc-800 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : activeData.error ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">{activeData.error.message}</p>
                {!activeData.error.isRetrying && (
                  <button
                    onClick={activeData.retry}
                    className="px-6 py-2 bg-yellow-500 text-black rounded-full"
                  >
                    Try Again
                  </button>
                )}
              </div>
            ) : activeData.data && activeData.data.length > 0 ? (
              <Carousel
                title={
                  <div className="flex items-center gap-1 sm:gap-2">
                    <activeData.icon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                    <span className="text-base sm:text-lg">{activeData.label}</span>
                  </div>
                }
                movies={activeData.data?.map(movie => ({
                  id: movie.id,
                  title: movie.title,
                  poster_path: movie.poster_path,
                  vote_average: movie.vote_average,
                  release_date: movie.release_date
                }))}
              />
            ) : (
              <div className="text-gray-400 text-center py-8">
                No movies available
              </div>
            )}
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
}

export default App;
