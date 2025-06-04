import { useState, useCallback } from 'react';

const MAX_HISTORY_ITEMS = 5;
const STORAGE_KEY = 'searchHistory';

export function useSearchHistory() {
    const [searchHistory, setSearchHistory] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) return [];

            const parsed = JSON.parse(stored);
            // Validate that it's an array of strings
            if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
                return parsed.slice(0, MAX_HISTORY_ITEMS); // Ensure max limit
            }
            return [];
        } catch (error) {
            console.error('Failed to parse search history:', error);
            // Clear corrupted data
            localStorage.removeItem(STORAGE_KEY);
            return [];
        }
    });

    const addToHistory = useCallback((query) => {
        if (!query?.trim() || typeof query !== 'string') return;

        const trimmedQuery = query.trim();
        if (trimmedQuery.length > 100) return; // Prevent extremely long queries

        setSearchHistory(prev => {
            const newHistory = [
                trimmedQuery,
                ...prev.filter(item => item !== trimmedQuery)
            ].slice(0, MAX_HISTORY_ITEMS);

            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
            } catch (error) {
                console.error('Failed to save search history:', error);
                // If localStorage is full, try to clear some space
                if (error.name === 'QuotaExceededError') {
                    try {
                        localStorage.removeItem(STORAGE_KEY);
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
                    } catch (retryError) {
                        console.error('Failed to save search history after clearing:', retryError);
                    }
                }
            }

            return newHistory;
        });
    }, []);

    const clearHistory = useCallback(() => {
        setSearchHistory([]);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Failed to clear search history:', error);
        }
    }, []);

    return {
        searchHistory,
        addToHistory,
        clearHistory
    };
}
