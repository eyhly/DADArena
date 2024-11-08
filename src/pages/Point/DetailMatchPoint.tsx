import React from 'react';
import { Modal, Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import { TotalPoint } from '../../types/totalPoint'; 

interface DetailMatchPointProps {
  open: boolean;
  onClose: () => void;
  selectedTeamPoints: TotalPoint | null; 
  getTeamNameById: (teamId: string) => string;
}

const DetailMatchPoint: React.FC<DetailMatchPointProps> = ({
  open,
  onClose,
  selectedTeamPoints,
  getTeamNameById,
}) => {
   if (!selectedTeamPoints) return null;

  const { matchPoints = [], totalPoints, teamId } = selectedTeamPoints;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: '80%',
          maxWidth: 800,
          padding: 3,
          backgroundColor: 'white',
          margin: 'auto',
          marginTop: '5%',
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        {/* Header Section */}
        <Typography variant="h6" gutterBottom>
          {getTeamNameById(teamId)} - Match Point Details
        </Typography>

        {/* Table to display matchPoints */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Week</TableCell>
              <TableCell>Sport</TableCell>
              <TableCell>Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matchPoints.map((point, index) => (
              <TableRow key={index}>
                <TableCell>{point.week}</TableCell>
                <TableCell>{point.sportTitle}</TableCell>
                <TableCell>{point.matchPoint}</TableCell>
              </TableRow>
            ))}
            <TableRow>
          <TableCell colSpan={2} align="right" sx={{ fontWeight: 'bold' }}>
            Total Points:
          </TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>
            {totalPoints}
          </TableCell>
        </TableRow>
          </TableBody>
        </Table>
      <Button onClick={onClose} variant='contained' sx={{mt: 2}}>
        Close
      </Button>
      </Box>
    </Modal>
  );
};

export default DetailMatchPoint;
