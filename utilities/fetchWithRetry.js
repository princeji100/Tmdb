const CACHE_DURATION = 1000 * 60 * 15; // 15 minutes
const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1 second

export class ApiCache {
    constructor() {
        this.cache = new Map();
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        if (Date.now() - item.timestamp > CACHE_DURATION) {
            this.cache.delete(key);
            return null;
        }
        return item.data;
    }

    set(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    invalidate(key) {
        this.cache.delete(key);
    }

    clear() {
        this.cache.clear();
    }
}

const apiCache = new ApiCache();

export async function fetchWithRetry(url, options = {}, retryCount = 0) {
    // Create a safe cache key by only including serializable properties from options
    const safeOptions = {};
    // Only include primitive values and simple arrays that can be safely serialized
    if (options.headers) {
        safeOptions.headers = { ...options.headers };
    }
    if (options.method) {
        safeOptions.method = options.method;
    }
    if (options.body && typeof options.body === 'string') {
        safeOptions.body = options.body;
    }

    const cacheKey = `${url}-${JSON.stringify(safeOptions)}`;

    try {
        // Check cache first
        const cachedData = apiCache.get(cacheKey);
        if (cachedData) return cachedData;

        const response = await fetch(url, {
            ...options,
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        // Handle rate limiting
        if (response.status === 429) {
            const retryAfter = parseInt(response.headers.get('Retry-After') || '1');
            if (retryCount < MAX_RETRIES) {
                await new Promise(resolve =>
                    setTimeout(resolve, retryAfter * BASE_DELAY * Math.pow(2, retryCount))
                );
                return fetchWithRetry(url, options, retryCount + 1);
            }
            throw new Error('Rate limit exceeded');
        }

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        apiCache.set(cacheKey, data);
        return data;

    } catch (error) {
        if (retryCount < MAX_RETRIES) {
            await new Promise(resolve =>
                setTimeout(resolve, BASE_DELAY * Math.pow(2, retryCount))
            );
            return fetchWithRetry(url, options, retryCount + 1);
        }
        throw error;
    }
}