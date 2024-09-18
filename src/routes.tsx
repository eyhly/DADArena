import { createBrowserRouter } from 'react-router-dom';
import Login from './pages/Auth/Login';
import EventsPage from './pages/Events/eventsAdmin/EventsPage';
// import DashboardAdmin from './pages/Dashboard/AdminDashboard';
import LayoutPages from './pages/Layout/LayoutPages';
import AddEventPage from './pages/Events/eventsAdmin/AddEvent';
import LandingPage from './pages/User/LandingPage';
import SportsTable from './pages/Sport/sportsAdmin/SportTable';
import UpdateEvent from './pages/Events/eventsAdmin/UpdateEvent';
// import { SignIn, SignUp } from '@clerk/clerk-react';
import ListTeam from './pages/Team/ListTeam';
import LoginButton from './pages/Auth/LoginButton';
import Matches from './pages/Match/matchAdmin/Matches';
import DetailEvents from './pages/Events/eventsAdmin/DetailEvents';
import Attandance from './pages/Attandance/Attandance';
import Leaderboard from './pages/Leaderboard/Leaderboard';
import User from './pages/User/User';

const router = createBrowserRouter([
  {
    path: '/l',
    element: <Login />,
  },
  {
    path: '/login',
    element: <LoginButton />,
  },
  {
    path: '/',
    element: <LandingPage/>
  },
  // {
  //   path: '/login',
  //   element: <SignIn/>
  // },
  // {
  //   path: '/register',
  //   element: <SignUp/>
  // },
  {
    path: '/events',
    element: <EventsPage/>
  },
  // {
  //   path: '/register',
  //   element: <Register />,
  // },
 {
  id: 'root',
  element: <LayoutPages/>, 
  // loader
  children: [
    // {
    //   path: '/events',
    //   element: <EventsPage/>
    // },
    {
      path: '/events/add',
      element: <AddEventPage/>
    },
    {
      path: '/events/edit/:eventId',
      element: <UpdateEvent/>
    },
    {
      path: '/events/:eventId/absensi',
      element: <Attandance/>
    },
    {
      path: '/events/:eventId/leaderboard',
      element: <Leaderboard/>
    },
    {
      path: '/events/:eventId/user',
      element: <User/>
    },
    {
      path: '/events/:eventId/sports',
      element: <SportsTable/>
    },
    {
      path: '/events/:eventId/matches',
      element: <Matches/>
    },
    {
      path: '/events/:eventId/teams',
      element: <ListTeam/>
    },
    {
      path: '/events/:eventId/detail',
      element: <DetailEvents/>
    },

  ]
 }
]);

export default router;