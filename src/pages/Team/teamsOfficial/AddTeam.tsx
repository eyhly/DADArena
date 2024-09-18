import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useCreateTeam } from "../../../services/mutation";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import ColorTheme from "../../../utils/ColorTheme";
import { Team } from "../../../types/team";

interface CreateTeamModalProps {
  open: boolean;
  onClose: () => void;
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
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: Team) => {
    if (!eventId) {
      console.log("Event ID is not available.", eventId);
      return;
    }

    try {
      await mutate({ data: data, eventId });
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Team created successfully!",
        confirmButtonText: "Ok",
      });
      reset();
      onClose(); 
      queryClient.invalidateQueries({ queryKey: ["teams", eventId] });
    } catch (error) {
      console.log("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: error instanceof Error ? error.message : "An unexpected error occurred.",
        confirmButtonText: "Ok",
      });
    }
  };

  return (
    <ThemeProvider theme={ColorTheme}>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle variant="h6" component="h2" >
          Create New Team
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Team name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Team Name"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Button type="submit" variant="contained" fullWidth>
              Create Team
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default CreateTeam;
