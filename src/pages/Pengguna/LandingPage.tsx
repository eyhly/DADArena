import React from "react";
import {
  Container,
  Typography,
  Box,
  CardMedia,
  CircularProgress,
  AppBar,
  Toolbar,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useGetAllEvents } from "../../services/queries"; 
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';
import ColorTheme from "../../utils/ColorTheme";
import Banner from "../../../public/img/banner.png";
import Logo from '../../../public/img/logo.png'
import Events from "./Events";

const LandingPage = () => {
  const { isLoading, isError } = useGetAllEvents();

  if (isLoading) {
    return (
      <Container  sx={{ textAlign: "center", marginTop: 8 }}>
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
      <AppBar
          position="fixed"
          sx={{ width: '100%'}}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{display: 'flex' }}>
              <img src={Logo} alt="Logo" width='40px' />
              DAD Sports League
            </Typography>
          </Toolbar>
        </AppBar>
        </HideOnScroll>
        <Container  sx={{ flexGrow: 1, paddingBottom: 4, mt: 10}}>
          
          {/* Welcome Section */}
          <Box
            sx={{
              background: "#ffee58",
              color: "black",
              p: 4,
              borderRadius: 1,
              mb: 4,
              textAlign: "center",
              width: 1470
            }}
          >
            <Typography variant="h4" component="div" >
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
          <Typography variant="h4" component="div" align="center" gutterBottom>
            Upcoming Events
          </Typography>

          {/* Uncomment when EventsPage component is ready */}
          <Events />
        </Container>
      
    </ThemeProvider>
  );
};

export default LandingPage;
