import { createBrowserRouter } from 'react-router-dom';
import Login from './pages/Auth/Login';
import EventsPage from './pages/Events/eventsAdmin/EventsPage';
import LayoutPages from './pages/Layout/LayoutPages';
import AddEventPage from './pages/Events/eventsAdmin/AddEvent';
import LandingPage from './pages/User/LandingPage';
import SportsTable from './pages/Sport/SportTable';
import UpdateEvent from './pages/Events/eventsAdmin/UpdateEvent';
import ListTeam from './pages/Team/ListTeam';
import LoginButton from './pages/Auth/LoginButton';
import Matches from './pages/Match/Matches';
import SettingEvents from './pages/Events/eventsAdmin/SettingEvents';
import Attendance from './pages/Attendance/Attendance';
import Leaderboard from './pages/Leaderboard/Leaderboard';
import Recap from './pages/Point/Recap';
import Schedules from './pages/Attendance/Schedules';
import ExtraPointPage from './pages/Point/ExtraPoint';
import TeamMembers from './pages/Team/TeamMember/TeamMembers';
import SportPlayerTable from './pages/Sport/Player/SportPlayer';
import DataUser from './pages/User/DataUser';
import ProfilePage from './pages/User/Profile';
import ProtectedRoute from './hook/protectedRoute';
import AddSportPlayer from './pages/Sport/Player/AddSportPlayer';

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
  //   path: '/',
  //   element: <ProtectedRoute element={<LandingPage/>}/>
  // },
  {
    path: '/events',
    element: <ProtectedRoute element={<EventsPage/>}/>
  },
  {
    path: '/events/add',
    element: <ProtectedRoute element={<AddEventPage/>}/>
  },
  {
    path: '/profile/:user_Id',
    element: <ProtectedRoute element={<ProfilePage/>}/>
  }, 
 {
  id: 'root',
  element: <LayoutPages/>, 
  children: [
    {
      path: '/events/edit/:eventId',
      element: <ProtectedRoute element={<UpdateEvent/>}/>
    },
    {
      path: '/events/:eventId/schedules',
      element: <ProtectedRoute element={<Schedules/>} />
    },
    {
      path: '/events/:eventId/schedules/:scheduleId/attendances',
      element: <ProtectedRoute element={<Attendance/>} />
    },
    {
      path: '/events/:eventId/leaderboard',
      element: <ProtectedRoute element={<Leaderboard/>} />
    },
    {
      path: '/events/:eventId/user',
      element: <ProtectedRoute element={<DataUser/>} />
    },
    {
      path: '/events/:eventId/sports',
      element: <ProtectedRoute element={<SportsTable/>} />
    },
    {
      path: '/events/:eventId/sports/:sportId/sportplayers',
      element: <ProtectedRoute element={<SportPlayerTable/>} />
    },
    {
      path: '/events/:eventId/sports/:sportId/sportplayers/add',
      element: <ProtectedRoute element={<AddSportPlayer/>} />, 
    },
    {
      path: '/events/:eventId/matches',
      element: <ProtectedRoute element={<Matches/>} />
    },
    {
      path: '/events/:eventId/teams',
      element: <ProtectedRoute element={<ListTeam/>}/>
    },
    {
      path: '/events/:eventId/teams/:teamId/teamMembers',
      element: <ProtectedRoute element={<TeamMembers/>} />
    },
    {
      path: '/events/:eventId/detail',
      element: <ProtectedRoute element={<SettingEvents/>} />
    },
    {
      path: '/events/:eventId/recap',
      element: <ProtectedRoute element={<Recap/>} />
    },
    {
      path: '/events/:eventId/recap/:teamId/extrapoints',
      element: <ProtectedRoute element={<ExtraPointPage/>} />
    },
    // {
    //   path: '/events/:eventId/recap/:teamId/detailmatchpoints',
    //   element: <DetailMatchPoint/>
    // }, 
  ],  
 } 
]); 

export default router;  