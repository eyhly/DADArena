import React from "react";
import { useParams } from "react-router-dom";
import { useCreateTeamMember } from "../../../services/mutation";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { TeamMember } from "../../../types/teamMember"; 
import { Add, Remove } from "@mui/icons-material";

interface AddModalTeamMemberProps {
  open: boolean;
  onClose: () => void;
  teamId: string;
  eventId: string;
}

const AddTeamMember: React.FC<AddModalTeamMemberProps> = ({ open, onClose }) => {
  const { eventId, teamId } = useParams();
  const { mutate } = useCreateTeamMember();
  const queryClient = useQueryClient();
  
  const { handleSubmit, control, reset } = useForm<TeamMember>({
    defaultValues: {
      userId: [""]
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "userId"
  });

  const onSubmit: SubmitHandler<TeamMember> = (data) => {
    if (!eventId || !teamId) {
      console.error("eventId or teamId not found!");
      return;
    }

    const payload = data.userId
      .filter((id) => id) 
      .map((id) => ({ userId: id }));

    mutate(
      { data: payload, eventId, teamId },
      {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Team member added successfully!",
            confirmButtonText: "Ok",
          });
          queryClient.invalidateQueries({queryKey : ["teamMembers", eventId, teamId]});
          reset();
          onClose();
        },
        onError: (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error instanceof Error ? error.message : "An unexpected error occurred.",
            confirmButtonText: "Ok",
          });
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle variant="h6" sx={{ mb: 2 }}>
        Add Team Member
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={1}>
            {fields.map((field, index) => (
              <Grid container spacing={2} key={field.id} mb={2}>
                <Grid item xs={11}>
                  <Controller
                    name={`userId.${index}`}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={`Member ${index + 1}`}
                        variant="outlined"
                        fullWidth
                        required
                        sx={{mt:2}}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={1}>
                  <IconButton onClick={() => remove(index)}>
                    <Remove />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={() => append("")}
                startIcon={<Add />}
                fullWidth
                sx={{ mb: 2 }}
              >
                Add Member
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button type="submit" variant="contained" fullWidth>
                 Add Team Member
              </Button>
            </Grid >
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

export default AddTeamMember;