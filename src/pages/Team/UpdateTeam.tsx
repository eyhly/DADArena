import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  DialogActions,
  Grid,
} from '@mui/material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useUpdateTeam } from '../../services/mutation';
import { useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { Team } from '../../types/team';
import axios from 'axios';

interface UpdateModalProps {
  open: boolean;
  onClose: () => void;
  selectedTeam: Team | null;
  eventId: string;
}

const UpdateTeam: React.FC<UpdateModalProps> = ({ open, onClose, selectedTeam }) => {
  const { eventId } = useParams<{ eventId: string }>(); 
  const { handleSubmit, control, reset } = useForm<Team>({
    defaultValues: selectedTeam || {}
  });
  const updateTeam = useUpdateTeam();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (selectedTeam) {
      reset(selectedTeam);
    }
  }, [selectedTeam, reset]);

  const onSubmit: SubmitHandler<Team> = async (data) => {
    if (!eventId) return; 
    updateTeam.mutateAsync({ id: data.id, data, eventId },
      {
        onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Team updated successfully!',
        confirmButtonText: 'Ok',
      });
      onClose();
      queryClient.invalidateQueries({queryKey:['teams', eventId]});
    }, 
    onError: (error) => {
      if (axios.isAxiosError(error)){
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data,
        confirmButtonText: 'Ok',
      });
    }
      onClose();
    }
  })
  };

  return (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle variant="h6" component="h2" >
          Update Team
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Team Name"
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 2 }}
                />
              )}
            />
            <DialogActions>
            <Button type="submit" variant="contained" fullWidth>
              Update Team
            </Button>
            <Button onClick={onClose} variant="contained" fullWidth sx={{ mt: 2 }}>
              Close
            </Button>
            </DialogActions>
          </Box>
          </Grid>
        </DialogContent>
    </Dialog>
  );
};

export default UpdateTeam;
