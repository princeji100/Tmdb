import { useState, useEffect } from 'react';
import { fetchWithRetry } from '../utilities/fetchWithRetry';

export function useMovieDetails(movieId) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
            if (!movieId) {
                setError('Invalid movie ID');
                setLoading(false);
                return;
            }

            try {
                // Fetch main movie data first
                const movieData = await fetchWithRetry(
                    `${import.meta.env.VITE_TMDB_BASE_URL}/movie/${movieId}`
                );

                if (!movieData.id) {
                    throw new Error('Movie not found');
                }

                // Then fetch additional data
                const [creditsData, similarData, keywordsData] = await Promise.all([
                    fetchWithRetry(`${import.meta.env.VITE_TMDB_BASE_URL}/movie/${movieId}/credits`),
                    fetchWithRetry(`${import.meta.env.VITE_TMDB_BASE_URL}/movie/${movieId}/similar`),
                    fetchWithRetry(`${import.meta.env.VITE_TMDB_BASE_URL}/movie/${movieId}/keywords`)
                ]);

                // Format currency with better error handling
                const formatCurrency = (amount) => {
                    if (!amount || isNaN(amount)) return 'N/A';
                    try {
                        return amount >= 1000000
                            ? `$${(amount / 1000000).toFixed(1)}M`
                            : `$${(amount / 1000).toFixed(1)}K`;
                    } catch {
                        return 'N/A';
                    }
                };

                // Format runtime with error handling
                const formatRuntime = (minutes) => {
                    if (!minutes || isNaN(minutes)) return 'N/A';
                    try {
                        const hours = Math.floor(minutes / 60);
                        const remainingMinutes = minutes % 60;
                        return `${hours}h ${remainingMinutes}m`;
                    } catch {
                        return 'N/A';
                    }
                };

                // Format date with error handling
                const formatDate = (dateString) => {
                    if (!dateString) return 'TBA';
                    try {
                        return new Date(dateString).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                    } catch {
                        return 'Invalid Date';
                    }
                };

                setData({
                    id: movieData.id,
                    title: movieData.title || 'Untitled',
                    description: movieData.overview || 'No description available',
                    credits: {
                        cast: creditsData?.cast || [],
                        crew: creditsData?.crew || []
                    },
                    similar: (similarData?.results || []).slice(0, 4),
                    poster: movieData.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
                        : '/placeholder.jpg',
                    backdrop: movieData.backdrop_path
                        ? `https://image.tmdb.org/t/p/original${movieData.backdrop_path}`
                        : '/placeholder-backdrop.jpg',
                    year: movieData.release_date ? new Date(movieData.release_date).getFullYear() : 'TBA',
                    rating: movieData.vote_average ? movieData.vote_average.toFixed(1) : 'N/A',
                    genre: movieData.genres?.map(g => g.name) || [],
                    duration: formatRuntime(movieData.runtime),
                    overview: {
                        budget: formatCurrency(movieData.budget),
                        revenue: formatCurrency(movieData.revenue),
                        profit: movieData.revenue && movieData.budget
                            ? formatCurrency(movieData.revenue - movieData.budget)
                            : 'N/A',
                        summary: {
                            plot: movieData.overview || 'No plot description available.',
                            tagline: movieData.tagline || null,
                            genres: movieData.genres?.map(g => g.name) || [],
                            themes: keywordsData?.keywords?.slice(0, 5).map(k => k.name) || [],
                            runtime: formatRuntime(movieData.runtime),
                            releaseYear: movieData.release_date ? new Date(movieData.release_date).getFullYear() : 'TBA',
                            maturityRating: movieData.adult ? 'R' : 'PG-13',
                            director: creditsData?.crew?.find(person => person.job === 'Director')?.name || 'Unknown',
                            writers: creditsData?.crew
                                ?.filter(person => ['Screenplay', 'Writer', 'Story'].includes(person.job))
                                .map(writer => writer.name) || []
                        },
                        status: movieData.status || 'Unknown',
                        originalLanguage: movieData.original_language?.toUpperCase() || 'N/A',
                        spokenLanguages: movieData.spoken_languages?.map(l => l.english_name) || [],
                        popularity: movieData.popularity?.toFixed(1) || 'N/A',
                        voteCount: movieData.vote_count?.toLocaleString() || '0',
                        runtime: formatRuntime(movieData.runtime),
                        releaseDate: formatDate(movieData.release_date),
                        keywords: keywordsData?.keywords?.map(k => k.name) || [],
                        productionCompanies: (movieData.production_companies || []).map(company => ({
                            id: company.id,
                            name: company.name,
                            logo: company.logo_path
                                ? `https://image.tmdb.org/t/p/w200${company.logo_path}`
                                : null,
                            country: company.origin_country || 'Unknown'
                        })),
                        productionCountries: movieData.production_countries?.map(country =>
                            country.name
                        ) || []
                    }
                });
                setLoading(false);
            } catch (err) {
                console.error('Movie details error:', err);
                setError(err.message || 'Failed to fetch movie details');
                setLoading(false);
            }
        };

        fetchMovie();
    }, [movieId]);

    return { data, loading, error };
}