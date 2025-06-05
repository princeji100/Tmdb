import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Movie from './Movie';

const Carousel = ({ title, movies, loading = false, error = null }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchStartY, setTouchStartY] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef(null);

    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

    // Calculate slides per view based on screen width with enhanced breakpoints
    const [slidesPerView, setSlidesPerView] = useState(4);

    useEffect(() => {
        const updateSlidesPerView = () => {
            const width = window.innerWidth;
            if (width < 480) {
                setSlidesPerView(1.2); // Show partial next slide on very small screens
            } else if (width < 640) {
                setSlidesPerView(1.5); // Show partial next slide
            } else if (width < 768) {
                setSlidesPerView(2.2);
            } else if (width < 1024) {
                setSlidesPerView(3.2);
            } else if (width < 1280) {
                setSlidesPerView(4);
            } else {
                setSlidesPerView(5); // Show more on very large screens
            }
        };

        updateSlidesPerView();
        window.addEventListener('resize', updateSlidesPerView);
        return () => window.removeEventListener('resize', updateSlidesPerView);
    }, []);

    const maxIndex = Math.max(0, Math.ceil(movies.length - Math.floor(slidesPerView)));

    const nextSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(current => current >= maxIndex ? 0 : current + 1);
        setTimeout(() => setIsTransitioning(false), 500);
    };

    const prevSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(current => current <= 0 ? maxIndex : current - 1);
        setTimeout(() => setIsTransitioning(false), 500);
    };

    // Enhanced touch handlers that don't interfere with vertical scrolling
    const onTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
        setTouchStartY(e.targetTouches[0].clientY);
        setTouchEnd(null);
    };

    const onTouchMove = (e) => {
        if (!touchStart || !touchStartY) return;

        const currentTouch = e.targetTouches[0];
        setTouchEnd(currentTouch.clientX);

        // Calculate horizontal and vertical distances
        const horizontalDistance = Math.abs(currentTouch.clientX - touchStart);
        const verticalDistance = Math.abs(currentTouch.clientY - touchStartY);

        // Only prevent default if horizontal swipe is more significant than vertical
        // and the horizontal distance is meaningful
        if (horizontalDistance > verticalDistance && horizontalDistance > 15) {
            e.preventDefault();
        }
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) {
            setTouchStart(null);
            setTouchStartY(null);
            setTouchEnd(null);
            return;
        }

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            prevSlide();
        }

        setTouchStart(null);
        setTouchStartY(null);
        setTouchEnd(null);
    };

    // Mouse drag handlers
    const onMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
    };

    const onMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        containerRef.current.scrollLeft = scrollLeft - walk;
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    // Loading state
    if (loading) {
        return (
            <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-6 sm:mb-8">
                    <div className="carousel-skeleton h-8 w-48 rounded mb-2"></div>
                    <div className="carousel-skeleton h-4 w-64 rounded"></div>
                </div>
                <div className="flex gap-4 overflow-hidden">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="flex-shrink-0 w-1/4">
                            <div className="carousel-skeleton aspect-[2/3] rounded-lg"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
                        {title}
                    </h2>
                </div>
                <div className="glass-morphism rounded-lg p-8 text-center">
                    <div className="text-red-400 text-4xl mb-4">⚠️</div>
                    <div className="text-white text-lg mb-2">Failed to load movies</div>
                    <div className="text-gray-400 text-sm">{error}</div>
                </div>
            </div>
        );
    }

    // Empty state
    if (!movies || movies.length === 0) {
        return (
            <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
                        {title}
                    </h2>
                </div>
                <div className="glass-morphism rounded-lg p-8 text-center">
                    <div className="text-gray-400 text-4xl mb-4">🎬</div>
                    <div className="text-white text-lg mb-2">No movies available</div>
                    <div className="text-gray-400 text-sm">Check back later for new content</div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
            {/* Enhanced Title Section */}
            <div className="mb-6 sm:mb-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gradient animate-fadeIn">
                        {title}
                    </h2>
                    {/* Progress indicator for mobile */}
                    <div className="flex sm:hidden items-center gap-2 text-white/60 text-xs">
                        <span>{currentIndex + 1}</span>
                        <div className="w-8 h-1 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-yellow-500 transition-all duration-300 rounded-full"
                                style={{ width: `${((currentIndex + 1) / (maxIndex + 1)) * 100}%` }}
                            />
                        </div>
                        <span>{maxIndex + 1}</span>
                    </div>
                </div>
                {/* Subtitle or description if needed */}
                <div className="mt-2 text-gray-400 text-sm sm:text-base">
                    Discover amazing movies in this collection
                </div>
            </div>

            {/* Enhanced Carousel Container with Navigation */}
            <div
                className="relative group/nav"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Enhanced Left Navigation Button */}
                <button
                    onClick={prevSlide}
                    disabled={isTransitioning}
                    className={`hidden md:flex absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full glass-morphism text-white transition-all duration-300 transform hover:scale-110 focus-visible ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                        } ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>

                {/* Enhanced Movies Carousel */}
                <div
                    ref={containerRef}
                    className="relative overflow-hidden select-none rounded-lg"
                    style={{ touchAction: 'pan-y pinch-zoom' }}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                >
                    {/* Gradient fade edges */}
                    <div className="absolute left-0 top-0 w-8 sm:w-16 h-full bg-gradient-to-r from-black/50 to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 w-8 sm:w-16 h-full bg-gradient-to-l from-black/50 to-transparent z-10 pointer-events-none" />

                    <div
                        className={`flex transition-all duration-500 ease-out ${isDragging ? 'transition-none cursor-grabbing' : 'cursor-grab'
                            } ${isTransitioning ? 'pointer-events-none' : ''}`}
                        style={{
                            transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)`,
                            willChange: 'transform'
                        }}
                    >
                        {movies.map((movie, index) => (
                            <div
                                key={movie.id}
                                className="carousel-item flex-shrink-0 px-1.5 sm:px-2 md:px-3 group/movie transition-all duration-300 hover:scale-105 hover:z-10"
                                style={{
                                    width: `${100 / slidesPerView}%`,
                                    touchAction: 'pan-y',
                                    animationDelay: `${index * 0.1}s`
                                }}
                            >
                                <div className="relative group movie-item-hover touch-feedback">
                                    <Movie movie={movie} />
                                    {/* Enhanced hover overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg pointer-events-none">
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <div className="text-white text-sm font-medium mb-1 line-clamp-1">
                                                {movie.title}
                                            </div>
                                            <div className="text-yellow-400 text-xs">
                                                ⭐ {movie.rating || 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Enhanced Right Navigation Button */}
                <button
                    onClick={nextSlide}
                    disabled={isTransitioning}
                    className={`hidden md:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full glass-morphism text-white transition-all duration-300 transform hover:scale-110 focus-visible ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                        } ${currentIndex >= maxIndex ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
            </div>

            {/* Enhanced Dots Indicator */}
            <div className="flex justify-center mt-6 sm:mt-8">
                <div className="glass-morphism px-4 py-2 rounded-full">
                    <div className="flex items-center gap-2 sm:gap-3">
                        {[...Array(maxIndex + 1)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    if (!isTransitioning) {
                                        setIsTransitioning(true);
                                        setCurrentIndex(index);
                                        setTimeout(() => setIsTransitioning(false), 500);
                                    }
                                }}
                                disabled={isTransitioning}
                                className={`transition-all duration-300 rounded-full focus-visible ${index === currentIndex
                                    ? 'bg-yellow-500 w-6 sm:w-8 h-2 sm:h-2.5 shadow-lg shadow-yellow-500/50'
                                    : 'bg-gray-400/60 hover:bg-gray-300 w-2 sm:w-2.5 h-2 sm:h-2.5'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile swipe hint */}
            <div className="flex sm:hidden justify-center mt-4">
                <div className="flex items-center gap-2 text-white/40 text-xs animate-pulse-slow">
                    <div className="flex gap-1">
                        <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span>Swipe to explore</span>
                </div>
            </div>
        </div>
    );
};

export default Carousel;