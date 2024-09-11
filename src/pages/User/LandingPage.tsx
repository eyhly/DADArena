import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useGetAllEvents } from "../../services/queries";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Slide from "@mui/material/Slide";
import ColorTheme from "../../utils/ColorTheme";
import Banner from "../../../public/img/banner.png";
import Logo from "../../../public/img/logo.png";
import { AccountCircle } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
// import { useNavigate } from "react-router-dom";
import { Event } from "../../types/event";
import { useAuth0 } from "@auth0/auth0-react";  // Import Auth0 hook

const LandingPage = () => {
  const { isLoading, isError } = useGetAllEvents();
  // const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [eventTab, setEventTab] = useState(0);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  const { data: events } = useGetAllEvents();
  
  // Auth0 hooks
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

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
      <Container sx={{ textAlign: "center", marginTop: 8 }}>
        <Typography variant="h6" component="div" sx={{ marginTop: 2 }}>
          Failed to load events
        </Typography>
      </Container>
    );
  }
  

  function HideOnScroll(props: any) {
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
    <ThemeProvider theme={ColorTheme}>
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
                DAD Sports League
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
                  <MenuItem onClick={() => loginWithRedirect()}>
                    <Typography>Login</Typography>
                  </MenuItem>
                )}
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Container sx={{ flexGrow: 1, paddingBottom: 4, mt: 10 }}>
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

        {/* Banner Section */}
        <Box
          sx={{
            position: "relative",
            ml: 50,
            height: 450,
            mb: 4,
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <CardMedia
            component="img"
            image={Banner}
            alt="Banner"
            sx={{
              height: "100%",
              width: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
        {/* Upcoming Events Section */}
        <Typography variant="h4" component="div" gutterBottom sx={{ ml: 20, mb: 3 }}>
          List Events
        </Typography>
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
                  <Card sx={{ maxWidth: 400, maxHeight: "100%" }}>
                    <CardMedia
                      component="img"
                      alt={event.title}
                      height="200"
                      image={event.image}
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
                  </Card>
                </Grid>
              ))
            ) : (
              <p>No events available</p>
            )}
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default LandingPage;
