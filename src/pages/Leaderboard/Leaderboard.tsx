import React from 'react';
import { Box, CircularProgress, Typography, Container, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetAllTotalPoints } from '../../services/queries'; 
import { TotalPoint } from '../../types/totalPoint';

const Leaderboard = () => {
  const { eventId } = useParams(); 
  const { data: totalPoints, isLoading, isError } = useGetAllTotalPoints(eventId!);

  // Handle loading state
  if (isLoading) {
    return (
      <Box sx={{ ml: 95, height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <Box sx={{ ml: 95, height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h6" color="error">
          Error fetching leaderboard data
        </Typography>
      </Box>
    );
  }

  // Handle empty data state
  if (!totalPoints || totalPoints.length === 0) {
    return (
      <Box sx={{ ml: 95, height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h6">
          No leaderboard data available
        </Typography>
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 4, ml: 65 }}>
      <Typography variant="h4" align="center" mb={4}>
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
