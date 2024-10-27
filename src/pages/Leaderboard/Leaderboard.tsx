import React from 'react';
import { Box, CircularProgress, ThemeProvider, Typography, List, ListItem, ListItemText, Divider, Paper, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetAllTeams, useGetAllTotalPoints } from '../../services/queries'; 
import ColorTheme from '../../utils/colorTheme'; 

const Leaderboard = () => {
  const { eventId } = useParams(); 
  const { data: totalPoints, isLoading, isError } = useGetAllTotalPoints(eventId!); // Mengambil data total poin
  const { data: teams } = useGetAllTeams(eventId!); 

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6" color="error">
          Error fetching leaderboard data
        </Typography>
      </Box>
    );
  }

  if (!totalPoints || totalPoints.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">
          No leaderboard data available
        </Typography>
      </Box>
    );
  }

  const getTeamName = (teamId: string) => {
    const team = teams?.find((team: any) => team.id === teamId);
    return team ? team.name : 'Unknown Team';
  };

  const sortedPoints = [...totalPoints].sort((a, b) => b.totalPoints - a.totalPoints);

  const generateRankings = () => {
    let rank = 1;
    let prevPoints : number | null = null;
    let skipRank = 0; //memastikan rank nya tidak lompat meski ada rank yang kembar
  
    return sortedPoints.map((team, index) => {
      if (index > 0 && team.totalPoints === prevPoints) {
        skipRank++; 
        return rank; 
      } else {
        rank = index + 1 - skipRank; 
        prevPoints = team.totalPoints;
        return rank;
      }
    });
  };

  const rankings = generateRankings(); 

  return (
    <ThemeProvider theme={ColorTheme}>
      <Box sx={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
       
        <Typography variant="h4" sx={{ ml: 65, mb: 3 }}>
          Leaderboard
        </Typography>

        <Paper elevation={3} sx={{ padding: 3, ml:65 }}>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <List>
                {sortedPoints.map((team: any, index: number) => (
                  <React.Fragment key={team.teamId}>
                    <ListItem sx={{maxWidth: 1000, justifyContent: 'space-between', px: 5  }}>
                      <ListItemText 
                        primary={`${rankings[index]}. ${getTeamName(team.teamId)}`} 
                      />
                      <ListItemText
                        secondary={`Total Points: ${team.totalPoints}`} 
                      />
                    </ListItem>
                    {index < totalPoints.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default Leaderboard;