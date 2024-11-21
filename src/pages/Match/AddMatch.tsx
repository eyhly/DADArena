import React, { useState } from "react";
import {
  TextField,
  Button,
  Alert,
  MenuItem,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useCreateMatch } from "../../services/mutation";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Match } from "../../types/match";
import { useGetAllSports, useGetAllTeams } from "../../services/queries";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { matchSchema } from "../../utils/schema";
import axios from "axios";

interface AddMatchModalProps {
  open: boolean;
  handleClose: () => void;
}

const AddMatch: React.FC<AddMatchModalProps> = ({ open, handleClose }) => {
  const { eventId } = useParams<{ eventId: string }>();
  const { data: sports } = useGetAllSports(eventId!);
  const { data: teams } = useGetAllTeams(eventId!);
  const { mutate } = useCreateMatch();
  const [error, setError] = React.useState<string | null>(null);
  const today = new Date().toISOString().slice(0, 16);
  const queryClient = useQueryClient();
  const [startTime, setStartTime] = useState<string>("")

  const { handleSubmit, control, watch, reset, formState: {errors} } = useForm<Match>({
    defaultValues: {
      sportId: "",
      teamRedId: "",
      teamBlueId: "",
      venue: "",
      startTime: today,
      endTime: today,
    }, resolver: zodResolver(matchSchema)
  });

  const teamRedId = watch("teamRedId");
  const teamBlueId = watch("teamBlueId");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString();
  };

  const onSubmit = (data: Match) => {
    if (!eventId) {
      setError("Event ID is not available.");
      return;
    }

    const formattedData = {
      ...data,
      week: Number(data.week),
      startTime: formatDate(data.startTime),
      endTime: formatDate(data.endTime),
    };

    console.log("Submitting data:", formattedData);
    mutate(
      { eventId, data: formattedData },
      {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Match added successfully!",
            confirmButtonText: "Ok",
          });
          handleClose();
          reset();
          queryClient.invalidateQueries({ queryKey: ["matches", eventId] });
        },
        onError: (error) => {
          if (axios.isAxiosError(error)){
          Swal.fire({
            icon: "error",
            title: "Failed!",
            text: error.response?.data,
            confirmButtonText: "Ok",
          });
        }
          handleClose();
        },
      }
    );
  };

  return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle variant="h6" component="h2">
          Add Match
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="sportId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label={<Typography component="span">
                    Sport <Typography component="span" color="red" >
                      *
                    </Typography>
                  </Typography>}
                  variant="outlined"
                  error={!!errors.sportId}
                  helperText={errors.sportId?.message}
                  fullWidth
                  sx={{ mb: 2, mt: 2 }}
                >
                  {sports?.map((sport) => (
                    <MenuItem key={sport.id} value={sport.id}>
                      {sport.title}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="week"
              control={control}
              defaultValue={1}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label={<Typography component="span">
                    Week <Typography component="span" color="red" >
                      *
                    </Typography>
                  </Typography>}
                  variant="outlined"
                  inputProps={{
                    min: 1,
                  }}
                  fullWidth
                  error={!!errors.week}
                  helperText={errors.week?.message}
                  sx={{ mb: 2 }}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value))
                }}
                />
              )}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="teamRedId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label={<Typography component="span">
                        Team Red <Typography component="span" color="red" >
                          *
                        </Typography>
                      </Typography>}
                      variant="outlined"
                      fullWidth
                      error={!!errors.teamRedId}
                      helperText={errors.teamRedId?.message}
                      sx={{ mb: 2 }}
                    >
                      {teams?.map((team) => (
                        <MenuItem
                          key={team.id}
                          value={team.id}
                          disabled={team.id === teamBlueId}
                        >
                          {team.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="teamBlueId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label={<Typography component="span">
                        Team Blue <Typography component="span" color="red" >
                          *
                        </Typography>
                      </Typography>}
                      variant="outlined"
                      fullWidth
                      error={!!errors.teamBlueId}
                      helperText={errors.teamBlueId?.message}
                      sx={{ mb: 2 }}
                    >
                      {teams?.map((team) => (
                        <MenuItem
                          key={team.id}
                          value={team.id}
                          disabled={team.id === teamRedId}
                        >
                          {team.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
            </Grid>
            <Controller
              name="venue"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={<Typography component="span">
                    Venue <Typography component="span" color="red" >
                      *
                    </Typography>
                  </Typography>}
                  variant="outlined"
                  fullWidth
                  error={!!errors.venue}
                  helperText={errors.venue?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<Typography component="span">
                        Start Match <Typography component="span" color="red" >
                          *
                        </Typography>
                      </Typography>}
                      type="datetime-local"
                      variant="outlined"
                      inputProps={{ min: today }}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      sx={{ mb: 2 }}
                      error={!!errors.startTime}
                      helperText={errors.startTime?.message}
                      onChange={(e) => {
                        setStartTime(e.target.value);
                        field.onChange(e); 
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<Typography component="span">
                        End Match <Typography component="span" color="red" >
                          *
                        </Typography>
                      </Typography>}
                      type="datetime-local"
                      variant="outlined"
                      inputProps={{ min: startTime }}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      sx={{ mb: 2 }}
                      disabled={!startTime}
                      error={!!errors.endTime}
                      helperText={errors.endTime?.message}
                      
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Button type="submit" variant="contained" fullWidth>
                  Add Match
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="contained" fullWidth onClick={handleClose}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
  );
};

export default AddMatch;
