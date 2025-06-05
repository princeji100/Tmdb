import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import { useThrottledValue } from '../utilities/performance';
import { fetchWithRetry } from '../utilities/fetchWithRetry';

const MINIMUM_QUERY_LENGTH = 2;
const RESULTS_PER_SECTION = 3;

export function useSearch(query) {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { debouncedValue: debouncedQuery, isDebouncing, isPending } = useDebounce(query, 350);
    const throttledQuery = useThrottledValue(query, 200); // Faster response for better UX

    // Clear results if query is empty
    useEffect(() => {
        if (query.length < MINIMUM_QUERY_LENGTH) {
            setResults(null);
            setError(null);
            setLoading(false);
        }
    }, [query]);

    // Show loading state while debouncing (use throttled for immediate feedback)
    useEffect(() => {
        if ((isDebouncing || isPending) && throttledQuery.length >= MINIMUM_QUERY_LENGTH) {
            setLoading(true);
        }
    }, [throttledQuery, isDebouncing, isPending]);

    // Memoize the transform functions for better performance
    const transformMovie = useCallback((movie) => {
        if (!movie || !movie.id) return null;
        return {
            id: movie.id,
            title: movie.title || 'Unknown Title',
            year: movie.release_date?.split('-')[0] || 'TBA',
            poster: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : '/placeholder.jpg',
            rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'
        };
    }, []);

    const transformPerson = useCallback((person) => {
        if (!person || !person.id) return null;
        return {
            id: person.id,
            name: person.name || 'Unknown Person',
            photo: person.profile_path
                ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                : '/placeholder-avatar.jpg',
            knownFor: person.known_for_department || 'Actor'
        };
    }, []);

    const transformShow = useCallback((show) => {
        if (!show || !show.id) return null;
        return {
            id: show.id,
            title: show.name || 'Unknown Show',
            year: show.first_air_date?.split('-')[0] || 'TBA',
            poster: show.poster_path
                ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                : '/placeholder.jpg',
            rating: show.vote_average ? show.vote_average.toFixed(1) : 'N/A'
        };
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        const searchMoviesAndPeople = async () => {
            if (debouncedQuery.length < MINIMUM_QUERY_LENGTH) {
                setResults(null);
                return;
            }

            try {
                const [moviesData, peopleData, showsData] = await Promise.all([
                    fetchWithRetry(
                        `${import.meta.env.VITE_TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(debouncedQuery)}&language=en-US&include_adult=false`,
                        { signal: controller.signal }
                    ),
                    fetchWithRetry(
                        `${import.meta.env.VITE_TMDB_BASE_URL}/search/person?query=${encodeURIComponent(debouncedQuery)}&language=en-US`,
                        { signal: controller.signal }
                    ),
                    fetchWithRetry(
                        `${import.meta.env.VITE_TMDB_BASE_URL}/search/tv?query=${encodeURIComponent(debouncedQuery)}&language=en-US&include_adult=false`,
                        { signal: controller.signal }
                    )
                ]);

                if (!controller.signal.aborted) {
                    setResults({
                        movies: (moviesData.results || [])
                            .slice(0, RESULTS_PER_SECTION)
                            .map(transformMovie)
                            .filter(Boolean), // Remove null values
                        actors: (peopleData.results || [])
                            .slice(0, RESULTS_PER_SECTION)
                            .map(transformPerson)
                            .filter(Boolean), // Remove null values
                        shows: (showsData.results || [])
                            .slice(0, RESULTS_PER_SECTION)
                            .map(transformShow)
                            .filter(Boolean) // Remove null values
                    });
                    setError(null);
                }
            } catch (err) {
                if (!controller.signal.aborted) {
                    console.error('Search error:', err);
                    setError('Failed to fetch search results');
                    setResults(null);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        searchMoviesAndPeople();

        return () => controller.abort();
    }, [debouncedQuery, transformMovie, transformPerson, transformShow]);

    return {
        results,
        loading,
        error,
        isEmpty: !!results &&
            results.movies.length === 0 &&
            results.actors.length === 0 &&
            results.shows.length === 0
    };
}