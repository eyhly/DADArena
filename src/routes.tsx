import { createBrowserRouter } from 'react-router-dom';
import Login from './pages/Auth/Login';
import EventsPage from './pages/Events/EventsPage';
import DashboardAdmin from './pages/Dashboard/AdminDashboard';
import LayoutPages from './pages/Layout/LayoutPages';
import AddEventPage from './pages/Events/AddEvent';
import LandingPage from './pages/Pengguna/LandingPage';
import SportsTable from './pages/Sport/SportTable';
import UpdateEvent from './pages/Events/UpdateEvent';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/home',
    element: <LandingPage/>
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
    {
      path: '/events',
      element: <EventsPage/>
    },
    {
      path: '/events/add',
      element: <AddEventPage/>
    },
    {
      path: '/events/edit/:id',
      element: <UpdateEvent/>
    },
    {
      path: 'admin/events',
      element: <DashboardAdmin/>
    },
    {
      path: 'events/:id/sports',
      element: <SportsTable/>
    }
  ]
 }
]);

export default router;