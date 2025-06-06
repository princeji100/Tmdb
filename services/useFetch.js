import { useState, useEffect, useCallback } from 'react';

export const useFetch = (endpoint) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    const fetchData = useCallback(async (currentRetryCount = 0) => {
        try {
            setLoading(true);
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
            setRetryCount(0);
        } catch (err) {
            if (currentRetryCount < 3) {
                const backoffDelay = Math.min(1000 * Math.pow(2, currentRetryCount), 10000);
                setError({
                    message: `Failed to load data. Retrying in ${backoffDelay / 1000}s...`,
                    isRetrying: true
                });
                
                setTimeout(() => {
                    setRetryCount(currentRetryCount + 1);
                    fetchData(currentRetryCount + 1);
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
    }, [endpoint]);

    // Initial fetch
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const retry = useCallback(() => {
        setRetryCount(0);
        fetchData();
    }, [fetchData]);

    return { data, loading, error, retry };
};
