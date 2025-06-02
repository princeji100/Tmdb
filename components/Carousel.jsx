import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Movie from './Movie';

const Carousel = ({ title, movies }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const containerRef = useRef(null);

    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

    // Calculate slides per view based on screen width
    const [slidesPerView, setSlidesPerView] = useState(4);

    useEffect(() => {
        const updateSlidesPerView = () => {
            if (window.innerWidth < 640) {
                setSlidesPerView(1);
            } else if (window.innerWidth < 768) {
                setSlidesPerView(2);
            } else if (window.innerWidth < 1024) {
                setSlidesPerView(3);
            } else {
                setSlidesPerView(4);
            }
        };

        updateSlidesPerView();
        window.addEventListener('resize', updateSlidesPerView);
        return () => window.removeEventListener('resize', updateSlidesPerView);
    }, []);

    const maxIndex = movies.length - slidesPerView;

    const nextSlide = () => {
        setCurrentIndex(current => current >= maxIndex ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrentIndex(current => current <= 0 ? maxIndex : current - 1);
    };

    // Touch handlers
    const onTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            prevSlide();
        }

        setTouchStart(null);
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

    return (
        <div className="py-8 px-4">
            {/* Title */}
            <div className="mb-6">
                <div className="text-2xl font-bold text-white">{title}</div>
            </div>

            {/* Carousel Container with Navigation */}
            <div className="relative group/nav">
                {/* Left Navigation Button - Hidden on Mobile */}
                <button
                    onClick={prevSlide}
                    className="hidden md:block absolute -left-16 top-1/2 -translate-y-1/2 p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white transition-all opacity-0 group-hover/nav:opacity-100"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>

                {/* Movies Carousel */}
                <div
                    ref={containerRef}
                    className="relative overflow-hidden touch-pan-x select-none"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                >
                    <div
                        className={`flex transition-transform duration-500 ease-out ${isDragging ? 'transition-none' : ''
                            }`}
                        style={{
                            transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)`,
                            willChange: 'transform'
                        }}
                    >
                        {movies.map((movie) => (
                            <div
                                key={movie.id}
                                className={`flex-shrink-0 px-2 md:px-3 group/movie
                                    w-full 
                                    sm:w-1/2 
                                    md:w-1/3 
                                    lg:w-1/4`}
                                style={{ touchAction: 'pan-x' }}
                            >
                                <Movie movie={movie} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Navigation Button - Hidden on Mobile */}
                <button
                    onClick={nextSlide}
                    className="hidden md:block absolute -right-16 top-1/2 -translate-y-1/2 p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white transition-all opacity-0 group-hover/nav:opacity-100"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            </div>

            {/* Updated Dots Indicator - Visible on all screens */}
            <div className="flex justify-center gap-1.5 mt-6">
                {[...Array(maxIndex + 1)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`transition-all duration-300 rounded-full
                            ${index === currentIndex
                                ? 'bg-yellow-500 w-6 sm:w-8 h-1.5 sm:h-2'
                                : 'bg-zinc-600 w-1.5 sm:w-2 h-1.5 sm:h-2'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;