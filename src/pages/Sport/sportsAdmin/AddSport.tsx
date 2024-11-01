import React from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useCreateSport } from "../../../services/mutation";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { Sport } from "../../../types/sport";
import { zodResolver } from "@hookform/resolvers/zod";
import { sportSchema } from "../../../utils/schema";

const AddSport: React.FC<{ open: boolean; handleClose: () => void }> = ({
  open,
  handleClose,
}) => {
  const { handleSubmit, control, reset, formState: {errors} } = useForm<Sport>({
    resolver: zodResolver(sportSchema)
  });
  const { eventId } = useParams();
  const createSport = useCreateSport();
  const queryClient = useQueryClient();

  const onSubmit: SubmitHandler<Sport> = (data) => {
    createSport.mutate(
      {
        title: data.title,
        minPlayer: Number(data.minPlayer),
        maxPlayer: Number(data.maxPlayer),
        minWomen: Number(data.minWomen),
        minMen: Number(data.minMen),
        description: data.description,
        eventId: eventId!,
      },
      {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Sport added successfully!",
            confirmButtonText: "Ok",
          });
          queryClient.invalidateQueries({ queryKey: ["sports"] });
          handleClose();
          reset();
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
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<Typography component="span">
                        Sport Title <Typography component="span" color="red" >
                          *
                        </Typography>
                      </Typography>}
                      variant="outlined"
                      fullWidth
                      error={!!errors.title}
                     helperText={errors.title?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="minPlayer"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<Typography component="span">
                        Min Player <Typography component="span" color="red" >
                          *
                        </Typography> 
                      </Typography>}
                      type="number"
                      variant="outlined"
                      onChange={(e) => {
                        field.onChange(Number(e.target.value))
                      }}
                      fullWidth
                      error={!!errors.minPlayer}
                      helperText={errors.minPlayer?.message}
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
                      label={<Typography component="span">
                        Max Player <Typography component="span" color="red" >
                          *
                        </Typography>
                      </Typography>}
                      type="number"
                      variant="outlined"
                      onChange={(e) => {
                        field.onChange(Number(e.target.value))
                      }}
                      fullWidth
                      error={!!errors.maxPlayer}
                      helperText={errors.maxPlayer?.message}
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
                      label={<Typography component="span">
                        Min Women <Typography component="span" color="red" >
                          *
                        </Typography>
                      </Typography>}
                      type="number"
                      variant="outlined"
                      onChange={(e) => {
                        field.onChange(Number(e.target.value))
                      }}
                      fullWidth
                      error={!!errors.minWomen}
                      helperText={errors.minWomen?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="minMen"
                  control={control}
                  defaultValue={1}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<Typography component="span">
                        Min Men <Typography component="span" color="red" >
                          *
                        </Typography>
                      </Typography>}
                      type="number"
                      variant="outlined"
                      onChange={(e) => {
                        field.onChange(Number(e.target.value))
                      }}
                      fullWidth
                      error={!!errors.minMen}
                      helperText={errors.minMen?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="dense"
                      label={<Typography component="span">
                        Description <Typography component="span" color="red" >
                          *
                        </Typography>
                      </Typography>}
                      type="text"
                      fullWidth
                      variant="outlined"
                      error={!!errors.description}
                      helperText={errors.description?.message}
                      multiline
                      rows={4}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Button type="submit" variant="contained" fullWidth>
                  Add Sport
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button onClick={handleClose} variant="contained" fullWidth>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
  );
};

export default AddSport;
