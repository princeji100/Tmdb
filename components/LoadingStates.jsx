import { motion as m } from 'framer-motion';

export const PageLoader = () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
        <m.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-16 w-16 border-4 border-yellow-500 border-t-transparent"
        />
    </div>
);

export const ContentLoader = () => (
    <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-full flex items-center justify-center p-8"
    >
        <m.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"
        />
    </m.div>
);

export const ButtonLoader = () => (
    <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2"
    >
        <m.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
        />
        <span>Loading...</span>
    </m.div>
);