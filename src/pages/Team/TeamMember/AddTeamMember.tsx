import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useCreateTeamMember } from "../../../services/mutation";
import { useGetUserInfo } from "../../../services/queries";
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
  Autocomplete,
  TextField,
  CircularProgress
} from "@mui/material";
import { TeamMember } from "../../../types/teamMember";
import { Add, Remove } from "@mui/icons-material";
import axios from "axios";

interface AddModalTeamMemberProps {
  open: boolean;
  onClose: () => void;
  teamId: string;
  eventId: string;
}

interface UserOption {
  label: string;
  value: string;
}

const AddTeamMember: React.FC<AddModalTeamMemberProps> = ({ open, onClose }) => {
  const { eventId, teamId } = useParams();
  const { mutate } = useCreateTeamMember();
  const queryClient = useQueryClient();
  
  // Query untuk mendapatkan user
  const { 
    data, 
    isPending: isUsersPending 
  } = useGetUserInfo(1, 500);

  // Transform data users langsung
  const allUsers: UserOption[] = data?.data.map(user => ({
    label: `${user.user_Metadata.fullname} (${user.email})`,
    value: user.user_Id
  })) || [];

  // State untuk pencarian
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter user berdasarkan query
  const filteredUserOptions = allUsers.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { handleSubmit, control, reset } = useForm<TeamMember>({
    defaultValues: {
      userId: [""]
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "userId"
  });

  // Handler untuk submit form
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
          queryClient.invalidateQueries({ queryKey: ["teamMembers", eventId, teamId] });
          reset();
          onClose();
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: error.response?.data,
              confirmButtonText: "Ok",
            });
          }
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle variant="h6" sx={{ mb: 2 }}>
        Add Team Member
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container mt={2} spacing={2}>
            {fields.map((field, index) => (
              <Grid container spacing={2} key={field.id} mb={2} alignItems="center">
                <Grid item xs={11}>
                  <Controller
                    name={`userId.${index}`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        fullWidth
                        options={allUsers}
                        loading={isUsersPending}
                        value={filteredUserOptions.find(option => option.value === value) || null}
                        onChange={(_, newValue) => {
                          onChange(newValue ? newValue.value : '');
                        }}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            label="Select User" 
                            variant="outlined"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {isUsersPending ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        getOptionLabel={(option) => option.label}
                        onInputChange={(_, newInputValue) => setSearchQuery(newInputValue)}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={1}>
                  <IconButton onClick={() => remove(index)} disabled={fields.length <= 1}>
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