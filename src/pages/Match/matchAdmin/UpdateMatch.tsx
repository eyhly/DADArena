import React, { useEffect } from "react";
import {
  TextField,
  Button,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Grid,
  IconButton,
  Box,
} from "@mui/material";
import {
  useForm,
  Controller,
  SubmitHandler,
  useFieldArray,
} from "react-hook-form";
import {
  useCreateNote,
  useCreateRound,
  useUpdateMatch,
} from "../../../services/mutation";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Match } from "../../../types/match";
import { useGetAllSports, useGetAllTeams } from "../../../services/queries";
import { useQueryClient } from "@tanstack/react-query";
import { Add, Check, Remove } from "@mui/icons-material";
import { Round } from "../../../types/round";
import { Notes } from "../../../types/notes";

interface UpdateMatchModalProps {
  open: boolean;
  handleClose: () => void;
  matchData: Match;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const padTo2Digits = (num: number) => num.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = padTo2Digits(date.getHours());
  const minutes = padTo2Digits(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const submitDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString();
};

const UpdateMatch: React.FC<UpdateMatchModalProps> = ({
  open,
  handleClose,
  matchData,
}) => {
  const { handleSubmit, control, watch, reset } = useForm<Match>({
    defaultValues: matchData,
  });
  const { id, eventId } = useParams<{ id: string; eventId: string }>();
  const updateMatch = useUpdateMatch();
  const createRound = useCreateRound();
  const createNotes = useCreateNote();
  const { data: sports } = useGetAllSports(eventId!);
  const { data: teams } = useGetAllTeams(eventId!);
  const [error] = React.useState<string | null>(null);
  const queryClient = useQueryClient();
  const { fields: roundFields, append: appendRound, remove: removeRound } = useFieldArray({ 
    control, name: "rounds", });
  const {fields: noteFields, append: appendNote, remove: removeNote } = useFieldArray({
    control,
    name: "notes",
  });

  const teamRedId = watch("teamRedId");
  const teamBlueId = watch("teamBlueId");

  useEffect(() => {
    reset({
      ...matchData,
      startTime: formatDate(matchData.startTime),
      endTime: formatDate(matchData.endTime),
    });
  }, [matchData, reset]);

  const roundSubmit: SubmitHandler<Round> = (data) => {
    const formattedData: Round = {
      ...data,
      teamRedScore: Number(data.teamRedScore),
      teamBlueScore: Number(data.teamBlueScore),
    };

    createRound.mutate(
      {
        eventId: eventId!,
        matchId: matchData.id,
        data: formattedData,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["rounds", eventId, matchData.id],
          });
        },
        onError: (error) => {
          console.log(error.message, "failed add round");
          handleClose();
        },
      }
    );
    console.log(data);
  };

  // const handleDeleteRound = async

  const noteRedSubmit: SubmitHandler<Notes> = (data) => {
    const noteRed: Notes = {
      ...data,
      description: data.description,
      teamId: matchData.teamRedId,
    };
    createNotes.mutate(
      {
        eventId: eventId!,
        matchId: matchData.id,
        data: noteRed,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["notes", eventId, matchData.id],
          });
        },
        onError: (error) => {
          console.log(error.message, "error add notes");
        },
      }
    );
  };

  const noteBlueSubmit: SubmitHandler<Notes> = (data) => {
    const noteBlue: Notes = {
      ...data,
      description: data.description,
      teamId: matchData.teamBlueId,
    };
    createNotes.mutate({
      eventId: eventId!,
      matchId: matchData.id,
      data: noteBlue,
    });
  };

  const onSubmit: SubmitHandler<Match> = async (data) => {
    const formattedData: Match = {
      ...data,
      startTime: submitDate(data.startTime),
      endTime: submitDate(data.endTime),
    };

    console.log("dapet id?", id, eventId);
    console.log("Submitting data:", formattedData);
    updateMatch.mutateAsync(
      {
        id: matchData.id,
        eventId: eventId!,
        data: formattedData,
      },
      {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Match updated successfully!",
            confirmButtonText: "Ok",
          });
          handleClose();
          queryClient.invalidateQueries({ queryKey: ["matches", eventId] });
        },
        onError: (error) => {
          Swal.fire({
            icon: "error",
            title: "Failed!",
            text:
              error instanceof Error
                ? error.message
                : "An unexpected error occurred.",
            confirmButtonText: "Ok",
          });
          handleClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle variant="h6" component="h2">
        Update Match
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
            <Grid item xs={8}>
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
                  >
                    {sports?.map((sport) => (
                      <MenuItem key={sport.id} value={sport.id}>
                        {sport.title}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={4}>
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
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
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
                      <MenuItem
                        key={team.id}
                        value={team.id}
                        disabled={team.id === teamBlueId}
                      >
                        {team.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={6}>
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
                      <MenuItem
                        key={team.id}
                        value={team.id}
                        disabled={team.id === teamRedId}
                      >
                        {team.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
          {/* for adding rounds + delete */}
          {roundFields.map((field, index) => (
            <Grid container spacing={2} key={field.id} mb={2}>
              <Grid item xs={6}>
                <Controller
                  name={`rounds.${index}.teamRedScore`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={`Team Red Score (Round ${index + 1})`}
                      type="number"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={5}>
                <Controller
                  name={`rounds.${index}.teamBlueScore`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={`Team Blue Score (Round ${index + 1})`}
                      type="number"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={1}>
                <IconButton sx={{ maxHeight: 8 }}>
                  <Remove onClick={() => removeRound(index)} />
                </IconButton>
                <IconButton
                  sx={{ maxHeight: 8 }}
                  onClick={() => {
                    const teamRedScore = Number(
                      watch(`rounds.${index}.teamRedScore`)
                    );
                    const teamBlueScore = Number(
                      watch(`rounds.${index}.teamBlueScore`)
                    );
                    const roundData = {
                      matchId: matchData.id,
                      matchRound: index + 1,
                      // teamRedScore: watch(`rounds.${index}.teamRedScore`),
                      // teamBlueScore: watch(`rounds.${index}.teamBlueScore`),
                      teamRedScore: teamRedScore,
                      teamBlueScore: teamBlueScore,
                    };
                    handleSubmit(() => roundSubmit(roundData))();
                  }}
                >
                  <Check />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button
            variant="contained"
            onClick={() =>
              appendRound({
                matchRound: length + 1,
                teamRedScore: 0,
                teamBlueScore: 0,
              })
            }
            startIcon={<Add />}
            fullWidth
            sx={{ mb: 2 }}
          >
            Add Round
          </Button>
          {/* notes untuk Team Red */}
          {noteFields
  .map((field, index) => 
    field.teamId === matchData.teamRedId && (
      <Grid container spacing={2} key={field.id} mb={2}>
        <Grid item xs={10}>
          <Controller
            name={`notes.${index}.description`}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Note for Team Red"
                variant="outlined"
                multiline
                rows={3}
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={2}>
          <IconButton onClick={() => removeNote(index)}>
            <Remove />
          </IconButton>
          <IconButton
            onClick={() => {
              const noteData = {
                eventId: eventId!,
                matchId: matchData.id,
                teamId: matchData.teamRedId,
                description: watch(`notes.${index}.description`),
              };
              handleSubmit(() => noteRedSubmit(noteData))();
            }}
          >
            <Check />
          </IconButton>
        </Grid>
      </Grid>
    )
  )}

<Button
  variant="contained"
  onClick={() =>
    appendNote({ teamId: matchData.teamRedId, description: "" })
  }
  startIcon={<Add />}
  fullWidth
  sx={{ mb: 2 }}
>
  Add Note for Team Red
</Button>

 {/* notes untuk Team Blue */}
{noteFields
  .map((field, index) => 
    field.teamId === matchData.teamBlueId && (
      <Grid container spacing={2} key={field.id} mb={2}>
        <Grid item xs={10}>
          <Controller
            name={`notes.${index}.description`}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Note for Team Blue"
                variant="outlined"
                multiline
                rows={3}
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={2}>
          <IconButton onClick={() => removeNote(index)}>
            <Remove />
          </IconButton>
          <IconButton
            onClick={() => {
              const noteData = {
                eventId: eventId!,
                matchId: matchData.id,
                teamId: matchData.teamBlueId,
                description: watch(`notes.${index}.description`),
              };
              handleSubmit(() => noteBlueSubmit(noteData))();
            }}
          >
            <Check />
          </IconButton>
        </Grid>
      </Grid>
    )
  )}

<Button
  variant="contained"
  onClick={() =>
    appendNote({ teamId: matchData.teamBlueId, description: "" })
  }
  startIcon={<Add />}
  fullWidth
  sx={{ mb: 2 }}
>
  Add Note for Team Blue
</Button>

          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Controller
                name="teamRedFinalScore"
                control={control}
                defaultValue={0}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Final Red Score"
                    type="number"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="teamBlueFinalScore"
                control={control}
                defaultValue={0}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Final Blue Score"
                    type="number"
                    variant="outlined"
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
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Start Time"
                    type="datetime-local"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="endTime"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="End Time"
                    type="datetime-local"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Button type="submit" variant="contained" fullWidth>
                Update Match
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button variant="contained" onClick={handleClose} fullWidth>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateMatch;
