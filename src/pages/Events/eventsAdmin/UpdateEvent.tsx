import React, { ChangeEvent, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Container, Typography, Box, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useUpdateEvent } from '../../../services/mutation';
import { useEvent, useGetAllTeams } from '../../../services/queries';
import { Event } from '../../../types/event';
import ColorTheme from '../../../utils/ColorTheme';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { Team } from '../../../types/team';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const submitDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 19) + "Z";
};


export default function UpdateEventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { handleSubmit, control, reset, setValue } = useForm<Event>();
  const { data: event, isLoading } = useEvent(eventId);
  const { mutate } = useUpdateEvent();
  const navigate = useNavigate();
  const { data: teams } = useGetAllTeams(eventId!);

  const [fileName, setFileName] = useState<string>("");

  // Function to convert image file to base64
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("image", reader.result as string); // to format the image eee pokoknya buat convert to base64
      };
      reader.readAsDataURL(file);
    } else {
      setFileName(""); // Reset the file name if no file is selected
    }
  };

  useEffect(() => {
    if (event) {
      reset({
        ...event,
        registrationStartDate: formatDate(event.registrationStartDate),
        registrationEndDate: formatDate(event.registrationEndDate),
        eventStartDate: formatDate(event.eventStartDate),
        eventEndDate: formatDate(event.eventEndDate),
      });
    }
  }, [event, reset]);

  const onSubmit = (data: Event) => {
    const formattedData = {
      ...data,
      registrationStartDate: submitDate(data.registrationStartDate),
      registrationEndDate: submitDate(data.registrationEndDate),
      eventStartDate: submitDate(data.eventStartDate),
      eventEndDate: submitDate(data.eventEndDate),
    };

    console.log("Submitting data:", formattedData);

    mutate({ id: eventId!, data: formattedData }, {
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
      onError: (error) => {
        console.error("Error updating event:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to update event!",
          text: error.toString(),
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate(`/events/edit/${eventId}`);
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

            <Grid item xs={6}>
                <InputLabel htmlFor="image-upload">Image</InputLabel>
              <FormControl fullWidth variant="outlined">
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  htmlFor="image-upload"
                >
                  {fileName ? fileName : "Upload Image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                </Button>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="team-select-label">Official Team</InputLabel>
                <Controller
                  name="officialId"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      labelId="team-select-label"
                      id="team-select"
                      label="Official Team"
                      {...field}
                    >
                      {teams?.map((team: Team) => (
                        <MenuItem key={team.id} value={team.id}>
                          {team.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
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
