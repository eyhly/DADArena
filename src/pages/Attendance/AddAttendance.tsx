import React from 'react';
import { useParams } from 'react-router-dom';
import { Dialog, DialogContent, DialogTitle, Grid, Typography, Button } from '@mui/material';
import { useCreateAttendance } from '../../services/mutation';
import { useGetAllTeamMembers } from '../../services/queries';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth0 } from '@auth0/auth0-react';
import { Attendance } from '../../types/attendance';
import { TeamMember } from '../../types/teamMember';

interface AddModalAttendance {
  open: boolean;
  handleClose: () => void;
}

const AddAttendance: React.FC<AddModalAttendance> = ({ open, handleClose }) => {
  const { eventId, scheduleId } = useParams<{ eventId: string; scheduleId: string }>();
  const { user } = useAuth0(); 
  console.log('user?',user)
  const { data: teamMembers } = useGetAllTeamMembers(eventId!); // Fetch all team members based on event
  const { mutate } = useCreateAttendance();
  const queryClient = useQueryClient();

  // Find the logged-in user's team member record
  const userTeamMember = teamMembers?.find((member: TeamMember) => member.userId === user?.sub);

  const handleCreateAttendance = () => {
    if (!user?.sub || !eventId || !scheduleId || !userTeamMember) {
      console.error("Missing required data to create attendance.");
      return;
    }

    // Create attendance payload
    const attendanceData: Attendance = {
      id: "", 
      userId: user.sub, 
      teamId: userTeamMember.teamId, 
      eventId,
      scheduleId,
      time: new Date().toISOString(), 
    };

    mutate(
      { eventId, scheduleId, data: attendanceData }, 
      {
        onSuccess: () => {
          queryClient.invalidateQueries({queryKey: ['attendances', eventId, scheduleId]}); // Invalidate attendance queries to refetch
          handleClose(); // Close the modal after success
        },
        onError: (error) => {
          console.error('Error creating attendance:', error);
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <DialogTitle>Add Attendance</DialogTitle>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography>Name: {user?.nickname || "Unknown"}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>Team: {userTeamMember?.teamName || "No team found"}</Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateAttendance}
              // disabled={!userTeamMember} 
            >
              Add Attendance
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default AddAttendance;
