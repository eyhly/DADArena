import React from "react";
import { useParams } from "react-router-dom";
import { useCreateSportPlayer } from "../../../services/mutation";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { SportPlayer } from "../../../types/sportPlayer";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import { useGetAllTeams } from "../../../services/queries";
import { Add, Remove } from "@mui/icons-material";

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
  const { handleSubmit, control, reset } = useForm<SportPlayer>({
    defaultValues: {
      userId: [""]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "userId"
  })

  const onSubmit: SubmitHandler<SportPlayer> = (data) => {
    if (!eventId) {
      console.log("event id?", eventId);
    }

    const payload = data.userId
    .filter((id) => id)
    .map((id) => ({userId: id}))

    mutate(
      { data: payload, eventId: eventId!, sportId: sportId! },
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
      <DialogTitle>Add Sport Player</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field, index) => (
            <Grid container spacing={3} key={field.id}>
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
            <Grid item xs={11}>
              <Controller
                name={`userId.${index}`}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={`Player ${index + 1}`}
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={1}>
            <IconButton onClick={() => remove(index)}>
                    <Remove />
                  </IconButton>
            </Grid>
          
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={() => append("")}
                startIcon={<Add />}
                fullWidth
                sx={{ mb: 2 }}
              >
                Add Player
              </Button>
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
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddSportPlayer;
