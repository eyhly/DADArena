import React, { useEffect, useState } from "react";
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
  useDeleteNote,
  useDeleteRound,
  useUpdateMatch,
  useUpdateNote,
  useUpdateRound,
} from "../../services/mutation";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Match } from "../../types/match";
import {
  useGetAllNotes,
  useGetAllRound,
  useGetAllSports,
  useGetAllTeams,
} from "../../services/queries";
import { useQueryClient } from "@tanstack/react-query";
import { Add, Check, Remove } from "@mui/icons-material";
import { Round } from "../../types/round";
import { Notes } from "../../types/notes";
import axios from "axios";

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
  const status = watch("status");
  const isComingSoon = status.includes("comingSoon");
  const updateMatch = useUpdateMatch();

  //round
  const createRound = useCreateRound();
  const updateRound = useUpdateRound();
  const deleteRound = useDeleteRound();

  //notes
  const createNotes = useCreateNote();
  const updateNotes = useUpdateNote();
  const deleteNotes = useDeleteNote();

  const { data: notes } = useGetAllNotes(
    eventId!,
    matchData.id!
  );
  const { data: rounds } = useGetAllRound(eventId!, matchData.id!);
  const { data: sports } = useGetAllSports(eventId!);
  const { data: teams } = useGetAllTeams(eventId!);

  // State buat add note round
  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const {
    fields: roundFields,
    append: appendRound,
    remove: removeRound,
  } = useFieldArray({
    control,
    name: "rounds",
  });
  const {
    fields: noteFields,
    append: appendNote,
    remove: removeNote,
  } = useFieldArray({
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
      rounds: rounds || [],
      notes: notes || [],
    });
  }, [matchData, rounds, notes, reset]);

  const handleRoundSubmit = async (index: number) => {
    const teamRedScore = Number(watch(`rounds.${index}.teamRedScore`));
    const teamBlueScore = Number(watch(`rounds.${index}.teamBlueScore`));

    // Cari round yang sudah ada di database
    const existingRound = rounds?.find((r) => r.matchRound === index + 1);
    console.log("exiting rounds", existingRound);

    const roundData: Round = {
      matchId: matchData.id,
      matchRound: index + 1,
      teamRedScore,
      teamBlueScore,
    };

    if (existingRound) {
      // jika ada roundnya, yang dipanggil update
      await updateRound.mutateAsync({
        id: existingRound.id,
        eventId: matchData.eventId!,
        matchId: matchData.id!,
        data: roundData,
      },
      {
        onSuccess: ()=> {
          queryClient.invalidateQueries({queryKey: ['rounds', eventId, matchData.id]})
          console.log("berhasil update round coyy");
        },
        onError : (error) => {
          console.error("gabisa update round cik", error);
        }
      });
    } else {
      //kalo belum ada ya buat baru
      await createRound.mutateAsync(
        {
          eventId: matchData.eventId!,
          matchId: matchData.id!,
          data: roundData,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["rounds", eventId, matchData.id],
            });
            console.log("berhasil add round coyy");
          },
          onError: (error) => {
            console.error("gabisa add round cik", error);
          },
        }
      );
    }
  };

  const handleDeleteRound = async (index: number) => {
    // Cari round yang akan dihapus
    const roundToDelete = rounds?.[index];

    if (!roundToDelete) {
      console.log("gada round nya kah???");
      return;
    }
    // Hapus round dari database
    await deleteRound.mutateAsync(
      {
        eventId: matchData.eventId!,
        matchId: matchData.id!,
        id: roundToDelete.id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["rounds", eventId, matchData.id],
          });
          removeRound(index);
          console.log("berhasil hapus round coyyyyy");
        },
        onError: (error) => {
          console.error("gagal delete round cik", error);
        },
      }
    );
  };

  const handleNoteSubmit = async (
    index: { id: string; teamId: string }[],
    teamId: string,
    noteId: string,
    indexPosition: number,
  ) => {

    const description = watch(
      `notes.${noteFields.findIndex((n) => n.id === index[0].id)}.description`
    );

    const noteData: Notes = {
      teamId,
      description,
      matchId: matchData.id,
      eventId: matchData.eventId,
    };

    const noteToCheck = notes?.[indexPosition] 

      if (noteToCheck) {
        // Update the note if it exists
        await updateNotes.mutateAsync({
          id: noteToCheck.id,
          eventId: matchData.eventId!,
          matchId: matchData.id!,
          data: noteData,
        }, 
      {
        onSuccess : () => {
          queryClient.invalidateQueries({queryKey:['notes', eventId, matchData.id]})
          console.log("berhhasil update note");
        },
        onError : (error) => {
          console.error("gagal update note", error);
        }
      });
      } else {
        // Create a new note if it doesn't exist
        await createNotes.mutateAsync({
          eventId: matchData.eventId!,
          matchId: matchData.id!,
          data: noteData,
        },
        {
          onSuccess : () => {
            queryClient.invalidateQueries({queryKey:['notes', eventId, matchData.id]})
            console.log("berhhasil add note");
          },
          onError : (error) => {
            console.error("gagal add note", error);
          }
        });
      }
  };

  const handleDeleteNote = async (id: string, index: number) => {
    const noteToDelete = notes?.[index];
      // Hapus note dari database
      await deleteNotes.mutateAsync({
        id: noteToDelete.id,
        eventId: matchData.eventId!,
        matchId: matchData.id!,
      }, 
    {
      onSuccess : () => {
        queryClient.invalidateQueries({queryKey:['notes', eventId, matchData.id]})
        console.log("berhasil delete note hehe");
        removeNote(index);
      },
      onError : (error) => {
        console.log("gagal delete note :(((", error);
      }
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
    await updateMatch.mutateAsync(
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
          if (axios.isAxiosError(error)) {
            console.log(error.response?.data);
            Swal.fire({
              icon: "error",
              title: "Failed!",
              text: error.response?.data,
              confirmButtonText: "Ok",
            });
          }
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
          {roundFields.map((round, index) => (
            <Grid container spacing={2} key={round.id} mb={2}>
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
                  <Remove onClick={() => handleDeleteRound(index)} />
                </IconButton>
                <IconButton
                  sx={{ maxHeight: 8 }}
                  onClick={() => {
                    handleRoundSubmit(index);
                  }}
                >
                  <Check />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          <Button
            variant="contained"
            onClick={() => {
              appendRound({
                matchRound: (roundFields.length || 0) + 1,
                teamRedScore: 0,
                teamBlueScore: 0,
              });
            }}
            startIcon={<Add />}
            fullWidth
            sx={{ mb: 2 }}
            disabled={isComingSoon}
          >
            Add Round
          </Button>

          {/* notes untuk Team Red */}
          {noteFields
            .filter((note) => note.teamId === matchData.teamRedId)
            .map((note) => {              
              return (
                <Grid container spacing={2} key={note.id} mb={2}>
                  <Grid item xs={10}>
                    <Controller
                      name={`notes.${noteFields.findIndex((n) => n.id === note.id)}.description`}
                      control={control}
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
                    <IconButton
                      onClick={() => {
                        const originalIndex = noteFields.findIndex(
                          (n) => n.id === note.id
                        );
                      
                        handleDeleteNote(note.id, originalIndex);
                      }}
                    >
                      <Remove />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        const originalIndex = noteFields.filter(
                          (n) => n.id === note.id
                        );
                        const indexPosition = noteFields.findIndex(
                          (n) => n.id === note.id
                        )
  
                        handleNoteSubmit(
                          originalIndex,
                          matchData.teamRedId,
                          note.id,
                          indexPosition
                        );
                      }}
                    >
                      <Check />
                    </IconButton>
                  </Grid>
                </Grid>
              )
            })}

          <Button
            variant="contained"
            onClick={() => {
              appendNote({ teamId: matchData.teamRedId, description: "" });
              setEditingNoteIndex(noteFields.length);
            }}
            startIcon={<Add />}
            fullWidth
            sx={{ mb: 2 }}
            disabled={isComingSoon}
          >
            Add Note for Team Red
          </Button>

          {/* Notes for Team Blue */}
          {noteFields
            .filter((note) => note.teamId === matchData.teamBlueId)
            .map((note) => (
              <Grid container spacing={2} key={note.id} mb={2}>
                <Grid item xs={10}>
                  <Controller
                    name={`notes.${noteFields.findIndex((n) => n.id === note.id)}.description`}
                    control={control}
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
                  <IconButton
                    onClick={() => {
                      const originalIndex = noteFields.findIndex(
                        (n) => n.id === note.id
                      );
                      handleDeleteNote(note.id, originalIndex);
                    }}
                  >
                    <Remove />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      const originalIndex = noteFields.filter(
                        (n) => n.id === note.id
                      );
                      const indexPosition = noteFields.findIndex(
                        (n) => n.id === note.id
                      )
                      handleNoteSubmit(
                        originalIndex,
                        matchData.teamBlueId,
                        note.id,
                        indexPosition
                      );
                    }}
                  >
                    <Check />
                  </IconButton>
                </Grid>
              </Grid>
            ))}

          <Button
            variant="contained"
            onClick={() => {
              appendNote({ teamId: matchData.teamBlueId, description: "" });
              setEditingNoteIndex(noteFields.length);
            }}
            startIcon={<Add />}
            fullWidth
            sx={{ mb: 2 }}
            disabled={isComingSoon}
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
                    disabled={isComingSoon}
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
                    disabled={isComingSoon}
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
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isComingSoon}
              >
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
