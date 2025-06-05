import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MovieList from '../components/MovieList.jsx'
import MovieDetails from '../components/MovieDetails.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from '../components/Navbar.jsx';
import TopRated from '../components/TopRated.jsx'
import ActorDetails from '../components/ActorDetails.jsx'
import ShowDetails from '../components/ShowDetails.jsx';
import ComingSoon from '../components/ComingSoon.jsx';
import { ErrorBoundary } from '../components/ErrorBoundary.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <Navbar />
        <App />
      </ErrorBoundary>
    )
  },
  {
    path: "/movies",
    element: (
      <ErrorBoundary>
        <Navbar />
        <MovieList />
      </ErrorBoundary>
    )
  },
  {
    path: "/top-rated",
    element: (
      <ErrorBoundary>
        <Navbar />
        <TopRated />
      </ErrorBoundary>
    )
  },
  {
    path: "/movie/:id",
    element: (
      <ErrorBoundary>
        <Navbar />
        <MovieDetails />
      </ErrorBoundary>
    )
  },
  {
    path: "/actor/:id",
    element: (
      <ErrorBoundary>
        <Navbar />
        <ActorDetails />
      </ErrorBoundary>
    )
  },
  {
    path: "/show/:id",
    element: (
      <ErrorBoundary>
        <Navbar />
        <ShowDetails />
      </ErrorBoundary>
    )
  },
  {
    path: "/coming-soon",
    element: (
      <ErrorBoundary>
        <Navbar />
        <ComingSoon />
      </ErrorBoundary>
    )
  },
])
//  its not best practicel to use You are manually adding the <Nav /> component to every route. This is not scalable and can lead to inconsistencies if you forget to include it in a new route.
// No Shared Layout:
// Since there is no shared layout, the <Nav /> component is not part of a unified structure. This can cause issues if you want to add more shared components (e.g., a footer) in the future.
//using in main becaue routeing is use

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
