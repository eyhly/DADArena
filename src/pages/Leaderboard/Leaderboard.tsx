import React from 'react';
import { Box, CircularProgress, Typography, Container, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetAllTotalPoints } from '../../services/queries'; 
import { TotalPoint } from '../../types/totalPoint';

const Leaderboard = () => {
  const { eventId } = useParams(); 
  const { data: totalPoints, isLoading, isError } = useGetAllTotalPoints(eventId!);

  if (isLoading) {
    return (
      <Box sx={{ display: 'block', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant='h6'>Loading...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ display: "block", justifyContent: "center", textAlign:'center', alignItems: 'center', ml: 20}}>
        <Typography variant="h6" color="error">
          Error fetching leaderboard data
        </Typography>
      </Box>
    );
  }

  if (!totalPoints || totalPoints.length === 0) {
    return (
      <Box sx={{ display: "block", justifyContent: "center", textAlign:'center', alignItems: 'center', ml: 20}}>
        <Typography variant="h6">
          No leaderboard data available
        </Typography>
      </Box>
    );
  }

  return (
    <Container sx={{ mb: 4, mr: 5, minWidth: '1200px', minHeight: 550, maxHeight: 550 }}>
      <Typography variant="h4" align="center"sx={{mb: 2, mt: 5}}>
        Leaderboard
      </Typography>
      <Paper elevation={4} sx={{ padding: 2, marginBottom: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <Typography variant="h6">Rank</Typography>
          <Typography variant="h6">Team</Typography>
          <Typography variant="h6">Total Points</Typography>
        </Box>
      </Paper>
      {totalPoints.map((point: TotalPoint) => (
        <Paper key={point.teamId} sx={{ padding: 1, marginBottom: 1, backgroundColor: point.rank == 1 ? 'primary.main' : 'background.paper' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mx: 3 }}>
            <Typography>{point.rank}</Typography>
            <Typography>{point.teamName}</Typography>
            <Typography>{point.totalPoints}</Typography>
          </Box>
        </Paper>
      ))}
    </Container>
  );
};

export default Leaderboard;
