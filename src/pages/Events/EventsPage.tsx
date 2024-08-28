import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAllEvents } from "../../services/queries";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Container, Grid, CircularProgress } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Event } from "../../types/event";
import { useNavigate } from "react-router-dom";
import ColorTheme from "../../utils/ColorTheme";
import { useDeleteEvent } from "../../services/mutation";
import Swal from "sweetalert2";


const EventsPage = () => {
  const { data, isLoading, isError } = useGetAllEvents();
  const queryClient = useQueryClient();
  const deleteEvent = useDeleteEvent();
  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    const confirmation = await Swal.fire({
      title: "Are you sure want to delete this event?",
      text: "You can canceled!.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (confirmation.isConfirmed) {
      try {
        await deleteEvent.mutateAsync(id);
        queryClient.invalidateQueries({ queryKey: ['events']});
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Event deleted successfully!",
          confirmButtonText: "Ok",
        });
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: error.toString(),
          confirmButtonText: "Ok",
        });
      }
    }
  };

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
    image: '/logo.png', 
  }));

  // if no events found
  if (cardData.length === 0) {
    return (
      <ThemeProvider theme={ColorTheme}>
      <Container sx={{ml:87, mt: -10 }}>
        <Typography variant="h6">
          No events found
        </Typography>
        <Button size="small" variant="contained" sx={{maxHeight: 50, mt: 2, ml:1}} onClick={() => navigate('/events/add')}>
          <AddOutlinedIcon /> Create Event
        </Button>
      </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={ColorTheme}>
      <Button size="small" variant="contained" sx={{ ml:175, mt: -5, mb: 3, maxHeight: 50, maxWidth: '100%' }} onClick={() => navigate('/events/add')}>
        <AddOutlinedIcon /> Create Event
      </Button>
      <Container sx={{mt:4}}>
        <Grid container spacing={6} justifyContent="center" sx={{ml:10}}>
          {cardData.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card.id}>
              <Card sx={{ maxWidth: 400, maxHeight: '100%', '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.3s ease-in-out',
                  },
                  cursor: 'pointer', }} >
                <CardMedia
                  component="img"
                  alt={card.title}
                  height="200"
                  image={card.image} onClick={() => navigate(`/events/${card.id}/sports`)}
                />
                <CardContent sx={{ height: 100, overflow: 'hidden' }} onClick={() => navigate(`/events/${card.id}/sports`)}>
                  <Typography gutterBottom variant="h5" component="div">
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={()=> navigate(`/events/edit/${card.id}`)}>
                    <EditCalendarOutlinedIcon />
                    Update
                  </Button>
                  <Button size="small" sx={{ color: "red" }} onClick={() => handleDelete(card.id)}>
                    <DeleteOutlineOutlinedIcon />
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        </Container>
    </ThemeProvider>
  );
};

export default EventsPage;
