import { useState, useEffect, useRef } from 'react';
import React from 'react';

export function useThrottledValue(value, limit) {
    const [throttledValue, setThrottledValue] = useState(value);
    const lastRan = useRef(Date.now());

    useEffect(() => {
        const handler = setTimeout(() => {
            if (Date.now() - lastRan.current >= limit) {
                setThrottledValue(value);
                lastRan.current = Date.now();
            }
        }, limit - (Date.now() - lastRan.current));

        return () => clearTimeout(handler);
    }, [value, limit]);

    return throttledValue;
}

export function useLazyLoad(ref, options = {}) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!ref.current || isLoaded) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                setIsLoaded(true);
                observer.disconnect();
            }
        }, { threshold: 0.1, ...options });

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [ref, options, isLoaded]);

    return isVisible;
}

export const useImagePreload = (imageSrc) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!imageSrc) {
            setIsLoaded(false);
            setError(null);
            return;
        }

        const img = new Image();
        img.onload = () => setIsLoaded(true);
        img.onerror = () => setError('Failed to load image');
        img.src = imageSrc;

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [imageSrc]);

    return { isLoaded, error };
};

export const memoWithDeepCompare = (Component) => {
    return React.memo(Component, (prevProps, nextProps) => {
        return JSON.stringify(prevProps) === JSON.stringify(nextProps);
    });
};

export function useIntersectionObserver(ref, options = {}) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting);
        }, options);

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [ref, options]);

    return isVisible;
}