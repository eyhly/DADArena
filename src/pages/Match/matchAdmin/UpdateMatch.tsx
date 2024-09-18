import React, { useEffect } from "react";
import {
  TextField,
  Button,
  Alert,
  ThemeProvider,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Grid
} from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useUpdateMatch } from "../../../services/mutation";
import { useParams } from "react-router-dom";
import ColorTheme from "../../../utils/ColorTheme";
import Swal from "sweetalert2";
import { Match } from "../../../types/match";
import { useGetAllSports, useGetAllTeams } from "../../../services/queries";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateMatchModalProps {
  open: boolean;
  handleClose: () => void;
  matchData: Match;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const submitDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 19) + "Z";
};

const UpdateMatch: React.FC<UpdateMatchModalProps> = ({
  open,
  handleClose,
  matchData,
}) => {
  const { handleSubmit, control, watch, reset } = useForm<Match>({ defaultValues: matchData });
  const { id: matchId, eventId } = useParams();
  const updateMatch = useUpdateMatch();
  const { data: sports } = useGetAllSports(eventId!); 
  const { data: teams } = useGetAllTeams(eventId!);
  const [error] = React.useState<string | null>(null);
  const queryClient = useQueryClient();

  const teamRedId = watch("teamRedId");
  const teamBlueId = watch("teamBlueId");

  useEffect(() => {
    reset({
      ...matchData,
      date: formatDate(matchData.date),
    });
  }, [matchData, reset]);

  const onSubmit: SubmitHandler<Match> = async (data) => {
    const formattedData = {
      ...data,
      date: submitDate(data.date), 
    };

    console.log('dapet id?', matchId, eventId)
    console.log("Submitting data:", formattedData); 
    try {
      await updateMatch.mutateAsync({ id: matchData.id, eventId: eventId!, data: formattedData });
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Match updated successfully!",
        confirmButtonText: "Ok",
      });
      handleClose();
      queryClient.invalidateQueries({ queryKey: ['match', eventId] });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: error instanceof Error ? error.message : "An unexpected error occurred.",
        confirmButtonText: "Ok",
      });
      handleClose();
    }
  };

  return (
    <ThemeProvider theme={ColorTheme}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle variant="h6" component="h2" sx={{ mb: 2 }}>
          Update Match
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="sportId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Select Sport"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
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
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Week"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                )}
              />
            <Controller
              name="teamRedId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Team Red"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {teams?.map((team) => (
                    <MenuItem key={team.id} value={team.id} disabled={team.id === teamBlueId}>
                      {team.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="teamBlueId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Team Blue"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {teams?.map((team) => (
                    <MenuItem key={team.id} value={team.id} disabled={team.id === teamRedId}>
                      {team.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
             <Grid container spacing={2}>
             <Grid item xs={6}>
            <Controller
              name="teamRedScore"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Team Red Score"
                  type="number"
                  variant="outlined"
                  value={field.value ?? 0}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              )}
            />
            </Grid>
            <Grid item xs={6}>
            <Controller
              name="teamBlueScore"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Team Blue Score"
                  type="number"
                  variant="outlined"
                  value={field.value ?? 0}
                  fullWidth
                  sx={{ mb: 2 }}
                />
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
                  label="Venue"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                />
              )}
            />
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Date"
                  type="date"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              )}
            />
            <Button type="submit" variant="contained" fullWidth>
              Update Match
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default UpdateMatch;
