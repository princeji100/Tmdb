import { useState, useEffect, useCallback } from 'react';
import { fetchWithRetry } from '../utilities/fetchWithRetry'

export function usePaginatedData(endpoint, options = {}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchPage = useCallback(async (pageNum, isLoadMore = false) => {
        try {
            if (isLoadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            const separator = endpoint.includes('?') ? '&' : '?';
            const response = await fetchWithRetry(
                `${import.meta.env.VITE_TMDB_BASE_URL}${endpoint}${separator}page=${pageNum}`,
                options
            );

            setData(prev => pageNum === 1 ? (response.results || []) : [...prev, ...(response.results || [])]);
            setHasMore(response.page < response.total_pages);
            setError(null);
        } catch (err) {
            setError({
                message: err.message || 'An error occurred while fetching data',
                isRetrying: false
            });
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [endpoint, options]);

    useEffect(() => {
        fetchPage(1);
    }, [fetchPage]);

    const loadMore = useCallback(() => {
        if (!loading && !loadingMore && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchPage(nextPage, true);
        }
    }, [loading, loadingMore, hasMore, page, fetchPage]);

    const retry = useCallback(() => {
        setError(null);
        setPage(1);
        fetchPage(1);
    }, [fetchPage]);

    return { data, loading, loadingMore, error, hasMore, loadMore, retry };
}