import { motion as m } from 'framer-motion';
import { Loader2, Film, Search, Download, RefreshCw } from 'lucide-react';

// Enhanced Page Loader with multiple variants
export const PageLoader = ({ variant = 'default', message = 'Loading...' }) => {
    const variants = {
        default: (
            <m.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="rounded-full h-16 w-16 border-4 border-yellow-500 border-t-transparent"
            />
        ),
        dots: (
            <div className="flex space-x-2">
                {[0, 1, 2].map((i) => (
                    <m.div
                        key={i}
                        animate={{ y: [0, -20, 0] }}
                        transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut"
                        }}
                        className="w-4 h-4 bg-yellow-500 rounded-full"
                    />
                ))}
            </div>
        ),
        pulse: (
            <m.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-yellow-500 rounded-full opacity-75"
            />
        )
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center">
            <div className="mb-6">
                {variants[variant]}
            </div>
            <m.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-400 text-lg"
            >
                {message}
            </m.p>
        </div>
    );
};

// Enhanced Content Loader with context-aware icons
export const ContentLoader = ({
    type = 'default',
    size = 'md',
    message = 'Loading content...',
    className = ''
}) => {
    const sizes = {
        sm: 'h-8 w-8',
        md: 'h-12 w-12',
        lg: 'h-16 w-16'
    };

    const icons = {
        default: Loader2,
        movie: Film,
        search: Search,
        download: Download,
        refresh: RefreshCw
    };

    const Icon = icons[type] || icons.default;

    return (
        <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`w-full h-full flex flex-col items-center justify-center p-8 ${className}`}
        >
            <Icon
                className={`${sizes[size]} text-yellow-500 animate-spin mb-4`}
            />
            <p className="text-gray-400 text-sm">{message}</p>
        </m.div>
    );
};

// Enhanced Button Loader with different states
export const ButtonLoader = ({
    size = 'sm',
    text = 'Loading...',
    variant = 'spinner',
    className = ''
}) => {
    const sizes = {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    const variants = {
        spinner: (
            <m.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className={`${sizes[size]} border-2 border-current border-t-transparent rounded-full`}
            />
        ),
        dots: (
            <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                    <m.div
                        key={i}
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut"
                        }}
                        className="w-1 h-1 bg-current rounded-full"
                    />
                ))}
            </div>
        ),
        pulse: (
            <m.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                className={`${sizes[size]} bg-current rounded-full`}
            />
        )
    };

    return (
        <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex items-center gap-2 ${className}`}
        >
            {variants[variant]}
            <span>{text}</span>
        </m.div>
    );
};

// New: Inline Loader for small spaces
export const InlineLoader = ({ size = 'sm', className = '' }) => {
    const sizes = {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-5 h-5'
    };

    return (
        <m.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={`${sizes[size]} border-2 border-yellow-500 border-t-transparent rounded-full inline-block ${className}`}
        />
    );
};

// New: Progress Loader with percentage
export const ProgressLoader = ({ progress = 0, message = 'Loading...' }) => (
    <div className="w-full max-w-md mx-auto">
        <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm">{message}</span>
            <span className="text-yellow-500 text-sm font-medium">{progress}%</span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-2">
            <m.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-yellow-500 h-2 rounded-full"
            />
        </div>
    </div>
);

// New: Skeleton Loader for text content
export const TextSkeleton = ({ lines = 3, className = '' }) => (
    <div className={`space-y-3 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
            <div
                key={i}
                className={`h-4 bg-zinc-800/50 rounded animate-pulse ${i === lines - 1 ? 'w-3/4' : 'w-full'
                    }`}
            />
        ))}
    </div>
);

// New: Card Skeleton for movie/actor cards
export const CardSkeleton = ({ className = '' }) => (
    <div className={`bg-zinc-900/50 rounded-lg overflow-hidden ${className}`}>
        <div className="aspect-[2/3] bg-zinc-800/50 animate-pulse" />
        <div className="p-4 space-y-3">
            <div className="h-4 bg-zinc-800/50 rounded animate-pulse" />
            <div className="h-3 bg-zinc-800/50 rounded animate-pulse w-3/4" />
        </div>
    </div>
);