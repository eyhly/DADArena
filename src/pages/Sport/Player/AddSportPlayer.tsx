import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCreateSportPlayer } from "../../../services/mutation";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { SportPlayer } from "../../../types/sportPlayer";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Select,
  MenuItem,
  Typography,
  Container,
  Breadcrumbs,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useAuthState } from "../../../hook/useAuth"; 
import { useGetAllTeamMembers, useGetProfile } from "../../../services/queries"; 
import axios from "axios";

const AddSportPlayer: React.FC = () => {
  const navigate = useNavigate();
  const { eventId, sportId } = useParams();
  const { data: bio } = useAuthState();
  const user = bio?.user;
  const userId = user?.profile.sub;
  const { data: profile } = useGetProfile(userId!);
  const teamCaptain = profile?.teams || [];
  const team = teamCaptain.filter((t) => t.eventId == eventId);
  const teamId = team[0].teamId;
  console.log(team[0].teamId, "tem mana kamoe");
  
  const { mutate } = useCreateSportPlayer();
  const queryClient = useQueryClient();
  
  const { handleSubmit, control } = useForm<SportPlayer>({
    defaultValues: {
      userId: [""]
    }
  });

  const { data: members = [], isLoading: membersLoading } = useGetAllTeamMembers(eventId!, teamId!);
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "userId"
  });

  const onSubmit: SubmitHandler<SportPlayer> = (data) => {
    const payload = data.userId
      .filter((id) => id)
      .map((id) => ({ userId: id }));

    mutate(
      { data: payload, eventId: eventId!, sportId: sportId!, teamId: teamCaptain }, 
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

          navigate(`/events/${eventId}/sports/${sportId}/sportplayers`); 
        },
        onError: (error) => {
          if (axios.isAxiosError(error)){
            Swal.fire({
              icon: "error",
              title: "Error",
              text: error.response?.data,
              confirmButtonText: "Ok",
            });
          }
        },
      }
    );
  };

  return (
    <Container sx={{ mb: 4, minHeight: 550, width: '1000px' }}>
      <Box>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography
            onClick={() => navigate(`/events/${eventId}/sports/`)}
            style={{ cursor: "pointer" }}
            color="inherit"
          >
            Sports
          </Typography>
          <Typography
            onClick={() => navigate(`/events/${eventId}/sports/${sportId}/sportplayers`)}
            style={{ cursor: "pointer" }}
            color="inherit"
          >
            Sport Players
          </Typography>
          <Typography color="text.primary">Add Sport Player</Typography>
        </Breadcrumbs>
      </Box>
      <Typography variant="h4" sx={{ mt: 2, mb: 3 }}>
        Add Sport Player
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mb: 3 }}>
        {fields.map((field, index) => (
          <Grid container spacing={3} key={field.id}>
            <Grid item xs={11}>
              <Controller
                name={`userId.${index}`}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    {...field}
                    fullWidth
                    displayEmpty
                    variant="outlined"
                    required
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="" disabled>
                      Select Team Member
                    </MenuItem>
                    {membersLoading ? (
                      <MenuItem disabled>
                        <Typography>Loading team members...</Typography>
                      </MenuItem>
                    ) : (
                      members
                        .filter((member) => member.teamId === teamId)
                        .map((member) => (
                          <MenuItem key={member.userId} value={member.userId}>
                            {member.fullname} ({member.email})
                          </MenuItem>
                        ))
                    )}
                  </Select>
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

        <Grid container spacing={3}>
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
              Add Players
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" fullWidth onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AddSportPlayer;
