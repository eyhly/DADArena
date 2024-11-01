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
import { useUpdateEvent, useDeleteEvent } from "../../../services/mutation";
import { useEvent, useGetAllTeams } from "../../../services/queries";
import { Event } from "../../../types/event";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Team } from "../../../types/team";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema } from "../../../utils/schema";

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const datePage = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.toLocaleString('en-US', {month: 'long'})
  const day = String(date.getDate()).padStart(2, '0');
  return `${day} ${month} ${year}`
}

const submitDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 19) + "Z";
};

export default function SettingEvents() {
  const { eventId } = useParams<{ eventId: string }>();
  const { handleSubmit, control, reset, setValue, formState: {errors} } = useForm<Event>({
    resolver: zodResolver(eventSchema)
  });
  const { data: event, isLoading } = useEvent(eventId);
  const { mutate: updateEvent } = useUpdateEvent();
  const { mutate: deleteEvent } = useDeleteEvent();
  const navigate = useNavigate();
  const { data: teams } = useGetAllTeams(eventId!);
  const queryClient = useQueryClient();
  const formatStatus = (status : string) => {
    return status 
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
  }

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isEditable, setIsEditable] = useState(false);
  const [registrationStartDate, setRegistrationStartDate] = useState<string>("");
  const [eventStartDate, setEventStartDate] = useState<string>("");


  // untuk upload image
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        setFile(selectedFile); // Store the actual file in state
        setFileName(selectedFile.name);
        setValue("image", selectedFile.name); // Set file name in form state if needed
    } else {
        setFile(null);
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
        allowedSportLimit:  Number(event.allowedSportLimit),
      });
    }
  }, [event, reset]);

  const onSubmit = async (data: Event) => {    
    const formattedData = new FormData(); 
    formattedData.append("title", data.title)
    formattedData.append("description", data.description)
    formattedData.append("registrationStartDate", submitDate(data.registrationStartDate))
    formattedData.append("registrationEndDate", submitDate(data.registrationEndDate))
    formattedData.append("eventStartDate", submitDate(data.eventStartDate))
    formattedData.append("eventEndDate", submitDate(data.eventEndDate))
    formattedData.append("allowedSportLimit", String(data.allowedSportLimit))
  
    if(file){
      formattedData.append("image", file)
    }
    console.log('yangdisubmit?', ...formattedData);
    

    updateEvent(
      { id: eventId!, data: formattedData },
      {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Success Update Event!",
            text: "Event has been updated successfully!",
            confirmButtonText: "Ok",
          })
          .then((result) => {
            if (result.isConfirmed) {
              navigate("/");
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
              navigate("/", { replace: true });
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
        <CardMedia
          component="img"
          image={event?.image}
          sx={{ objectFit: 'cover', width: 200, height: 150, borderRadius: 5, mx:40 }}        
        />

        {isEditable ? (
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}
          >
            <Button variant="contained" component="label">
              Change Image 
              <input type="file" hidden onChange={handleImageUpload} />
            </Button>
            <Typography>{fileName}</Typography> {/*ini aku gatau mau ngapain pake ini, biar fileNamenya kepake ajasih*/}
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
          <>
          <Grid container spacing={2} >
           <Grid item  xs={12}>
           <Typography variant="h4" gutterBottom>
              {event?.title}
            </Typography>
           </Grid>
           <Grid item  xs={10}>
           <Typography variant="h5" gutterBottom fontStyle={"italic"}>
             Description
            </Typography>
           <Typography variant="body1" gutterBottom>
              {event?.description}
            </Typography>
           </Grid>
           <Grid item  xs={2}>
           <Typography variant="body1" gutterBottom color={'blue'}>
             
             {formatStatus(event?.status ?? '')}
            </Typography>
           </Grid>
           <Grid item  xs={12}>
            <Typography variant="h5" gutterBottom fontStyle={"italic"}>Registration</Typography>
            <Typography variant="body2" color="textSecondary">
            {datePage(event?.registrationStartDate ?? '')} to{" "}
              {datePage(event?.registrationEndDate ?? '')}
            </Typography>
           </Grid>  
           <Grid item  xs={12}>
            <Typography variant="h5" gutterBottom fontStyle={"italic"}>Event</Typography>
            <Typography variant="body2" color="textSecondary">
            {datePage(event?.eventStartDate ?? '')} to{" "}
              {datePage(event?.eventEndDate ?? '')}
            </Typography>
           </Grid>  
          </Grid>
          </>
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
                      label={<Typography component="span">
                        Event Title <Typography component="span" color="red" >
                          *
                        </Typography>
                      </Typography>}
                      variant="outlined"
                      fullWidth
                      error={!!errors.title}
                      helperText={errors.title?.message}
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
                      label={<Typography component='span'>
                        Description <Typography component='span' color='red'>*</Typography>
                      </Typography>}
                      variant="outlined"
                      fullWidth
                      error={!!errors.description}
                      helperText={errors.description?.message}
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
                        Registration Start Date <Typography component='span' color='red'> *</Typography>
                      </Typography>}
                      type="date"
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
                        Registration End Date <Typography component='span' color='red'> *</Typography>
                      </Typography>}
                      type="date"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      fullWidth
                      inputProps={{min: registrationStartDate }}
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
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      fullWidth
                      inputProps={{min: eventStartDate }}
                      error={!!errors.eventEndDate}
                      helperText={errors.eventEndDate?.message}
                    />
                  )}
                />
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
              <Controller
              name="allowedSportLimit"
              control={control}
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
    </Container>
  );
}
