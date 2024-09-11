import * as React from "react";
// import { useQuery } from "@tanstack/react-query";
import { useGetAllEvents } from "../../services/queries";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Container, Grid, CircularProgress } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Event } from "../../types/event";
import ColorTheme from "../../utils/ColorTheme";

const Events = () => {
  const { data, isLoading, isError } = useGetAllEvents();

  if (isLoading) {
    return (
      <Container sx={{ textAlign: "center", marginTop: 4 }}>
        <CircularProgress />
        <Typography variant="h6" component="div" sx={{ marginTop: 2 }}>
          Loading events...
        </Typography>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography variant="h6" component="div" sx={{ color: "red" }}>
          Failed to load events
        </Typography>
      </Container>
    );
  }

  const cardData = (data || []).map((event: Event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    image: event.image, 
  }));

  // if no events found
  if (cardData.length === 0) {
    return (
      <Container>
        <Typography variant="h6" component="div" sx={{ textAlign: "center", marginX: 90, marginTop: 4 }}>
          No events found
        </Typography>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={ColorTheme}>
      <Container sx={{mt:4}}>
        <Grid container spacing={6} justifyContent="center" sx={{ml:30}}>
          {cardData.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card.id}>
              <Card sx={{ maxWidth: 400, maxHeight: '100%' }}>
                <CardMedia
                  component="img"
                  alt={card.title}
                  height="200"
                  image={card.image}
                />
                <CardContent sx={{ height: 100, overflow: 'hidden' }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        </Container>
    </ThemeProvider>
  );
};

export default Events;
