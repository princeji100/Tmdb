import { useState, useEffect } from 'react';
import { fetchWithRetry } from '../utilities/fetchWithRetry';

export function useShowDetails(showId) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchShow = async () => {
            try {
                if (!showId) {
                    throw new Error('Invalid show ID');
                }

                const [showData, creditsData, similarData] = await Promise.all([
                    fetchWithRetry(`${import.meta.env.VITE_TMDB_BASE_URL}/tv/${showId}?language=en-US`),
                    fetchWithRetry(`${import.meta.env.VITE_TMDB_BASE_URL}/tv/${showId}/credits?language=en-US`),
                    fetchWithRetry(`${import.meta.env.VITE_TMDB_BASE_URL}/tv/${showId}/similar?language=en-US&page=1`)
                ]);

                if (!showData.id) {
                    throw new Error('Invalid show data received');
                }

                setData({
                    id: showData.id,
                    title: showData.name || 'Untitled Show',
                    description: showData.overview || 'No description available',
                    poster: showData.poster_path
                        ? `https://image.tmdb.org/t/p/w500${showData.poster_path}`
                        : '/placeholder.jpg',
                    backdrop: showData.backdrop_path
                        ? `https://image.tmdb.org/t/p/original${showData.backdrop_path}`
                        : '/placeholder-backdrop.jpg',
                    rating: showData.vote_average?.toFixed(1),
                    overview: {
                        status: showData.status || 'Unknown',
                        network: showData.networks?.[0]?.name || 'N/A',
                        totalSeasons: showData.number_of_seasons || 0,
                        totalEpisodes: showData.number_of_episodes || 0,
                        firstAirDate: new Date(showData.first_air_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }),
                        genres: showData.genres?.map(g => g.name) || [],
                        popularity: showData.popularity?.toFixed(1) || 'N/A',
                        voteCount: showData.vote_count?.toLocaleString() || '0',
                        creators: showData.created_by || [],
                        seasons: showData.seasons || [],
                        networks: showData.networks || [],
                        keywords: showData.keywords?.results?.map(k => k.name) || [],
                    },
                    credits: {
                        cast: creditsData.cast || [],
                        crew: creditsData.crew || []
                    },
                    similar: similarData?.results?.map(show => ({
                        id: show.id,
                        name: show.name,
                        poster_path: show.poster_path,
                        vote_average: show.vote_average,
                        first_air_date: show.first_air_date,
                        overview: show.overview || 'No overview available'
                    })) || []
                });
            } catch (err) {
                setError(err.message || 'Failed to fetch show details');
            } finally {
                setLoading(false);
            }
        };

        fetchShow();
    }, [showId]);

    return { data, loading, error };
}