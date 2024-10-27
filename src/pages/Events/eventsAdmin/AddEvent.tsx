import React, { ChangeEvent, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {zodResolver} from '@hookform/resolvers/zod'
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Grid,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useCreateEvent } from "../../../services/mutation";
import { Event } from "../../../types/event";
import Swal from "sweetalert2";
import { useNavigate} from "react-router-dom";
import { eventSchema } from "../../../utils/schema";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 19) + "Z";
};

export default function AddEventPage() {
  const { handleSubmit, control, setValue, formState: {errors} } = useForm<Event>({
    resolver: zodResolver(eventSchema),
  });
  const { mutate } = useCreateEvent();
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [fileName, setFileName] = useState<string>("");
  const [registrationStartDate, setRegistrationStartDate] = useState<string>("");
  const [eventStartDate, setEventStartDate] = useState<string>("");

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
      allowedSportLimit:  Number(data.allowedSportLimit),

    };
    mutate(formattedData, {
      onSuccess: () => {
        console.log(formattedData)
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
    <Container maxWidth="md" sx={{ mx: 45, mt: 30 }}>
        <Typography variant="h4" align="center" sx={{ mt: -35 }} gutterBottom>
          Add New Event
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label= {<Typography component="span">
                      Event Title <Typography component="span" color="red" >
                        *
                      </Typography>
                    </Typography>}
                    variant="outlined"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    fullWidth
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
                    label={<Typography component='span'>
                      Description <Typography component='span' color='red'>*</Typography>
                    </Typography>}
                    variant="outlined"
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    fullWidth
                    multiline
                    rows={4}
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
                    label={<Typography component='span'>
                      Registration Start Date <Typography component='span' color='red'>*</Typography>
                    </Typography>}
                    type="date"
                    inputProps={{min: today}}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                    fullWidth
                    error={!!errors.registrationStartDate}
                    helperText={errors.registrationStartDate?.message}
                    onChange={(e) => {
                      setRegistrationStartDate(e.target.value);
                      field.onChange(e); 
                    }}
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
                    label={<Typography component='span'>
                    Registration End Date <Typography component='span' color='red'>*</Typography>
                  </Typography>}
                    type="date"
                    inputProps={{min: registrationStartDate || today}}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                    fullWidth
                    error={!!errors.registrationEndDate}
                    helperText={errors.registrationEndDate?.message}
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
                    label={<Typography component='span'>
                    Event Start Date <Typography component='span' color='red'>*</Typography>
                  </Typography>}
                    type="date"
                    inputProps={{min: registrationStartDate || today}}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                    fullWidth
                    error={!!errors.eventStartDate}
                    helperText={errors.eventStartDate?.message}
                    onChange={(e)=> {
                      setEventStartDate(e.target.value);
                      field.onChange(e);
                    }}
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
                    label={<Typography component='span'>
                      Event End Date <Typography component='span' color='red'>*</Typography>
                    </Typography>}
                    type="date"
                    inputProps={{min: eventStartDate || today}}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                    fullWidth
                    error={!!errors.eventEndDate}
                    helperText={errors.eventEndDate?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
              name="allowedSportLimit"
              control={control}
              defaultValue={0}
              render={({field}) => (
                <TextField
                {...field}
                label={<Typography component='span'>
                  Allowed Sport Limit <Typography component='span' color='red'>*</Typography></Typography>}
                type="number"
                variant="outlined"
                fullWidth
                error={!!errors.allowedSportLimit}
                helperText={errors.allowedSportLimit?.message}
                onChange={(e) => {
                  field.onChange(Number(e.target.value));
                }}
                />
              )}
              />
            </Grid>

            <Grid item xs={12}>
                <InputLabel htmlFor="image-upload">Image</InputLabel>
              <FormControl fullWidth variant="outlined" >
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
    </Container>
  );
}
