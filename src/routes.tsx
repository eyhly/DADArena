import { createBrowserRouter } from 'react-router-dom';
// import history from "./utils/history"
import Login from './pages/Auth/Login';
import EventsPage from './pages/Events/eventsAdmin/EventsPage';
import LayoutPages from './pages/Layout/LayoutPages';
import AddEventPage from './pages/Events/eventsAdmin/AddEvent';
import LandingPage from './pages/User/LandingPage';
import SportsTable from './pages/Sport/sportsAdmin/SportTable';
import UpdateEvent from './pages/Events/eventsAdmin/UpdateEvent';
import ListTeam from './pages/Team/ListTeam';
import LoginButton from './pages/Auth/LoginButton';
import Matches from './pages/Match/matchAdmin/Matches';
import SettingEvents from './pages/Events/eventsAdmin/SettingEvents';
import Attendance from './pages/Attendance/Attendance';
import Leaderboard from './pages/Leaderboard/Leaderboard';
import Recap from './pages/Point/Recap';
import Schedules from './pages/Attendance/Schedules';
import ExtraPointPage from './pages/Point/ExtraPoint';
import TeamMembers from './pages/Team/TeamMember/TeamMembers';
import SportPlayerTable from './pages/Sport/Player/SportPlayer';
import DataUser from './pages/User/DataUser';
import DetailMatchPoint from './pages/Point/DetailMatchPoint';

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
  {
    path: '/events/add',
    element: <AddEventPage/>
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
      path: '/events/edit/:eventId',
      element: <UpdateEvent/>
    },
    {
      path: '/events/:eventId/schedules',
      element: <Schedules/>
    },
    {
      path: '/events/:eventId/schedules/:scheduleId/attendances',
      element: <Attendance/>
    },
    {
      path: '/events/:eventId/leaderboard',
      element: <Leaderboard/>
    },
    {
      path: '/events/:eventId/user',
      element: <DataUser/>
    },
    {
      path: '/events/:eventId/sports',
      element: <SportsTable/>
    },
    {
      path: '/events/:eventId/sports/:sportId/sportplayers',
      element: <SportPlayerTable/>
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
      path: '/events/:eventId/teams/:teamId/teamMembers',
      element: <TeamMembers/>
    },
    {
      path: '/events/:eventId/detail',
      element: <SettingEvents/>
    },
    {
      path: '/events/:eventId/recap',
      element: <Recap/>
    },
    {
      path: '/events/:eventId/recap/:teamId/extrapoints',
      element: <ExtraPointPage/>
    },
    {
      path: '/events/:eventId/recap/:teamId/detailmatchpoints',
      element: <DetailMatchPoint/>
    }, 
  ],  
 } 
]); 

export default router;