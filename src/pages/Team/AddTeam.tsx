import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useCreateTeam } from "../../services/mutation";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { Team } from "../../types/team";
import { zodResolver } from "@hookform/resolvers/zod";
import { teamSchema } from "../../utils/schema";
import axios from "axios";

interface CreateTeamModalProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
}

const CreateTeam: React.FC<CreateTeamModalProps> = ({ open, onClose }) => {
  const { eventId } = useParams<{ eventId: string }>();
  const { mutate } = useCreateTeam();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Team>({
    resolver: zodResolver(teamSchema),
  });

  const onSubmit = (data: Team) => {
    if (!eventId) {
      console.log("Event ID is not available.", eventId);
      return;
    }

     mutate(
      { data: data, eventId },
      {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Team created successfully!",
            confirmButtonText: "Ok",
          });
          reset();
          onClose();
          queryClient.invalidateQueries({ queryKey: ["teams", eventId] });
          console.log('yang disubmit?',data);
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            Swal.fire({
              icon: "error",
              title: "Failed!",
              text: error.response?.data ,
              confirmButtonText: "Ok",
            });
          }
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle variant="h6" component="h2">
        Create New Team
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={<Typography component="span">
                      Team Name <Typography component="span" color="red" >
                        *
                      </Typography>
                    </Typography>}
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2, mt: 1 }}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Button type="submit" variant="contained" fullWidth>
                Create Team
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button variant="contained" fullWidth onClick={onClose}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTeam;
