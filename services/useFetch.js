import { useState, useEffect, useCallback } from 'react';

const RETRY_COUNT = 3;
const RETRY_DELAY = 1000;

export const useFetch = (endpoint) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    const fetchWithRetry = useCallback(async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_TMDB_BASE_URL}${endpoint}`,
                {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const json = await response.json();
            setData(json.results || json);
            setError(null);
            setRetryCount(0); // Reset retry count on success
        } catch (err) {
            const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 10000);
            setError({
                message: `Failed to load data. Retrying in ${backoffDelay / 1000}s...`,
                isRetrying: true
            });

            if (retryCount < 3) {
                setTimeout(() => {
                    setRetryCount(prev => prev + 1);
                    fetchWithRetry();
                }, backoffDelay);
            } else {
                setError({
                    message: 'Failed to load data after multiple attempts',
                    isRetrying: false
                });
            }
        } finally {
            setLoading(false);
        }
    }, [endpoint, retryCount]);

    // Initial fetch
    useEffect(() => {
        fetchWithRetry();
    }, [fetchWithRetry]);

    const retry = useCallback(() => {
        setLoading(true);
        setError(null);
        setRetryCount(0);
        fetchWithRetry();
    }, [fetchWithRetry]);

    return { data, loading, error, retry };
};
