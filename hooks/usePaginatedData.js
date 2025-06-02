import { useState, useEffect, useCallback } from 'react';
import {fetchWithRetry} from '../utilities/fetchWithRetry'

export function usePaginatedData(endpoint, options = {}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchPage = useCallback(async (pageNum) => {
        try {
            setLoading(true);
            const response = await fetchWithRetry(
                `${import.meta.env.VITE_TMDB_BASE_URL}${endpoint}?page=${pageNum}`,
                options
            );

            setData(prev => pageNum === 1 ? response.results : [...prev, ...response.results]);
            setHasMore(response.page < response.total_pages);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [endpoint]);

    useEffect(() => {
        fetchPage(1);
    }, [fetchPage]);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
            fetchPage(page + 1);
        }
    }, [loading, hasMore, page, fetchPage]);

    return { data, loading, error, hasMore, loadMore };
}