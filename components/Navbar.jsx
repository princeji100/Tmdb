import { Film, Search, Menu, X, Clock, TvIcon, Star, Calendar, Trash2 } from "lucide-react";
import { ContentLoader } from './LoadingStates';
import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion as m, AnimatePresence } from "framer-motion";
import { useSearch } from "../hooks/useSearch";
import { useSearchHistory } from "../hooks/useSearchHistory";


export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);
  const [lastEscapeTime, setLastEscapeTime] = useState(0);

  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { searchHistory, addToHistory, clearHistory } = useSearchHistory();
  const { results, loading, error } = useSearch(searchQuery);

  // Reset selection when search is cleared
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSelectedIndex(-1);
    }
  }, [searchQuery]);

  // Reset selection when dropdown is hidden
  useEffect(() => {
    if (!isDropdownVisible) {
      setSelectedIndex(-1);
    }
  }, [isDropdownVisible]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    // Only handle keyboard navigation if dropdown is visible and a search input is focused
    const isDesktopSearchFocused = document.activeElement === searchRef.current;
    const isMobileSearchFocused = document.activeElement === mobileSearchRef.current;

    if (!isDropdownVisible || (!isDesktopSearchFocused && !isMobileSearchFocused)) {
      return;
    }

    const totalItems = (results?.movies?.length || 0) +
      (results?.actors?.length || 0) +
      (results?.shows?.length || 0) +
      searchHistory.length;

    // If there are no items to navigate, don't handle arrow keys
    if (totalItems === 0 && ['ArrowDown', 'ArrowUp'].includes(e.key)) {
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < totalItems - 1 ? prev + 1 : 0
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev =>
          prev > 0 ? prev - 1 : totalItems - 1
        );
        break;

      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && totalItems > 0) {
          handleResultSelect();
        } else if (searchQuery.trim()) {
          // If no item is selected but there's a query, add to history and search
          addToHistory(searchQuery.trim());
          setIsDropdownVisible(false);
          // Blur the currently focused search input and close mobile search
          if (document.activeElement === searchRef.current) {
            searchRef.current?.blur();
          } else if (document.activeElement === mobileSearchRef.current) {
            mobileSearchRef.current?.blur();
            setIsMobileSearchVisible(false); // Close mobile search bar
          }
        }
        break;

      case "Escape":
        e.preventDefault();
        const now = Date.now();
        const timeSinceLastEscape = now - lastEscapeTime;

        if (isDropdownVisible) {
          // First escape: hide dropdown and reset selection
          setIsDropdownVisible(false);
          setSelectedIndex(-1);
          setLastEscapeTime(now);
        } else if (timeSinceLastEscape < 500 && searchQuery.trim()) {
          // Double escape within 500ms: clear search and close mobile search
          setSearchQuery("");
          setIsMobileSearchVisible(false);
          // Blur the currently focused search input
          if (document.activeElement === searchRef.current) {
            searchRef.current?.blur();
          } else if (document.activeElement === mobileSearchRef.current) {
            mobileSearchRef.current?.blur();
          }
        }
        break;
    }
  };

  // Handle result selection
  const handleResultSelect = () => {
    if (selectedIndex === -1) return;

    let currentIndex = 0;    // Check history items
    if (selectedIndex < searchHistory.length) {
      const query = searchHistory[selectedIndex];
      setSearchQuery(query);
      addToHistory(query);
      // Just set the search query to show results instead of navigating
      setIsDropdownVisible(true);
      // Keep focus on the currently focused search input
      if (document.activeElement === searchRef.current) {
        searchRef.current?.focus();
      } else if (document.activeElement === mobileSearchRef.current) {
        mobileSearchRef.current?.focus();
      }
      return;
    }
    currentIndex += searchHistory.length;

    // Check movies
    if (selectedIndex < currentIndex + (results?.movies?.length || 0)) {
      const movie = results.movies[selectedIndex - currentIndex];
      addToHistory(movie.title);
      navigate(`/movie/${movie.id}`);
      setSearchQuery("");
      setIsDropdownVisible(false);
      setIsMobileSearchVisible(false); // Close mobile search bar
      return;
    }
    currentIndex += results?.movies?.length || 0;    // Check TV shows
    if (selectedIndex < currentIndex + (results?.shows?.length || 0)) {
      const show = results.shows[selectedIndex - currentIndex];
      addToHistory(show.title);
      navigate(`/show/${show.id}`);
      setSearchQuery("");
      setIsDropdownVisible(false);
      setIsMobileSearchVisible(false); // Close mobile search bar
      return;
    }
    currentIndex += results?.shows?.length || 0;

    // Check actors
    if (selectedIndex < currentIndex + (results?.actors?.length || 0)) {
      const actor = results.actors[selectedIndex - currentIndex];
      addToHistory(actor.name);
      navigate(`/actor/${actor.id}`);
      setSearchQuery("");
      setIsDropdownVisible(false);
      setIsMobileSearchVisible(false); // Close mobile search bar
      return;
    }
  };

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInsideDesktopSearch = searchRef.current && searchRef.current.contains(event.target);
      const isClickInsideMobileSearch = mobileSearchRef.current && mobileSearchRef.current.contains(event.target);
      const isClickInsideDropdown = dropdownRef.current && dropdownRef.current.contains(event.target);

      if (!isClickInsideDesktopSearch && !isClickInsideMobileSearch && !isClickInsideDropdown) {
        setIsDropdownVisible(false);
        setSelectedIndex(-1);
        // Close mobile search on outside click
        if (window.innerWidth < 768) {
          setIsMobileSearchVisible(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
    // Reset search when closing menu or opening menu
    if (isMenuOpen) {
      setSearchQuery("");
      setIsDropdownVisible(false);
      setSelectedIndex(-1);
    }
    // Close mobile search when opening menu
    setIsMobileSearchVisible(false);
  };

  const handleResultClick = (callback) => (e) => {
    e.stopPropagation();
    callback();
    setSearchQuery("");
    setIsDropdownVisible(false);
    setIsMobileSearchVisible(false); // Close mobile search bar
  };

  return (<header className="sticky top-0 z-50">
    <nav className="bg-gradient-to-r from-black/90 via-zinc-900/90 to-black/90 backdrop-blur-lg border-b border-zinc-800/50 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main Navbar Content */}
        <div className="h-14 sm:h-16 md:h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo - Enhanced with hover effect */}
          <NavLink
            className="text-white flex items-center gap-2 transform hover:scale-105 transition-all duration-300 hover:text-yellow-400"
            to="/"
            end
          >
            <Film className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-yellow-500 animate-pulse" />
            <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-300 text-transparent bg-clip-text">MovieDB</span>
          </NavLink>

          {/* Search Bar - Improved visibility and interactions */}
          <form className="hidden md:block flex-1 max-w-xl mx-8">
            <div className="relative group">
              <Search
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300
                    ${loading ? "text-yellow-500 animate-pulse" : "text-gray-400 group-focus-within:text-yellow-500"}`}
                aria-hidden="true"
              />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  // Limit input length to prevent performance issues
                  if (value.length <= 100) {
                    setSearchQuery(value);
                    setIsDropdownVisible(value.length > 0);
                  }
                }}
                onFocus={() => {
                  if (searchQuery.length > 0 || searchHistory.length > 0) {
                    setIsDropdownVisible(true);
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search movies, shows, actors..."
                className="w-full pl-12 pr-12 py-3 bg-zinc-800/30 hover:bg-zinc-800/50 
                    rounded-full border border-zinc-700/30 focus:border-yellow-500/50 
                    focus:bg-zinc-800/70 focus:outline-none text-white transition-all duration-300
                    shadow-[0_0_15px_rgba(234,179,8,0.1)] focus:shadow-[0_0_20px_rgba(234,179,8,0.2)]"
                role="combobox"
                aria-expanded={isDropdownVisible}
                aria-controls="search-results-dropdown"
                aria-activedescendant={selectedIndex >= 0 ? `search-result-${selectedIndex}` : undefined}
                aria-label="Search movies, TV shows, and actors"
                aria-describedby={loading ? 'search-status' : undefined}
              />
              {loading && (
                <span id="search-status" className="sr-only" role="status">
                  Searching for {searchQuery}
                </span>
              )}

              {/* Clear Button */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setIsDropdownVisible(false);
                    setSelectedIndex(-1);
                    searchRef.current?.focus();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 
                      text-gray-400 hover:text-yellow-500 transition-colors duration-200
                      hover:bg-zinc-700/50 rounded-full"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Dropdown - Enhanced visuals */}
              <AnimatePresence>
                {isDropdownVisible && (results || searchHistory.length > 0 || loading) && searchQuery && (
                  <m.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-zinc-900/95 
                        backdrop-blur-xl rounded-2xl border border-zinc-800/50 
                        shadow-2xl overflow-hidden"
                  >
                    {/* Loading State */}
                    {loading && (
                      <div className="p-8">
                        <ContentLoader
                          type="search"
                          size="md"
                          message={`Searching for "${searchQuery}"...`}
                          className="p-0"
                        />
                      </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                      <div className="p-8 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                          <X className="w-6 h-6 text-red-500" />
                        </div>
                        <p className="text-sm text-red-400 mb-1">Something went wrong</p>
                        <p className="text-xs text-gray-500">Please try again later</p>
                      </div>
                    )}

                    {/* No Results State with Suggestions */}
                    {!loading && !error && results && !results.movies.length && !results.shows.length && !results.actors.length && (
                      <div className="p-8 flex flex-col items-center justify-center text-center">
                        <Search className="w-8 h-8 text-gray-600 mb-4" />
                        <p className="text-sm text-gray-400 mb-3">No results found for "{searchQuery}"</p>
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>Try:</p>
                          <ul className="list-disc list-inside">
                            <li>Checking for typos</li>
                            <li>Using fewer or different keywords</li>
                            <li>Using a more general search term</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Rest of the dropdown content */}
                    {!loading && !error && (
                      <>
                        {/* Search History Section */}
                        {searchHistory.length > 0 && (
                          <div className="p-3">                            <div className="flex items-center justify-between px-3 py-2">
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>Recent Searches</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                clearHistory();
                              }}
                              className="p-1 hover:bg-zinc-800/50 rounded-full text-gray-400 hover:text-yellow-500 transition-colors"
                              title="Clear search history"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                            {searchHistory.map((query, index) => (
                              <m.button
                                key={query}
                                whileHover={{ x: 4 }} onClick={(e) => {
                                  e.stopPropagation();
                                  addToHistory(query);
                                  // Set the search query to show results
                                  setSearchQuery(query);
                                  setIsDropdownVisible(true);
                                  // Reset selection to avoid keyboard navigation conflicts
                                  setSelectedIndex(-1);
                                  // Keep focus on the currently focused search input
                                  if (document.activeElement === searchRef.current) {
                                    searchRef.current?.focus();
                                  } else if (document.activeElement === mobileSearchRef.current) {
                                    mobileSearchRef.current?.focus();
                                  }
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${selectedIndex === index
                                  ? "bg-yellow-500/20 text-yellow-500"
                                  : "text-white hover:bg-zinc-800"
                                  }`}
                              >
                                {query}
                              </m.button>
                            ))}
                          </div>
                        )}

                        {/* Search Results */}
                        {results && (
                          <>
                            {/* Movies Section */}
                            {results.movies.length > 0 && (
                              <div className="p-3 border-t border-zinc-800/50">
                                <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-400">
                                  <Film className="w-4 h-4" />
                                  <span>Movies</span>
                                </div>
                                {results.movies.map((movie, index) => (
                                  <m.button
                                    key={movie.id}
                                    whileHover={{ x: 4 }}
                                    onClick={handleResultClick(() => {
                                      addToHistory(movie.title);
                                      navigate(`/movie/${movie.id}`);
                                    })}
                                    className={`w-full flex items-center gap-3 p-2 rounded-lg ${selectedIndex === index + searchHistory.length
                                      ? "bg-yellow-500/20 text-yellow-500"
                                      : "text-white hover:bg-zinc-800"
                                      }`}
                                  >
                                    <div className="relative w-8 h-12 rounded overflow-hidden bg-zinc-800">
                                      <img
                                        src={movie.poster}
                                        alt={movie.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.target.src = '/placeholder.jpg';
                                        }}
                                      />
                                    </div>
                                    <div className="text-left flex-1 min-w-0">
                                      <div className="text-sm font-medium truncate">{movie.title}</div>
                                      <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <span>{movie.year}</span>
                                        {movie.rating !== 'N/A' && (
                                          <>
                                            <span>•</span>
                                            <div className="flex items-center">
                                              <Star className="w-3 h-3 text-yellow-500 mr-1" fill="currentColor" />
                                              {movie.rating}
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </m.button>
                                ))}
                              </div>
                            )}

                            {/* TV Shows Section */}
                            {results.shows.length > 0 && (
                              <div className="p-3 border-t border-zinc-800/50">
                                <div className="px-3 py-2 text-xs font-medium text-gray-400">TV Shows</div>
                                {results.shows.map((show, index) => {
                                  const showIndex = searchHistory.length + (results?.movies?.length || 0) + index;
                                  return (
                                    <m.button
                                      key={show.id}
                                      whileHover={{ x: 4 }}
                                      onClick={handleResultClick(() => {
                                        addToHistory(show.title);
                                        navigate(`/show/${show.id}`);
                                      })}
                                      className={`w-full flex items-center gap-3 p-2 rounded-lg ${selectedIndex === showIndex
                                        ? "bg-yellow-500/20 text-yellow-500"
                                        : "text-white hover:bg-zinc-800"
                                        }`}
                                    >
                                      <img
                                        src={show.poster}
                                        alt={show.title}
                                        className="w-8 h-12 rounded object-cover"
                                      />
                                      <div className="text-left">
                                        <div className="text-sm font-medium">{show.title}</div>
                                        <div className="text-xs text-gray-400">
                                          <TvIcon className="w-3 h-3 inline mr-1" />
                                          {show.year}
                                        </div>
                                      </div>
                                    </m.button>
                                  );
                                })}
                              </div>
                            )}

                            {/* Actors Section */}
                            {results.actors.length > 0 && (
                              <div className="p-3 border-t border-zinc-800/50">
                                <div className="px-3 py-2 text-xs font-medium text-gray-400">Actors</div>
                                {results.actors.map((actor, index) => {
                                  const actorIndex = searchHistory.length + (results?.movies?.length || 0) + (results?.shows?.length || 0) + index;
                                  return (
                                    <m.button
                                      key={actor.id}
                                      whileHover={{ x: 4 }}
                                      onClick={handleResultClick(() => {
                                        addToHistory(actor.name);
                                        navigate(`/actor/${actor.id}`);
                                      })}
                                      className={`w-full flex items-center gap-3 p-2 rounded-lg ${selectedIndex === actorIndex
                                        ? "bg-yellow-500/20 text-yellow-500"
                                        : "text-white hover:bg-zinc-800"
                                        }`}
                                    >
                                      <img
                                        src={actor.photo}
                                        alt={actor.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                      />
                                      <div className="text-left">
                                        <div className="text-sm font-medium">{actor.name}</div>
                                        <div className="text-xs text-gray-400">Actor</div>
                                      </div>
                                    </m.button>
                                  );
                                })}
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </form>            {/* Desktop Navigation - Enhanced spacing and interactions */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink
              className={({ isActive }) =>
                `text-sm font-medium transition-all duration-300 relative before:absolute before:left-0 before:-bottom-1 
                  before:h-0.5 before:bg-yellow-500 before:transition-all before:duration-300
                  ${isActive
                  ? "text-yellow-500 before:w-full"
                  : "text-white hover:text-yellow-500 before:w-0 hover:before:w-full"
                }`
              }
              to="/movies"
            >
              Movies
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `text-sm font-medium transition-all duration-300 relative before:absolute before:left-0 before:-bottom-1 
                  before:h-0.5 before:bg-yellow-500 before:transition-all before:duration-300
                  ${isActive
                  ? "text-yellow-500 before:w-full"
                  : "text-white hover:text-yellow-500 before:w-0 hover:before:w-full"
                }`
              }
              to="/top-rated"
            >
              Top Rated
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `text-sm font-medium transition-all duration-300 relative before:absolute before:left-0 before:-bottom-1 
                  before:h-0.5 before:bg-yellow-500 before:transition-all before:duration-300
                  ${isActive
                  ? "text-yellow-500 before:w-full"
                  : "text-white hover:text-yellow-500 before:w-0 hover:before:w-full"
                }`
              }
              to="/coming-soon"
            >
              Coming Soon
            </NavLink>
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Search Toggle Button */}
            <button
              onClick={() => {
                setIsMobileSearchVisible(!isMobileSearchVisible);
                // Focus search input when opening
                if (!isMobileSearchVisible) {
                  setTimeout(() => {
                    mobileSearchRef.current?.focus();
                  }, 100);
                } else {
                  // Clear search when closing
                  setSearchQuery("");
                  setIsDropdownVisible(false);
                  setSelectedIndex(-1);
                }
              }}
              className={`p-2.5 sm:p-2 transition-all duration-300 rounded-lg hover:bg-zinc-800/50 
                  hover:scale-105 active:scale-95 touch-manipulation ${isMobileSearchVisible
                  ? "text-yellow-500 bg-zinc-800/50"
                  : "text-white hover:text-yellow-500"
                }`}
              aria-label={isMobileSearchVisible ? "Close search" : "Open search"}
            >
              {isMobileSearchVisible ? <X className="w-5 h-5 sm:w-4 sm:h-4" /> : <Search className="w-5 h-5 sm:w-4 sm:h-4" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="p-2.5 sm:p-2 text-white hover:text-yellow-500 
                  transition-all duration-300 rounded-lg hover:bg-zinc-800/50 
                  hover:scale-105 active:scale-95 touch-manipulation"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar - Toggle Visible on Mobile */}
        <div className={`md:hidden border-t border-zinc-800/50 transition-all duration-300 ease-in-out ${isMobileSearchVisible
          ? 'max-h-96 opacity-100'
          : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
          <div className="container mx-auto px-4 py-3">
            <div className="relative group">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors duration-300
                    ${loading ? "text-yellow-500 animate-pulse" : "text-gray-400 group-focus-within:text-yellow-500"}`}
              />
              <input
                ref={mobileSearchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 100) {
                    setSearchQuery(value);
                    setIsDropdownVisible(value.length > 0);
                  }
                }}
                onFocus={() => {
                  if (searchQuery.length > 0 || searchHistory.length > 0) {
                    setIsDropdownVisible(true);
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search movies, shows, actors..."
                className="mobile-search-input w-full pl-9 pr-10 py-2.5 bg-zinc-800/30 rounded-lg border border-zinc-700/30 
                    focus:outline-none focus:border-yellow-500/50 text-white transition-all duration-300
                    focus:bg-zinc-800/50 focus:shadow-[0_0_15px_rgba(234,179,8,0.1)] text-sm"
                role="combobox"
                aria-expanded={isDropdownVisible}
                aria-controls="mobile-search-results-dropdown-main"
                aria-activedescendant={selectedIndex >= 0 ? `mobile-search-result-main-${selectedIndex}` : undefined}
              />

              {/* Mobile Clear Button */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setIsDropdownVisible(false);
                    setSelectedIndex(-1);
                    mobileSearchRef.current?.focus();
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 
                      text-gray-400 hover:text-yellow-500 transition-colors duration-200
                      hover:bg-zinc-700/50 rounded-full"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}

              {/* Mobile Search Dropdown - Main */}
              <AnimatePresence>
                {isDropdownVisible && (results || searchHistory.length > 0 || loading) && searchQuery && (
                  <m.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="mobile-search-dropdown absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 
                        backdrop-blur-xl rounded-xl border border-zinc-800/50 
                        shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto"
                    id="mobile-search-results-dropdown-main"
                  >
                    {/* Loading State */}
                    {loading && (
                      <div className="p-6">
                        <ContentLoader
                          type="search"
                          size="sm"
                          message="Searching..."
                          className="p-0"
                        />
                      </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                      <div className="p-6 flex flex-col items-center justify-center text-center">
                        <X className="w-6 h-6 text-red-500 mb-3" />
                        <p className="text-sm text-red-400">Something went wrong</p>
                      </div>
                    )}

                    {/* No Results */}
                    {!loading && !error && results && !results.movies.length && !results.shows.length && !results.actors.length && (
                      <div className="p-6 flex flex-col items-center justify-center text-center">
                        <Search className="w-6 h-6 text-gray-600 mb-3" />
                        <p className="text-sm text-gray-400">No results found</p>
                      </div>
                    )}

                    {/* Search Results */}
                    {!loading && !error && (
                      <>
                        {/* Search History */}
                        {searchHistory.length > 0 && (
                          <div className="p-3">
                            <div className="flex items-center justify-between px-2 py-1 mb-2">
                              <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                                <Clock className="w-3 h-3" />
                                <span>Recent Searches</span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearHistory();
                                }}
                                className="p-1 hover:bg-zinc-800/50 rounded text-gray-400 hover:text-yellow-500"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            {searchHistory.slice(0, 3).map((query, index) => (
                              <button
                                key={query}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSearchQuery(query);
                                  addToHistory(query);
                                  setIsDropdownVisible(true);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 ${selectedIndex === index
                                  ? "bg-yellow-500/20 text-yellow-500"
                                  : "text-white hover:bg-zinc-800"
                                  }`}
                              >
                                {query}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Movies */}
                        {results?.movies?.length > 0 && (
                          <div className="p-3 border-t border-zinc-800/50">
                            <div className="px-2 py-1 text-xs font-medium text-gray-400 mb-2">Movies</div>
                            {results.movies.slice(0, 4).map((movie, index) => {
                              const movieIndex = searchHistory.length + index;
                              return (
                                <button
                                  key={movie.id}
                                  onClick={handleResultClick(() => {
                                    addToHistory(movie.title);
                                    navigate(`/movie/${movie.id}`);
                                  })}
                                  className={`w-full flex items-center gap-3 p-2 rounded-lg text-sm mb-1 ${selectedIndex === movieIndex
                                    ? "bg-yellow-500/20 text-yellow-500"
                                    : "text-white hover:bg-zinc-800"
                                    }`}
                                >
                                  <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    className="w-8 h-12 rounded object-cover"
                                  />
                                  <div className="text-left">
                                    <div className="font-medium">{movie.title}</div>
                                    <div className="text-xs text-gray-400">{movie.year}</div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* TV Shows */}
                        {results?.shows?.length > 0 && (
                          <div className="p-3 border-t border-zinc-800/50">
                            <div className="px-2 py-1 text-xs font-medium text-gray-400 mb-2">TV Shows</div>
                            {results.shows.slice(0, 4).map((show, index) => {
                              const showIndex = searchHistory.length + (results?.movies?.length || 0) + index;
                              return (
                                <button
                                  key={show.id}
                                  onClick={handleResultClick(() => {
                                    addToHistory(show.title);
                                    navigate(`/show/${show.id}`);
                                  })}
                                  className={`w-full flex items-center gap-3 p-2 rounded-lg text-sm mb-1 ${selectedIndex === showIndex
                                    ? "bg-yellow-500/20 text-yellow-500"
                                    : "text-white hover:bg-zinc-800"
                                    }`}
                                >
                                  <img
                                    src={show.poster}
                                    alt={show.title}
                                    className="w-8 h-12 rounded object-cover"
                                  />
                                  <div className="text-left">
                                    <div className="font-medium">{show.title}</div>
                                    <div className="text-xs text-gray-400">
                                      <TvIcon className="w-3 h-3 inline mr-1" />
                                      {show.year}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Actors */}
                        {results?.actors?.length > 0 && (
                          <div className="p-3 border-t border-zinc-800/50">
                            <div className="px-2 py-1 text-xs font-medium text-gray-400 mb-2">Actors</div>
                            {results.actors.slice(0, 4).map((actor, index) => {
                              const actorIndex = searchHistory.length + (results?.movies?.length || 0) + (results?.shows?.length || 0) + index;
                              return (
                                <button
                                  key={actor.id}
                                  onClick={handleResultClick(() => {
                                    addToHistory(actor.name);
                                    navigate(`/actor/${actor.id}`);
                                  })}
                                  className={`w-full flex items-center gap-3 p-2 rounded-lg text-sm mb-1 ${selectedIndex === actorIndex
                                    ? "bg-yellow-500/20 text-yellow-500"
                                    : "text-white hover:bg-zinc-800"
                                    }`}
                                >
                                  <img
                                    src={actor.photo}
                                    alt={actor.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                  <div className="text-left">
                                    <div className="font-medium">{actor.name}</div>
                                    <div className="text-xs text-gray-400">Actor</div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Enhanced animations and styling */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out
              ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="py-4 space-y-4 px-2">
            <NavLink
              className={({ isActive }) =>
                `block py-3 px-4 rounded-lg transition-all duration-300 ${isActive
                  ? "text-yellow-500 bg-yellow-500/10 font-medium"
                  : "text-white hover:text-yellow-500 hover:bg-zinc-800/50"
                }`
              }
              to="/movies"
              onClick={toggleMenu}
            >
              <div className="flex items-center gap-3">
                <Film className="w-5 h-5" />
                <span>Movies</span>
              </div>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `block py-3 px-4 rounded-lg transition-all duration-300 ${isActive
                  ? "text-yellow-500 bg-yellow-500/10 font-medium"
                  : "text-white hover:text-yellow-500 hover:bg-zinc-800/50"
                }`
              }
              to="/top-rated"
              onClick={toggleMenu}
            >
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5" />
                <span>Top Rated</span>
              </div>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `block py-3 px-4 rounded-lg transition-all duration-300 ${isActive
                  ? "text-yellow-500 bg-yellow-500/10 font-medium"
                  : "text-white hover:text-yellow-500 hover:bg-zinc-800/50"
                }`
              }
              to="/coming-soon"
              onClick={toggleMenu}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5" />
                <span>Coming Soon</span>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  </header>
  );
}

export default Navbar;