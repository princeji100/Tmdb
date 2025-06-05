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
        <div className="relative w-full h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]">
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/30 via-zinc-900/50 to-black animate-pulse" />
            <div className="relative z-10 h-full flex items-center justify-center">
                <div className="container mx-auto px-4 sm:px-6 md:px-8">
                    <div className="flex flex-col items-center justify-center text-center w-full max-w-4xl mx-auto">
                        {/* Photo Skeleton */}
                        <div className="w-28 sm:w-32 md:w-40 lg:w-48 xl:w-56 shrink-0 mx-auto mb-4 sm:mb-6 md:mb-8">
                            <div className="aspect-[3/4] bg-zinc-800/50 rounded-xl animate-pulse ring-2 ring-white/20" />
                        </div>

                        {/* Info Skeleton */}
                        <div className="w-full space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 flex flex-col items-center">
                            {/* Name Skeleton */}
                            <div className="h-8 sm:h-10 md:h-12 lg:h-14 xl:h-16 bg-zinc-800/50 rounded-lg w-4/5 sm:w-3/4 md:w-2/3 max-w-lg animate-pulse" />

                            {/* Info badges skeleton */}
                            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4">
                                {[1, 2].map(i => (
                                    <div key={i} className="h-6 sm:h-7 md:h-8 lg:h-9 bg-zinc-800/50 rounded-full w-24 sm:w-28 md:w-32 lg:w-36 animate-pulse" />
                                ))}
                            </div>

                            {/* Biography preview skeleton */}
                            <div className="space-y-2 sm:space-y-3 w-full max-w-2xl px-4 sm:px-0">
                                {[1, 2, 3].map(i => (
                                    <div
                                        key={i}
                                        className="h-3 sm:h-4 md:h-5 lg:h-6 bg-zinc-800/50 rounded animate-pulse mx-auto"
                                        style={{ width: `${Math.max(70, 100 - (i * 10))}%` }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Filmography Skeleton */}
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
            <div className="h-8 sm:h-9 md:h-10 bg-zinc-800/50 rounded-lg w-36 sm:w-44 md:w-52 mb-6 sm:mb-7 md:mb-8 animate-pulse" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                    <div key={i} className="space-y-2 sm:space-y-3">
                        <div className="aspect-[2/3] bg-zinc-800/50 rounded-lg animate-pulse w-full" />
                        <div className="h-4 sm:h-5 bg-zinc-800/50 rounded w-3/4 animate-pulse" />
                        <div className="h-3 sm:h-4 bg-zinc-800/50 rounded w-1/2 animate-pulse" />
                    </div>
                ))}
            </div>
        </div>

        {/* Additional Skeleton Sections */}
        <div className="container mx-auto px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 md:pt-12 lg:pt-16 pb-6 sm:pb-8 md:pb-12 lg:pb-16">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] xl:grid-cols-[1fr_350px] gap-6 sm:gap-8 md:gap-10 lg:gap-12">
                    {/* Main Content Skeleton */}
                    <div className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12 order-2 lg:order-1">
                        {/* Biography Skeleton */}
                        <section className="text-left">
                            <div className="h-6 sm:h-7 md:h-8 lg:h-9 bg-zinc-800/50 rounded-lg w-24 sm:w-28 md:w-32 lg:w-36 mb-3 sm:mb-4 md:mb-5 lg:mb-6 animate-pulse" />
                            <div className="space-y-2 sm:space-y-3 md:space-y-4">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div
                                        key={i}
                                        className="h-3 sm:h-4 md:h-5 bg-zinc-800/50 rounded animate-pulse"
                                        style={{ width: `${Math.max(60, 100 - (i * 8))}%` }}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Known For Skeleton */}
                        <section className="text-left">
                            <div className="h-6 sm:h-7 md:h-8 lg:h-9 bg-zinc-800/50 rounded-lg w-28 sm:w-32 md:w-36 lg:w-40 mb-4 sm:mb-5 md:mb-6 lg:mb-7 animate-pulse" />
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <div key={i} className="space-y-2 sm:space-y-3">
                                        <div className="aspect-[2/3] bg-zinc-800/50 rounded-lg animate-pulse w-full" />
                                        <div className="h-3 sm:h-4 md:h-5 bg-zinc-800/50 rounded w-4/5 animate-pulse" />
                                        <div className="h-2 sm:h-3 md:h-4 bg-zinc-800/50 rounded w-3/5 animate-pulse" />
                                        <div className="h-2 sm:h-3 md:h-4 bg-zinc-800/50 rounded w-2/5 animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Skeleton */}
                    <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 order-1 lg:order-2">
                        {/* Personal Info Skeleton */}
                        <div className="bg-zinc-900/60 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 backdrop-blur-sm border border-white/10 w-full">
                            <div className="h-5 sm:h-6 md:h-7 lg:h-8 bg-zinc-800/50 rounded-lg w-24 sm:w-28 md:w-32 lg:w-36 mb-4 sm:mb-5 md:mb-6 animate-pulse" />
                            <div className="space-y-3 sm:space-y-4">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="space-y-1 sm:space-y-2">
                                        <div className="h-3 sm:h-4 bg-zinc-800/50 rounded w-16 sm:w-20 md:w-24 animate-pulse" />
                                        <div className="h-4 sm:h-5 md:h-6 bg-zinc-800/50 rounded w-28 sm:w-32 md:w-40 lg:w-48 animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Social Media Skeleton */}
                        <div className="bg-zinc-900/60 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 backdrop-blur-sm border border-white/10 w-full">
                            <div className="h-5 sm:h-6 md:h-7 lg:h-8 bg-zinc-800/50 rounded-lg w-20 sm:w-24 md:w-28 lg:w-32 mb-4 sm:mb-5 md:mb-6 animate-pulse" />
                            <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 bg-zinc-800/50 rounded-full animate-pulse" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
);

export default ActorDetailsSkeleton;