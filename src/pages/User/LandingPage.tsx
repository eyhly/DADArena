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
import { useGetAllEvents, useGetProfile } from "../../services/queries";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Slide from "@mui/material/Slide";
import WELCOME from "/img/WELCOME.png";
import Logo from "/img/logo.png";
import { AccountCircle, AddOutlined, ManageAccountsRounded } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Event } from "../../types/event";
import { useNavigate } from "react-router-dom";
import { useAuthState, useSigninRedirect, useSignOutRedirect } from "../../hook/useAuth";
import DetailEvents from "../Events/eventsAdmin/DetailEvents";
import { useQueryClient } from "@tanstack/react-query";

interface HideScrollProps {
  children: ReactElement;
  window?: () => Window
}

const LandingPage = () => {
  const { isLoading, isError } = useGetAllEvents();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [eventTab, setEventTab] = useState(0);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { data: events } = useGetAllEvents();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {mutate: signOutRedirect} = useSignOutRedirect();
  const {refetch: signInRedirect} = useSigninRedirect();
  const [redirected, setRedirected] = useState(false);
  const { data, isLoading: authLoading, isSuccess: authSuccess, refetch: refetchAuth } = useAuthState();

  const user = data?.user;
  const userId = user?.profile.sub;
  const isAuthenticated = data?.isAuthenticated;
  const { data: profile } = useGetProfile(userId!);
  const [roles, setRoles] = useState<string[]>(() => {
    const storedRoles = localStorage.getItem('roles')
    return storedRoles ? JSON.parse(storedRoles) : [];
  })

  useEffect(() => {
    if (authSuccess && !redirected) {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      refetchAuth();
      setRedirected(true);
    }
  }, [authSuccess, redirected, queryClient, refetchAuth])

  useEffect(() => {

      if (profile) {
        const userRoles = profile?.roles || [];
        setRoles(userRoles)
        localStorage.setItem('roles', JSON.stringify(userRoles))
      }
  })

  //cek role nya apaan
  const isMemberOrKapten = roles.includes("member") || roles.includes("captain");
  console.log(roles, "role")
  
  console.log(isAuthenticated, 'authenticeeeeet')

  const handleOpenModalDetail = (event: Event) => {
    setSelectedEvent(event);
    setOpenModalDetail(true);
  };
  
  const handleCloseModalDetail = () => {
   setSelectedEvent(null);
   setOpenModalDetail(false);
  };
  
  const handleChange = (event: React.SyntheticEvent, newEvent: number) => {
    setEventTab(newEvent);
  };

  const formatStatus = (status: string) => {
    // format for status
    return status
      .replace(/([A-Z])/g, ' $1')  
      .replace(/^./, (str) => str.toUpperCase());  
  };


  useEffect(() => {
    if (events) {
      switch (eventTab) {
        case 1:
          setFilteredEvents(events.filter(event => event.status === "comingSoon"));
          break;
        case 2:
          setFilteredEvents(events.filter(event => event.status === "registration"));
          break;
        case 3:
          setFilteredEvents(events.filter(event => event.status === "preparation"));
          break;
        case 4:
          setFilteredEvents(events.filter(event => event.status === "onGoing"));
          break;
        case 5:
          setFilteredEvents(events.filter(event => event.status === "finish"));
          break;
        default:
          setFilteredEvents(events);
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
  
  if (isLoading || authLoading) {
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
          <Button onClick={() => signOutRedirect()}>logout</Button>
        </Typography>
          <Button onClick={() => signInRedirect()}>login</Button>
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
              <Tooltip title={isAuthenticated ? user?.profile.name || "Profile" : "Login"}>
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
                  <div>
                    <MenuItem onClick={() => navigate(`/profile/${user?.profile.sub}`)}>
                      <ManageAccountsRounded/> My Profile
                    </MenuItem>
                    <MenuItem onClick={()=> {signOutRedirect()}}>
                      <Typography sx={{ textAlign: "center", display: "flex" }}>
                        <LogoutIcon />
                        Logout
                      </Typography>
                    </MenuItem>
                  </div>
                ) : (
                  <div>
                    <MenuItem onClick={() => {signInRedirect()}}>
                      <Typography>Login</Typography>
                    </MenuItem>
                    <MenuItem>
                    <Typography>{user?.profile.name}</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => signOutRedirect()}>
                    <Typography sx={{ textAlign: "center", display: "flex" }}>
                      <LogoutIcon />
                      Logout
                    </Typography>
                    </MenuItem>
                    </div>
                ) }
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

        {/* Welcome Section */}
      <Container sx={{ flexGrow: 1, paddingBottom: 4, mt: 10, minHeight: 800  }}>
        <CardMedia
            component="img"
            image={WELCOME}
            alt="WELCOME"
            sx={{
              height: "100%",
              width: "137%",
              objectFit: "contain",
              mb: 3,
              borderRadius: 6
            }}

        />

        {/* Upcoming Events Section */}
        <Container
          sx={{
            ml: 20,
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            maxWidth: 1200,
          }}
        >
          <Typography variant="h4" component="div" gutterBottom>
            List Events
          </Typography>
          {!isMemberOrKapten && (
          <Button
            variant="contained"
            size="small"
            sx={{ maxHeight: 40 }}
            onClick={() => navigate("/events/add")}
          >
            <AddOutlined /> Create Event
          </Button>
          )}
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

export default LandingPage;
