import { useEffect, useCallback } from 'react';

export function useA11y() {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('user-is-tabbing');
            }
        };

        const handleMouseDown = () => {
            document.body.classList.remove('user-is-tabbing');
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('mousedown', handleMouseDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('mousedown', handleMouseDown);
        };
    }, []);

    const handleEscapeKey = useCallback((handler) => {
        const listener = (event) => {
            if (event.key === 'Escape') {
                handler(event);
            }
        };

        window.addEventListener('keydown', listener);
        return () => window.removeEventListener('keydown', listener);
    }, []);

    return { handleEscapeKey };
}