import React, { useState, useEffect } from 'react';
import { DialogContent, Button, Dialog, TextField, Typography } from '@mui/material';
import { useUpdateTeam } from '../../../services/mutation';
import { useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { Team } from '../../../types/team';

interface UpdateModalProps {
  eventId: string;
  open: boolean;
  onClose: () => void;
  selectedTeam: Team | null;
}

const UpdateTeam: React.FC<UpdateModalProps> = ({ eventId, open, onClose, selectedTeam }) => {
  const [teamName, setTeamName] = useState('');
  const queryClient = useQueryClient();
  const updateTeam = useUpdateTeam();

  useEffect(() => {
    if (selectedTeam) {
      setTeamName(selectedTeam.name);
    }
  }, [selectedTeam]);

  const handleUpdateTeam = async () => {
    if (!teamName || !selectedTeam) return;

    try {
      await updateTeam.mutateAsync({
        id: selectedTeam.id,
        data: { ...selectedTeam, name: teamName }, // Mengirim data yang benar
        eventId
      });
      queryClient.invalidateQueries({ queryKey: ['teams', eventId] });
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Team updated successfully!',
        confirmButtonText: 'Ok',
      });
      onClose();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : 'Failed to update team!',
        confirmButtonText: 'Ok',
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Typography variant="h6" mb={2}>
          Update Team
        </Typography>
        <TextField
          label="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" onClick={handleUpdateTeam}>
          Update
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTeam;
