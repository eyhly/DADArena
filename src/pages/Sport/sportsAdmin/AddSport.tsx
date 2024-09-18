import React from "react";
import {
  TextField,
  Button,
  ThemeProvider,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Box,
} from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useCreateSport } from "../../../services/mutation";
import { useParams } from "react-router-dom";
import ColorTheme from "../../../utils/ColorTheme";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { Sport } from "../../../types/sport";

const AddSport: React.FC<{ open: boolean; handleClose: () => void }> = ({
  open,
  handleClose,
}) => {
  const { handleSubmit, control, reset } = useForm<Sport>();
  const { eventId } = useParams();
  const createSport = useCreateSport();
  const queryClient = useQueryClient();

  const onSubmit: SubmitHandler<Sport> = async (data) => {
    try {
      await createSport.mutateAsync({
        title: data.title,
        minPlayer: data.minPlayer,
        maxPlayer: data.maxPlayer,
        minWomen: data.minWomen,
        minMen: data.minMen,
        description: data.description,
        eventId: eventId!,
      });
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Sport added successfully!",
        confirmButtonText: "Ok",
      });
      queryClient.invalidateQueries({ queryKey: ["sports"] });
      handleClose();
      reset();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
        confirmButtonText: "Ok",
      });
    }
  };

  return (
    <ThemeProvider theme={ColorTheme}>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogTitle variant="h6" component="h2" sx={{ mb: 2 }}>
            Add Sport
          </DialogTitle>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name="title"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Sport Title"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="minPlayer"
                  control={control}
                  defaultValue={0}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Min Player"
                      type="number"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="maxPlayer"
                  control={control}
                  defaultValue={0}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Max Player"
                      type="number"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="minWomen"
                  control={control}
                  defaultValue={0}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Min Women"
                      type="number"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="minMen"
                  control={control}
                  defaultValue={0}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Min Men"
                      type="number"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="dense"
                      label="Description"
                      type="text"
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={4}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" fullWidth>
                  Add Sport
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default AddSport;
