import React, { ChangeEvent, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Grid,
  // Select,
  InputLabel,
  FormControl,
  // MenuItem,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useCreateEvent } from "../../../services/mutation";
import { Event } from "../../../types/event";
import ColorTheme from "../../../utils/ColorTheme";
import Swal from "sweetalert2";
import { useNavigate} from "react-router-dom";
// import { useGetAllTeams } from "../../services/queries";
// import { Team } from "../../types/team";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 19) + "Z";
};

export default function AddEventPage() {
  // const {eventId} = useParams();
  const { handleSubmit, control, setValue } = useForm<Event>();
  const { mutate } = useCreateEvent();
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  // const { data: teams } = useGetAllTeams(eventId!);

  const [fileName, setFileName] = useState<string>("");

  // Function to convert image file to base64
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("image", reader.result as string); 
      };
      reader.readAsDataURL(file);
    } else {
      setFileName("");
    }
  };

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
      onError: (error) => {
        Swal.fire({
          icon: "error",
          title: "Failed to add event!",
          text: error instanceof Error
          ? error.message 
          : "An unexpected error occurred.",
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
      title: "Warning!",
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
    <Container maxWidth="md" sx={{ marginX: 60 }}>
      <ThemeProvider theme={ColorTheme}>
        <Typography variant="h4" align="center" sx={{ mt: -5 }} gutterBottom>
          Add New Event
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
                    inputProps={{min: today}}
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
                    inputProps={{min: today}}
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
                    inputProps={{min: today}}
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
                    inputProps={{min: today}}
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
              name="allowedSportLimit"
              control={control}
              render={({field}) => (
                <TextField
                {...field}
                label="Allowed Sport Limit"
                type="number"
                variant="outlined"
                fullWidth

                />
              )}
              />
            </Grid>

            <Grid item xs={12}>
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

            {/* <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="team-select-label">Official Team</InputLabel>
                <Controller
                  name="officialId"
                  control={control}
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
            </Grid> */}

            <Grid item xs={6}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Create Event
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleBatal}
              >
                Batal
              </Button>
            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
    </Container>
  );
}
