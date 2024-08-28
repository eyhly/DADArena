import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Container, Typography, Box, Grid } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useUpdateEvent } from '../../services/mutation';
import { useEvent } from '../../services/queries';
import { Event } from '../../types/event';
import ColorTheme from '../../utils/ColorTheme';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateEventPage() {
  const { id } = useParams<{ id: string }>();
  const { handleSubmit, control, reset } = useForm<Event>();
  const { data: event, isLoading } = useEvent(id);
  const { mutate } = useUpdateEvent();
  const navigate = useNavigate();

  useEffect(() => {
    if (event) {
      reset(event); 
    }
  }, [event, reset]);

  const onSubmit = (data: Event) => {
    mutate({ id: id!, data }, {
      onSuccess: () => {
        Swal.fire({
          icon: "success",
          title: "Success Update Event!",
          text: "Event has been updated successfully!",
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
          title: "Failed to update event!",
          text: error.toString(),
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate(`/events/edit/${id}`);
          }
        });
      },
    });
  };

  const handleBatal = () => {
    Swal.fire({
      icon: "warning",
      title: "Warning",
      text: "Are you sure you want to cancel? You might lose your changes, it is ok?",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/events");
      }
    });
  };

  if (isLoading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ marginX: 60 }}>
      <ThemeProvider theme={ColorTheme}>
        <Typography variant="h4" align="center" sx={{ mt: -5 }} gutterBottom>
          Update Event
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
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

            <Grid item xs={12}>
              <Controller
                name="rules"
                control={control}
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
            </Grid>

            <Grid item xs={6}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Update Event
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button type="button" variant="outlined" color="secondary" fullWidth onClick={handleBatal}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
    </Container>
  );
}
