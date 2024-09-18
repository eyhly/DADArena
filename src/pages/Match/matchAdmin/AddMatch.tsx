import React from "react";
import {
  TextField,
  Button,
  Alert,
  ThemeProvider,
  MenuItem,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useCreateMatch } from "../../../services/mutation";
import { useParams } from "react-router-dom";
import ColorTheme from "../../../utils/ColorTheme";
import Swal from "sweetalert2";
import { Match } from "../../../types/match";
import { useGetAllSports, useGetAllTeams } from "../../../services/queries";
import { useQueryClient } from "@tanstack/react-query";

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
  const today = new Date().toISOString().split("T")[0];
  const queryClient = useQueryClient();

  const { handleSubmit, control, watch } = useForm<Match>({
    defaultValues: {
      sportId: "",
      teamRedId: "",
      teamBlueId: "",
      teamRedScore: 0,
      teamBlueScore: 0,
      venue: "",
      date: today,
    },
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
      date: formatDate(data.date),
    };

    console.log("Submitting data:", formattedData);
    mutate({ eventId, data: formattedData }, {
      
      onSuccess: () => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Match added successfully!",
          confirmButtonText: "Ok",
        });
        handleClose();
        queryClient.invalidateQueries({ queryKey: ['matches', eventId] });
      },
      onError: (error) => {
        console.log("Error:", error); // Log error for debugging
        setError("An error occurred while adding the match. Please try again.");
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: error instanceof Error ? error.message : "An unexpected error occurred.",
          confirmButtonText: "Ok",
        });
        handleClose();
      },
    });
  };

  return (
    <ThemeProvider theme={ColorTheme}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle variant="h6" component="h2" sx={{ mb: 2 }}>
          Add Match
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
                  defaultValue={0}
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
                  defaultValue={0}
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
                  inputProps={{ min: today }}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                  required
                />
              )}
            />
            <Button type="submit" variant="contained" fullWidth>
              Add Match
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default AddMatch;
