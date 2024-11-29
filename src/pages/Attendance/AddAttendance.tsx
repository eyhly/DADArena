import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Dialog, DialogContent, DialogTitle, Grid, Typography, Button } from '@mui/material';
import { useCreateAttendance } from '../../services/mutation';
import { useQueryClient } from '@tanstack/react-query';
import { Attendance } from '../../types/attendance';
import { useAuthState } from '../../hook/useAuth';
import Swal from 'sweetalert2';
import axios from 'axios';

interface AddModalAttendance {
  open: boolean;
  handleClose: () => void;
}

interface Location {
  latitude: number | null;
  longitude: number | null;
}

const AddAttendance: React.FC<AddModalAttendance> = ({ open, handleClose }) => {
  const { eventId, scheduleId } = useParams<{ eventId: string; scheduleId: string }>();
  const { mutate } = useCreateAttendance();
  const queryClient = useQueryClient();
  const {data} = useAuthState();
  const user = data?.user;

  const [location, setLocation] = useState<Location | null>(null);
  useEffect(() => {
    if (open) {
      const getLocation = () => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
            const {latitude, longitude, accuracy} = position.coords;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Accuracy: ±${accuracy} meters`);            
            setLocation({latitude, longitude})
            },
            (error) => {
              console.error(error.message)
            },
            {enableHighAccuracy: true, timeout: 30000, maximumAge: 0}
          )
        } else {
          console.error("Geolocation is not supported by your browser")
        }
      }
      getLocation();
    }
  }, [open])

  const handleCreateAttendance = () => {
    if (!user?.profile.sub || !eventId || !scheduleId ) {
      console.error("Missing required data to create attendance.");
      return;
    }

    // if (!location?.latitude || !location?.longitude) {
    //   console.error("Location data is not available. Please enable location services.");
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Failed!',
    //     text: "Unable to fetch location. Please ensure your GPS is enabled.",
    //     confirmButtonText: 'Ok',
    //   });
    //   return;
    // }

    const attendanceData: Attendance = {
      userId: user?.profile.sub, 
      eventId,
      scheduleId,
      time: new Date().toISOString(), 
      userLatitude: location.latitude,
      userLongitude: location.longitude
    };
    console.log(attendanceData, "payload");
    

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
          if (axios.isAxiosError(error)){
          Swal.fire({
            icon: 'error',
            title: 'Failed!',
            text: error.response?.data,
            confirmButtonText: 'Ok'
          })
        }
          handleClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} >
      <DialogContent sx={{textAlign: 'center'}}>
        <DialogTitle>Add Attendance</DialogTitle>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography>Name: {user?.profile.name || "Unknown"}</Typography>
            <Typography>Latitude: {location?.latitude}</Typography>
            <Typography>Longitude: {location?.longitude}</Typography>
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
