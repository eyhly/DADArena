import React, { ReactElement, useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  CardMedia,
  CircularProgress,
  AppBar,
  Toolbar,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import { useGetAllEvents } from "../../../services/queries";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Slide from "@mui/material/Slide";
import Logo from "/img/logo.png";
import { AccountCircle, AddOutlined} from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Event } from "../../../types/event";
import { useAuth0 } from "@auth0/auth0-react";  // Import Auth0 hook
import { useNavigate } from "react-router-dom";
// import { useDeleteEvent } from "../../../services/mutation";
// import Swal from "sweetalert2";
// import { useQueryClient } from "@tanstack/react-query";
import DetailEvents from "./DetailEvents";

interface HideScrollProps {
  children: ReactElement;
  window?: () => Window
}

const EventsPage = () => {
  const { isLoading, isError } = useGetAllEvents();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [eventTab, setEventTab] = useState(0);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [openModalDetail, setOpenModalDetail] = useState(false); //detail modal
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const { data: events } = useGetAllEvents();
  const navigate = useNavigate();
  
  // Auth0 hooks
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  console.log(user)

  // useEffect(() => {
  //   // If the user is not authenticated, redirect to login
  //   if (!isAuthenticated) {
  //     loginWithRedirect();
  //   }
  // }, [isAuthenticated, loginWithRedirect]);

  const handleChange = (event: React.SyntheticEvent, newEvent: number) => {
    setEventTab(newEvent);
  };

  const handleOpenModalDetail = (event: Event) => {
    setSelectedEvent(event);
    setOpenModalDetail(true)
  }

  const handleCloseModalDetail = () => {
    setSelectedEvent(null);
    setOpenModalDetail(false);
  }

  const formatStatus = (status: string) => {
    return status
      .replace(/([A-Z])/g, ' $1')  
      .replace(/^./, (str) => str.toUpperCase());  
  };


  useEffect(() => {
    if (events) {
        const sortedEvents = [...events].sort((a, b) => {
          return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      });

      switch (eventTab) {
        case 1:
          setFilteredEvents(sortedEvents.filter(event => event.status === "comingSoon"));
          break;
        case 2:
          setFilteredEvents(sortedEvents.filter(event => event.status === "registration"));
          break;
        case 3:
          setFilteredEvents(sortedEvents.filter(event => event.status === "preparation"));
          break;
        case 4:
          setFilteredEvents(sortedEvents.filter(event => event.status === "onGoing"));
          break;
        case 5:
          setFilteredEvents(sortedEvents.filter(event => event.status === "finish"));
          break;
        default:
          setFilteredEvents(sortedEvents);
          break;
      }
    }
  }, [eventTab, events]);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout({logoutParams:{ returnTo: window.location.origin,
     }})
  };

  if (isLoading) {
    return (
      <Container sx={{ textAlign: "center", marginTop: 8, ml: 55 }}>
        <CircularProgress />
        <Typography variant="h6" component="div" sx={{ marginTop: 2 }}>
          Loading events...
        </Typography>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container sx={{ textAlign: "center", marginTop: 8, ml : 55 }}>
        <Typography variant="h6" component="div" sx={{ marginTop: 2 }}>
          Failed to load events
        <button onClick={()=> {handleLogout()}}>logout</button>
        </Typography>
      </Container>
    );
  }


  function HideOnScroll(props: HideScrollProps) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
      target: window ? window() : undefined,
    });
    return (
      <Slide appear={false} direction="down" in={!trigger}>
        {children}
      </Slide>
    );
  }

  return (
    <Container>
      <HideOnScroll>
        <AppBar position="fixed" sx={{ width: "100%" }}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: "flex" }}
              > 
                <img src={Logo} alt="Logo" width="40px" />
                Sports Events 
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title={isAuthenticated ? user?.name || "Profile" : "Login"}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <AccountCircle />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px", ml: 175, width:500 }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {isAuthenticated ? (
                  <>
                    <MenuItem>
                      <Typography>{user?.email}</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <Typography sx={{ textAlign: "center", display: "flex" }}>
                        <LogoutIcon />
                        Logout
                      </Typography>
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem onClick={() => loginWithRedirect()}>
                      <Typography>Login</Typography>
                    </MenuItem>
                    <MenuItem>
                    <Typography>{user?.email}</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                    <Typography sx={{ textAlign: "center", display: "flex" }}>
                      <LogoutIcon />
                      Logout
                    </Typography>
                    </MenuItem>
                    </>
                )}
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Container sx={{ flexGrow: 1, paddingBottom: 4, mt: 10, minHeight: 800 }}>
        {/* Welcome Section */}
        <Box
          sx={{
            background: "#ffee58",
            color: "black",
            p: 4,
            borderRadius: 1,
            mb: 4,
            textAlign: "center",
            width: 1470,
          }}
        >
          <Typography variant="h4" component="div">
            Welcome to Our Events
          </Typography>
          <Typography variant="h6" component="div" sx={{ mt: 1 }}>
            Check out the latest events happening near you!
          </Typography>
        </Box>

        {/* Upcoming Events Section */}
        <Container sx={{ ml: 20, mb: 3, display: 'flex', justifyContent: 'space-between', maxWidth: 1200 }}>
        <Typography variant="h4" component="div" gutterBottom>
          List Events
        </Typography>
        <Button variant="contained" size="small" sx={{maxHeight: 40}}
        onClick={() => navigate('/events/add')}
        >
          <AddOutlined/> Create Event
        </Button>
        </Container>
        <Box sx={{ width: "100%" }}>
          <Tabs value={eventTab} onChange={handleChange} centered>
            <Tab label="All Events" />
            <Tab label="Coming Soon" />
            <Tab label="Registration" />
            <Tab label="Preparation" />
            <Tab label="On Going" />
            <Tab label="Past Event" />
          </Tabs>
          <Grid container spacing={6} justifyContent="center" sx={{ ml: 20, mt: 5 }}>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event.id}>
                  <Card sx={{ maxWidth: 400, maxHeight: "100%", "&:hover": {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.3s ease-in-out'
                  },
                  cursor:'pointer'
                  }}>
                    <CardMedia
                      component="img"
                      alt={event.title}
                      height="200"
                      image={event.image}
                      onClick={() => navigate(`/events/${event.id}/matches`)}
                    />
                    <CardContent sx={{ height: 100, overflow: "hidden" }}>
                      <Typography gutterBottom variant="h5" component="div">
                        {event.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.description}
                      </Typography>
                      <Typography variant="body2" color="blue" sx={{ mt: 2 }}>
                        {formatStatus(event.status)}
                      </Typography>
                    </CardContent>
                    <CardActions>
                  <Button variant="outlined" size="small" onClick={() => handleOpenModalDetail(event)}>
                    Detail
                  </Button>
                  {/* <Button size="small" onClick={()=> navigate(`/events/edit/${event.id}`)}>
                    <EditCalendarOutlined />
                    Update
                  </Button>
                  <Button size="small" sx={{ color: "red" }} onClick={() => handleDelete(event.id)}>
                    <DeleteOutlineOutlined />
                    Delete
                  </Button> */}
                </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography>No events available</Typography>
            )}
          </Grid>
        </Box>
      </Container>  
      <DetailEvents
      open={openModalDetail}
      onClose={handleCloseModalDetail}
      eventId={selectedEvent?.id}
      />
    </Container>
  );
};

export default EventsPage;
