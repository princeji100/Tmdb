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

const router = createBrowserRouter([
  {
    path: "/",
    element: <><Navbar /> <App /></>
  },
  {
    path: "/movies",
    element: <><Navbar /> <MovieList /></>
  },
  {
    path: "/top-rated",
    element: <><Navbar /> <TopRated /></>
  },
  {
    path: "/movie/:id",
    element: <><Navbar /> <MovieDetails /></>
  },
  {
    path: "/actor/:id",
    element: <><Navbar /> <ActorDetails /></>
  },
  {
    path: "/show/:id",
    element: <><Navbar /> <ShowDetails /></>
  },
  {
    path: "/coming-soon",
    element: <><Navbar /> <ComingSoon /></>
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
