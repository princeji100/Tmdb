import { useState, useEffect, useCallback } from 'react';

const MAX_HISTORY_ITEMS = 5;
const STORAGE_KEY = 'searchHistory';

export function useSearchHistory() {
    const [searchHistory, setSearchHistory] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        } catch (error) {
            console.error('Failed to parse search history:', error);
            return [];
        }
    });

    const addToHistory = useCallback((query) => {
        if (!query?.trim()) return;

        setSearchHistory(prev => {
            const newHistory = [
                query,
                ...prev.filter(item => item !== query)
            ].slice(0, MAX_HISTORY_ITEMS);

            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
            } catch (error) {
                console.error('Failed to save search history:', error);
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
