import React from "react";
import {
  TextField,
  Button,
  Alert,
  ThemeProvider,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem
} from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useUpdateMatch } from "../../../services/mutation";
import { useParams } from "react-router-dom";
import ColorTheme from "../../../utils/ColorTheme";
import Swal from "sweetalert2";
import { Match } from "../../../types/match";
import { useGetAllSports, useGetAllTeams } from "../../../services/queries";

interface UpdateMatchModalProps {
  open: boolean;
  handleClose: () => void;
  matchData: Match;
}

const UpdateMatch: React.FC<UpdateMatchModalProps> = ({
  open,
  handleClose,
  matchData,
}) => {
  const { handleSubmit, control, watch } = useForm<Match>({ defaultValues: matchData });
  const { id, eventId, sportId } = useParams();
  const updateMatch = useUpdateMatch();
  const { data: sports } = useGetAllSports(eventId!); 
  const { data: teams } = useGetAllTeams(eventId!);
  const [error] = React.useState<string | null>(null);
  const selectedSport = sports?.find((sport) => sport.id === sportId);

  const teamRedId = watch("teamRedId");
  const teamBlueId = watch("teamBlueId");

  const onSubmit: SubmitHandler<Match> = async (data) => {
    try {
      await updateMatch.mutateAsync({ id: id!, data });
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Match updated successfully!",
        confirmButtonText: "Ok",
      });
      handleClose();
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
              defaultValue={sportId}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={selectedSport?.title || ""}
                  disabled
                  
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                />
              )}
            />
            <Controller
              name="teamRedId"
              control={control}
              defaultValue=""
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
              defaultValue=""
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
            <Controller
              name="teamRedScore"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Team Red Score"
                  type="number"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                />
              )}
            />
            <Controller
              name="teamBlueScore"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Team Blue Score"
                  type="number"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                />
              )}
            />
            {/* <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Status"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                />
              )}
            /> */}
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
