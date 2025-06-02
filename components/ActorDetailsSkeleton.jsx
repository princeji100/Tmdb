import { motion } from "framer-motion";
const ActorDetailsSkeleton = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-black overflow-x-hidden"
    >
        {/* Hero Section Skeleton */}
        <div className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] w-full">
            <div className="absolute inset-0 bg-gradient-radial from-zinc-800/50 to-black animate-pulse" />
            <div className="relative container mx-auto px-4 h-full flex items-end pb-8 sm:pb-16">
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 w-full">
                    {/* Photo Skeleton */}
                    <div className="w-32 sm:w-44 md:w-60 shrink-0 mx-auto sm:mx-0">
                        <div className="aspect-[3/4] bg-zinc-800/50 rounded-xl animate-pulse" />
                    </div>

                    {/* Info Skeleton */}
                    <div className="w-full max-w-full sm:max-w-2xl mt-6 sm:mt-0 space-y-6">
                        <div className="h-12 bg-zinc-800/50 rounded-lg w-3/4 animate-pulse" />
                        <div className="flex gap-4">
                            {[1, 2].map(i => (
                                <div key={i} className="h-8 bg-zinc-800/50 rounded-full w-32 animate-pulse" />
                            ))}
                        </div>
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div
                                    key={i}
                                    className="h-4 bg-zinc-800/50 rounded animate-pulse"
                                    style={{ width: `${100 - (i * 15)}%` }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Filmography Skeleton */}
        <div className="container mx-auto px-4 py-10 sm:py-16">
            <div className="h-10 bg-zinc-800/50 rounded-lg w-48 mb-8 animate-pulse" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                    <div key={i} className="space-y-3">
                        <div className="aspect-[2/3] bg-zinc-800/50 rounded-lg animate-pulse" />
                        <div className="h-5 bg-zinc-800/50 rounded w-3/4 animate-pulse" />
                        <div className="h-4 bg-zinc-800/50 rounded w-1/2 animate-pulse" />
                    </div>
                ))}
            </div>
        </div>

        {/* Additional Skeleton Sections */}
        <div className="container mx-auto px-4 py-10 sm:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
                {/* Main Content Skeleton */}
                <div className="space-y-12">
                    {/* Biography Skeleton */}
                    <section>
                        <div className="h-10 bg-zinc-800/50 rounded-lg w-48 mb-6 animate-pulse" />
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map(i => (
                                <div
                                    key={i}
                                    className="h-4 bg-zinc-800/50 rounded animate-pulse"
                                    style={{ width: `${100 - (i * 5)}%` }}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Known For Skeleton */}
                    <section>
                        <div className="h-10 bg-zinc-800/50 rounded-lg w-48 mb-8 animate-pulse" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                                <div key={i} className="space-y-3">
                                    <div className="aspect-[2/3] bg-zinc-800/50 rounded-lg animate-pulse" />
                                    <div className="h-5 bg-zinc-800/50 rounded w-3/4 animate-pulse" />
                                    <div className="h-4 bg-zinc-800/50 rounded w-1/2 animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar Skeleton */}
                <div className="space-y-8">
                    <div className="bg-zinc-900/60 rounded-xl p-6">
                        <div className="h-8 bg-zinc-800/50 rounded-lg w-40 mb-6 animate-pulse" />
                        <div className="space-y-6">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="space-y-2">
                                    <div className="h-4 bg-zinc-800/50 rounded w-24 animate-pulse" />
                                    <div className="h-6 bg-zinc-800/50 rounded w-48 animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
);

export default ActorDetailsSkeleton;