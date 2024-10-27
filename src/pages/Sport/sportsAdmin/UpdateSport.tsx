import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useUpdateSport } from "../../../services/mutation";
import { Sport } from "../../../types/sport";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { zodResolver } from "@hookform/resolvers/zod";
import { sportSchema } from "../../../utils/schema";

interface UpdateSportProps {
  open: boolean;
  handleClose: () => void;
  sport: Sport;
}

const UpdateSport: React.FC<UpdateSportProps> = ({
  open,
  handleClose,
  sport,
}) => {
  const queryClient = useQueryClient();
  const updateSportMutation = useUpdateSport();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: sport.title,
      description: sport.description,
      minPlayer: sport.minPlayer,
      maxPlayer: sport.maxPlayer,
      minWomen: sport.minWomen,
      minMen: sport.minMen,
    },
    resolver: zodResolver(sportSchema)
  });

  useEffect(() => {
    reset({
      title: sport.title,
      description: sport.description,
      minPlayer: sport.minPlayer,
      maxPlayer: sport.maxPlayer,
      minWomen: sport.minWomen,
      minMen: sport.minMen,
    });
  }, [sport, reset]);

  const onSubmit = async (data: Omit<Sport, "id" | "eventId">) => {
    if (sport.id && sport.eventId) {
      updateSportMutation.mutateAsync(
        {
          id: sport.id,
          eventId: sport.eventId,
          data: { ...sport, ...data,
            minPlayer: Number(data.minPlayer),
            maxPlayer: Number(data.maxPlayer),
            minWomen: Number(data.minWomen),
            minMen: Number(data.minMen),
          },
        },
        {
          onSuccess: () => {
            Swal.fire({
              icon: "success",
              title: "Sport Updated",
              text: "Sport successfully updated!",
              confirmButtonText: "OK",
            });

            queryClient.invalidateQueries({ queryKey: ["sports"] });
            handleClose();
          },
          onError: (error) => {
            Swal.fire({
              icon: "error",
              title: "Update Failed",
              text:
                error instanceof Error
                  ? error.message
                  : "An unexpected error occurred.",
              confirmButtonText: "OK",
            });
            handleClose();
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Update Sport</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  autoFocus
                  margin="dense"
                  label={<Typography component="span">
                    Sport Title <Typography component="span" color="red" >
                      *
                    </Typography>
                  </Typography>}
                  type="text"
                  fullWidth
                  variant="outlined"
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
                  margin="dense"
                  label={<Typography component="span">
                    Min Player <Typography component="span" color="red" >
                      *
                    </Typography> 
                  </Typography>}
                  type="number"
                  onChange={(e) => {
                    field.onChange(Number(e.target.value))
                  }}
                  fullWidth
                  error={!!errors.minPlayer}
                  helperText={errors.minPlayer?.message}
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="maxPlayer"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="dense"
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
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="dense"
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
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="dense"
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
                  value={field.value ?? ""}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <Grid item xs={12}>
        <DialogActions>
          <Button onClick={handleClose} >
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} >
            Update
          </Button>
        </DialogActions>
      </Grid>
    </Dialog>
  );
};

export default UpdateSport;
