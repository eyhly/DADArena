import React from 'react';
import { useParams } from 'react-router-dom';
import { Dialog, DialogContent, DialogTitle, Grid, Typography, Button } from '@mui/material';
import { useCreateAttendance } from '../../services/mutation';
import { useQueryClient } from '@tanstack/react-query';
import { Attendance } from '../../types/attendance';
import { useAuthState } from '../../hook/useAuth';
import Swal from 'sweetalert2';

interface AddModalAttendance {
  open: boolean;
  handleClose: () => void;
}

const AddAttendance: React.FC<AddModalAttendance> = ({ open, handleClose }) => {
  const { eventId, scheduleId } = useParams<{ eventId: string; scheduleId: string }>();
  const { mutate } = useCreateAttendance();
  const queryClient = useQueryClient();
  const {data} = useAuthState();
  const user = data?.user;

  const handleCreateAttendance = () => {
    if (!user?.profile.sub || !eventId || !scheduleId ) {
      console.error("Missing required data to create attendance.");
      return;
    }

    const attendanceData: Attendance = {
      userId: user?.profile.sub, 
      eventId,
      scheduleId,
      time: new Date().toISOString(), 
    };

    mutate(
      { eventId, scheduleId, data: attendanceData }, 
      {
        onSuccess: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: "You've already absence ontime!",
            confirmButtonText: 'Ok!',
          })
          queryClient.invalidateQueries({queryKey: ['attendances', scheduleId, eventId]}); 
          handleClose(); 
        },
        onError: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: error instanceof Error ? error.message : "An error occured",
            confirmButtonText: 'Ok'
          })
          handleClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent sx={{textAlign: 'center'}}>
        <DialogTitle>Add Attendance</DialogTitle>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography>Name: {user?.profile.name || "Unknown"}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateAttendance}
            >
              Create Attendance
            </Button>
          </Grid>
          </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default AddAttendance;
