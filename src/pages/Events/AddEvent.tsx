import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Container, Typography, Box, Grid} from '@mui/material';
import {ThemeProvider} from '@mui/material/styles'
import { useCreateEvent } from '../../services/mutation';
import { Event } from '../../types/event';
import ColorTheme from '../../utils/ColorTheme';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 19) + "Z";
};

export default function AddEventPage() {
  const { handleSubmit, control } = useForm<Event>();
  const { mutate } = useCreateEvent();
  const navigate = useNavigate();


  const onSubmit = (data: Event) => {
    const formattedData = {
      ...data,
      registrationStartDate: formatDate(data.registrationStartDate),
      registrationEndDate: formatDate(data.registrationEndDate),
      eventStartDate: formatDate(data.eventStartDate),
      eventEndDate: formatDate(data.eventEndDate),
    };
    mutate(formattedData, {
      onSuccess: () => {
        Swal.fire({
          icon: "success",
          title: "Success Add Event!",
          text: "Success!",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/events");
          }
        });
      },
      onError: (error: any) => {
        Swal.fire({
          icon: "error",
          title: "Failed to add event!",
          text: error.toString(),
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/events/add");
          }
        });
      },
    });
  };

  const handleBatal = () => {
    Swal.fire({
      icon: "warning",
      title: "Peringatan",
      text: "Are you sure you want to cancel? You might lose your changes, it is ok?",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/events");
      }
    });
  };
  

  return (
    <Container maxWidth="md" sx={{marginX:60}}>
      <ThemeProvider theme={ColorTheme}>
      <Typography variant="h4" align="center" sx={{mt: -5 }} gutterBottom>
        Add New Event
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Controller
              name="title"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Event Title"
                  variant="outlined"
                  fullWidth
                  required
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  required
                />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <Controller
              name="registrationStartDate"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Registration Start Date"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  fullWidth
                  required
                />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <Controller
              name="registrationEndDate"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Registration End Date"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  fullWidth
                  required
                />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <Controller
              name="eventStartDate"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Event Start Date"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  fullWidth
                  required
                />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <Controller
              name="eventEndDate"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Event End Date"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  fullWidth
                  required
                />
              )}
            />
          </Grid>

          {/* <Grid item xs={12}>
            <Controller
              name="rules"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Rules"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  required
                />
              )}
            />
          </Grid> */}

          <Grid item xs={6}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Create Event
            </Button>
          </Grid>
          <Grid item xs={6}>
              <Button type="button" variant="outlined" color="secondary" fullWidth onClick={handleBatal}>
                Batal
              </Button>
            </Grid>
        </Grid>
      </Box>
      </ThemeProvider>
    </Container>
  );
}
