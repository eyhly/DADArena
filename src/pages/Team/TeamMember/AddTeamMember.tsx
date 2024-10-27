import React from "react";
import { useParams } from "react-router-dom";
import { useCreateTeamMember } from "../../../services/mutation";
import { useQueryClient } from "@tanstack/react-query";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
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

interface AddModalTeamMember {
  open: boolean;
  onClose: () => void;
  teamId: string;
  eventId: string;
}

const AddTeamMember: React.FC<AddModalTeamMember> = ({ open, onClose }) => {
  const { eventId, teamId } = useParams();
  const { mutate } = useCreateTeamMember();
  const queryClient = useQueryClient();
  const { handleSubmit, control, reset } = useForm<TeamMember>({
    defaultValues: {
        userId: ""
    }
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const onSubmit: SubmitHandler<TeamMember> = (data) => {
    if (!eventId || !teamId) {
      console.log("eventId or teamId not found!");
      return;
    }

    mutate(
      { data, eventId, teamId },
      {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Team member added successfully!",
            confirmButtonText: "Ok",
          });
          queryClient.invalidateQueries({
            queryKey: ["teamMembers", eventId, teamId],
          });
          reset();
          onClose();
        },
        onError: (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              error instanceof Error
                ? error.message
                : "An unexpected error occurred.",
            confirmButtonText: "Ok",
          });
          onClose();
        },
      }
    );
  };

  return (
      <Dialog open={open}>
        <DialogContent>
          <DialogTitle variant="h6" sx={{ mb: 2 }}>
            Add Team Member
          </DialogTitle>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1}>
              {fields.map((field, index) => (
                <Grid container spacing={2} key={field.id} mb={2}>
                  <Grid item xs={11}>
                        <Controller
                        name={`members.${index}.userId`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                            {...field}
                            label={`Member ${index + 1}`}
                            variant="outlined"
                            fullWidth
                            required
                            />
                        )}
                        />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton>
                      <Remove onClick={() => remove(index)} />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={() => append({ userId: "" })}
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

export default AddTeamMember;
