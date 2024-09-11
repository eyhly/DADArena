import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useUpdateSport } from '../../../services/mutation'; 
import { Sport } from '../../../types/sport'; 
import { useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';

interface UpdateSportProps {
  open: boolean;
  handleClose: () => void;
  sport: Sport;
}

const UpdateSport: React.FC<UpdateSportProps> = ({ open, handleClose, sport }) => {
  const queryClient = useQueryClient();
  const updateSportMutation = useUpdateSport();

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      title: sport.title,
      description: sport.description,
      minPlayer: sport.minPlayer,
      maxPlayer: sport.maxPlayer,
      minWomen: sport.minWomen,
      minMen: sport.minMen,
    },
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

  const onSubmit = async (data: Omit<Sport, 'id' | 'eventId'>) => {
    if (sport.id) {
      try {
        await updateSportMutation.mutateAsync({
          id: sport.id,
          data: { ...sport, ...data },
        });

        Swal.fire({
          icon: 'success',
          title: 'Sport Updated',
          text: 'Sport successfully updated!',
          confirmButtonText: 'OK',
        });

        queryClient.invalidateQueries({ queryKey: ['sports'] });
        handleClose();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: error instanceof Error ? error.message : "An unexpected error occurred.",
          confirmButtonText: 'OK',
        });
        handleClose();
      }
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
              label="Title"
              type="text"
              fullWidth
              variant="outlined"
              disabled={isSubmitting}
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
              label="Min Players"
              type="number"
              fullWidth
              variant="outlined"
              disabled={isSubmitting}
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
              label="Max Players"
              type="number"
              fullWidth
              variant="outlined"
              disabled={isSubmitting}
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
              label="Min Women"
              type="number"
              fullWidth
              variant="outlined"
              disabled={isSubmitting}
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
              label="Min Men"
              type="number"
              fullWidth
              variant="outlined"
              disabled={isSubmitting}
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
              value={field.value ?? ""}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              disabled={isSubmitting}
            />
          )}
        />
        </Grid>
      </Grid>
      </DialogContent>
      <Grid item xs={12}>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          Update
        </Button>
      </DialogActions>
        </Grid>
    </Dialog>
  );
};

export default UpdateSport;
