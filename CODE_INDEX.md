# Code Index - NullClass Movie App

## Project Overview
- **Name**: nullclass
- **Type**: React Movie Discovery Application
- **Framework**: React 19.1.0 + Vite
- **Styling**: Tailwind CSS 4.1.7
- **Animation**: Framer Motion 12.12.1
- **Icons**: Lucide React
- **Routing**: React Router DOM 7.6.0

## Project Structure

### Root Files
- `package.json` - Project dependencies and scripts
- `vite.config.js` - Vite configuration
- `eslint.config.js` - ESLint configuration
- `index.html` - Main HTML entry point
- `.gitignore` - Git ignore rules

### Source Code (`src/`)
- `main.jsx` - Application entry point
- `App.jsx` - Main application component with category navigation
- `index.css` - Global styles

### Components (`components/`)
- `Hero.jsx` - Hero section component
- `Navbar.jsx` - Navigation bar component
- `MovieList.jsx` - Movie listing with filters and pagination
- `Movie.jsx` - Individual movie card component
- `MovieDetails.jsx` - Detailed movie view
- `MovieSkeleton.jsx` - Loading skeleton for movies
- `Carousel.jsx` - Movie carousel component
- `ActorDetails.jsx` - Actor information display
- `ActorDetailsSkeleton.jsx` - Loading skeleton for actors
- `ShowDetails.jsx` - TV show details component
- `TopRated.jsx` - Top rated movies section
- `ComingSoon.jsx` - Upcoming movies section
- `ErrorBoundary.jsx` - Error handling wrapper
- `LoadingStates.jsx` - Various loading state components

### Custom Hooks (`hooks/`)
- `useA11y.js` - Accessibility utilities
- `useActorDetails.js` - Actor data fetching
- `useDebounce.js` - Debouncing utility
- `useMovieDetails.js` - Movie data fetching
- `usePaginatedData.js` - Pagination logic
- `useSearch.js` - Search functionality
- `useSearchHistory.js` - Search history management
- `useShowDetails.js` - TV show data fetching
- `useTrendingMovies.js` - Trending movies data

### Services (`services/`)
- `useFetch.js` - Generic data fetching hook

### Utilities (`utilities/`)
- `fetchWithRetry.js` - Retry logic for failed requests
- `performance.js` - Performance optimization utilities (lazy loading, image preloading)

### Configuration Files
- `.vscode/settings.json` - VS Code workspace settings

## Key Features

### 1. Movie Discovery
- **Trending Movies**: Daily trending content
- **Top Rated**: Highest rated movies
- **Coming Soon**: Upcoming releases
- **Award Winners**: Popular/award-winning content

### 2. Advanced Filtering (MovieList.jsx)
- **Genre Filtering**: Multiple genre selection
- **Year Filtering**: Year range selection (1990-current)
- **Rating Filtering**: Minimum rating thresholds (5+, 6+, 7+, 8+, 9+)
- **Real-time Updates**: Instant filter application

### 3. Performance Optimizations
- **Lazy Loading**: Images load as they enter viewport
- **Image Preloading**: Optimized image loading
- **Skeleton Loading**: Smooth loading states
- **Request Debouncing**: Optimized API calls
- **Error Boundaries**: Graceful error handling

### 4. Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: Mobile interaction support
- **Adaptive Layouts**: Grid systems that adapt to screen size

### 5. Accessibility Features
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: ARIA labels and descriptions
- **Focus Management**: Proper focus handling
- **Color Contrast**: Accessible color schemes

## API Integration
- **TMDB API**: The Movie Database integration
- **Environment Variables**: 
  - `VITE_TMDB_BASE_URL`
  - `VITE_TMDB_API_KEY`

## State Management
- **React Hooks**: useState, useEffect, useMemo, useCallback
- **Custom Hooks**: Reusable logic abstraction
- **Local State**: Component-level state management

## Styling Architecture
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Classes**: Mobile-first responsive design
- **Dark Theme**: Consistent dark color scheme
- **Animation**: Framer Motion for smooth transitions

## Development Tools
- **Vite**: Fast build tool and dev server
- **ESLint**: Code linting and formatting
- **React DevTools**: Development debugging

## File Dependencies Map

### Core App Flow
```
main.jsx → App.jsx → Hero.jsx + Carousel.jsx
```

### Movie Features
```
MovieList.jsx → MovieSkeleton.jsx + Movie.jsx
MovieDetails.jsx → ActorDetails.jsx + ActorDetailsSkeleton.jsx
```

### Data Layer
```
useFetch.js → fetchWithRetry.js
Custom Hooks → useFetch.js
Components → Custom Hooks
```

### Performance Layer
```
performance.js → useLazyLoad + useImagePreload
MovieList.jsx → performance.js utilities
```

## Key Technical Patterns

### 1. Custom Hook Pattern
- Reusable data fetching logic
- State management abstraction
- Side effect encapsulation

### 2. Component Composition
- Small, focused components
- Prop-based configuration
- Reusable UI elements

### 3. Performance Optimization
- Memoization with useMemo/useCallback
- Lazy loading implementation
- Request optimization

### 4. Error Handling
- Error boundaries for component errors
- Retry mechanisms for failed requests
- Graceful degradation

### 5. Responsive Design
- Mobile-first approach
- Flexible grid systems
- Adaptive component behavior

## Environment Setup
```bash
npm install    # Install dependencies
npm run dev    # Start development server
npm run build  # Build for production
npm run lint   # Run ESLint
```

## Routing Structure
```
/ (Home)                    → App.jsx (Hero + Category Navigation)
/movies                     → MovieList.jsx (All movies with filters)
/top-rated                  → TopRated.jsx (Top rated movies)
/coming-soon                → ComingSoon.jsx (Upcoming releases)
/movie/:id                  → MovieDetails.jsx (Individual movie details)
/actor/:id                  → ActorDetails.jsx (Actor information)
/show/:id                   → ShowDetails.jsx (TV show details)
```

## Detailed Component Analysis

### Core Components

#### App.jsx (Main Dashboard)
- **Purpose**: Home page with category-based movie browsing
- **Features**: 
  - Category tabs (Trending, Top Rated, Coming Soon, Award Winners)
  - Dynamic content switching
  - Error handling with retry mechanism
  - Loading states with skeleton UI
- **Dependencies**: Hero, Carousel, useFetch, useA11y
- **State**: activeCategory (trending/toprated/upcoming/awards)

#### MovieList.jsx (Advanced Movie Browser)
- **Purpose**: Comprehensive movie listing with advanced filtering
- **Features**:
  - Multi-genre filtering
  - Year range selection (1990-current)
  - Rating thresholds (5+, 6+, 7+, 8+, 9+)
  - Optimized movie cards with lazy loading
  - Real-time filter application
  - Responsive grid layout
- **Performance**: 
  - Intersection Observer for lazy loading
  - Image preloading
  - Debounced filter updates
  - Memoized callbacks
- **State**: selectedGenres, selectedYears, selectedRatings, isFilterOpen

#### MovieDetails.jsx
- **Purpose**: Detailed movie information page
- **Features**: Movie metadata, cast, crew, related content
- **Dependencies**: useMovieDetails hook

### Custom Hooks Deep Dive

#### useFetch.js (Core Data Fetching)
- **Features**:
  - Automatic retry with exponential backoff
  - Error state management
  - Loading state handling
  - Manual retry capability
- **Retry Logic**: 3 attempts with increasing delays (1s, 2s, 4s, max 10s)
- **Error Handling**: Distinguishes between retrying and failed states

#### Performance Utilities (utilities/performance.js)
- **useLazyLoad**: Intersection Observer-based lazy loading
- **useImagePreload**: Optimized image loading with error handling
- **useThrottledValue**: Value throttling for performance
- **useIntersectionObserver**: Generic intersection observer hook
- **memoWithDeepCompare**: Deep comparison memoization

### State Management Patterns

#### Local State (useState)
- Component-specific UI state
- Filter selections
- Loading/error states
- Form inputs

#### Derived State (useMemo)
- Filtered movie lists
- Computed values
- Expensive calculations

#### Side Effects (useEffect)
- API calls
- Event listeners
- Cleanup operations
- Intersection observers

### Performance Optimizations

#### Image Loading Strategy
1. **Lazy Loading**: Images load only when entering viewport
2. **Preloading**: Images preload when container is visible
3. **Fallback**: Placeholder images for failed loads
4. **Progressive Enhancement**: Skeleton → Placeholder → Actual image

#### Request Optimization
1. **Debouncing**: Filter changes debounced to reduce API calls
2. **Caching**: useFetch implements basic caching
3. **Retry Logic**: Failed requests automatically retry with backoff
4. **Abort Controllers**: Cleanup for cancelled requests

#### Rendering Optimization
1. **Memoization**: useCallback/useMemo for expensive operations
2. **Component Splitting**: Small, focused components
3. **Conditional Rendering**: Efficient loading states
4. **Animation Optimization**: Framer Motion with layout animations

### Error Handling Strategy

#### Component Level
- ErrorBoundary wrapper for all routes
- Try-catch in async operations
- Graceful degradation for missing data

#### Network Level
- Retry mechanisms with exponential backoff
- User-friendly error messages
- Manual retry options
- Offline state handling

#### User Experience
- Loading skeletons during data fetch
- Error states with retry buttons
- Progressive enhancement
- Accessibility considerations

### Accessibility Features

#### Keyboard Navigation
- Tab order management
- Focus indicators
- Keyboard shortcuts
- Screen reader support

#### Visual Accessibility
- High contrast colors
- Responsive text sizing
- Clear visual hierarchy
- Loading state indicators

#### Semantic HTML
- Proper heading structure
- ARIA labels and descriptions
- Role attributes
- Form accessibility

## Browser Support
- Modern browsers with ES6+ support
- Mobile browsers (iOS Safari, Chrome Mobile)
- Desktop browsers (Chrome, Firefox, Safari, Edge)

## Development Notes
- **Architecture**: Component-based with custom hooks
- **Styling**: Utility-first with Tailwind CSS
- **Performance**: Optimized for mobile and slow connections
- **Maintainability**: Modular structure with clear separation of concerns