import React from "react";
import { useParams } from "react-router-dom";
import { useCreateSportPlayer } from "../../../services/mutation";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SportPlayer } from "../../../types/sportPlayer";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import { useGetAllTeams } from "../../../services/queries";

interface AddSportPlayerProps {
  open: boolean;
  handleClose: () => void;
}

const AddSportPlayer: React.FC<AddSportPlayerProps> = ({
  open,
  handleClose,
}) => {
  const { eventId, sportId } = useParams();
  const { data: teams } = useGetAllTeams(eventId!);
  const { mutate } = useCreateSportPlayer();
  const queryClient = useQueryClient();
  const { handleSubmit, control } = useForm<SportPlayer>();

  const onSubmit: SubmitHandler<SportPlayer> = (data) => {
    if (!eventId) {
      console.log("event id?", eventId);
    }
    mutate(
      { data, eventId: eventId!, sportId: sportId! },
      {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Sport player created successfully",
            confirmButtonText: "Ok",
          });
          queryClient.invalidateQueries({
            queryKey: ["sportplayers", eventId, sportId],
          });

          handleClose();
        },
        onError: (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              error instanceof Error
                ? error.message
                : "An unexpected error occured",
            confirmButtonText: "Ok",
          });
          handleClose();
        },
      }
    );
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <DialogTitle>Add Sport Player</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="teamId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Select Team"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2, mt: 2 }}
                  >
                    {teams?.map((team) => (
                      <MenuItem key={team.id} value={team.id}>
                        {team.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="userId"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Player"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
          
          <Grid item xs={6}>
            <Button type="submit" variant="contained" fullWidth>
              Add Player
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

export default AddSportPlayer;
