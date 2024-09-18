import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardMedia,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useUpdateEvent, useDeleteEvent } from "../../../services/mutation";
import { useEvent, useGetAllTeams } from "../../../services/queries";
import { Event } from "../../../types/event";
import ColorTheme from "../../../utils/ColorTheme";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Team } from "../../../types/team";

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const submitDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 19) + "Z";
};

export default function DetailEvents() {
  const { eventId } = useParams<{ eventId: string }>();
  const { handleSubmit, control, reset, setValue } = useForm<Event>();
  const { data: event, isLoading } = useEvent(eventId);
  const { mutate: updateEvent } = useUpdateEvent();
  const { mutate: deleteEvent } = useDeleteEvent();
  const navigate = useNavigate();
  const { data: teams } = useGetAllTeams(eventId!);
  const queryClient = useQueryClient();

  const [fileName, setFileName] = useState<string>("");
  const [isEditable, setIsEditable] = useState(false);

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

    updateEvent(
      { id: eventId!, data: formattedData },
      {
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
          });
        },
      }
    );
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteEvent(eventId!, {
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: "Deleted!",
              text: "Your event has been deleted.",
              confirmButtonText: "Ok",
            }).then(() => {
              navigate("/events", { replace: true });
            });
            queryClient.invalidateQueries({ queryKey: ["event", eventId] });
          },
        });
      }
    });
  };

  const handleEdit = () => setIsEditable(!isEditable);

  if (isLoading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        marginTop: -5,
        ml: 65,
        display: "column",
        justifyContent: "center",
      }}
    >
      <ThemeProvider theme={ColorTheme}>
        <CardMedia
          component="img"
          image={event?.image}
          sx={{ borderRadius: 2, maxHeight: 500, width: "100%" }}
        />

        {isEditable ? (
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}
          >
            <Button variant="contained" component="label">
              Change Image
              <input type="file" hidden onChange={handleImageUpload} />
            </Button>
          </Box>
        ) : null}

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleEdit}>
            {isEditable ? "Cancel Edit" : "Update Event"}
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete Event
          </Button>
        </Box>

        {!isEditable ? (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h4" gutterBottom>
              {event?.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {event?.description}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Registration: {formatDate(event?.registrationStartDate)} to{" "}
              {formatDate(event?.registrationEndDate)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Event: {formatDate(event?.eventStartDate)} to{" "}
              {formatDate(event?.eventEndDate)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Official Team:{" "}
              {teams?.find((team) => team.id === event?.officialId)?.name ||
                "N/A"}
            </Typography>
          </Box>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
          >
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

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={!isEditable}
                >
                  Submit Update
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </ThemeProvider>
    </Container>
  );
}
