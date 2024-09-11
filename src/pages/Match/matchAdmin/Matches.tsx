import React, { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Box,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import ColorTheme from "../../../utils/ColorTheme";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Match } from "../../../types/match";
import { Sport } from "../../../types/sport";
import { Team } from "../../../types/team"; // Ensure this type is defined
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteMatch } from "../../../services/mutation";
import AddMatch from "./AddMatch";
import UpdateMatch from "./UpdateMatch";
import { useGetAllMatches, useGetAllSports, useGetAllTeams } from "../../../services/queries";

const Matches = () => {
  const { eventId, sportId } = useParams<{ eventId: string, sportId: string }>();
  const queryClient = useQueryClient();
  const deleteMatch = useDeleteMatch();
  
  // match sesuai sama sport & events
  const { data: matches, isLoading: matchesLoading, isError: matchesError } = useGetAllMatches(eventId!, sportId!);
  const { data: sports, isLoading: sportsLoading, isError: sportsError } = useGetAllSports(eventId!);
  const { data: teams, isLoading: teamsLoading, isError: teamsError } = useGetAllTeams(eventId!);
  

  const [isAddMatchModalOpen, setAddMatchModalOpen] = useState(false);
  const [isUpdateMatchModalOpen, setUpdateMatchModalOpen] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);

  const handleDelete = async (id: string) => {
    const confirmation = await Swal.fire({
      title: "Are you sure want to delete this match?",
      text: "You can cancel!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (confirmation.isConfirmed) {
      try {
        await deleteMatch.mutateAsync(id);
        queryClient.invalidateQueries({ queryKey: ['matches'] });
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Match deleted successfully!",
          confirmButtonText: "Ok",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: error instanceof Error ? error.message : "An unexpected error occurred.",
          confirmButtonText: "Ok",
        });
      }
    }
  };

  const openAddMatchModal = () => {
    setAddMatchModalOpen(true);
  };

  const closeAddMatchModal = () => {
    setAddMatchModalOpen(false);
  };

  const openUpdateMatchModal = (match: Match) => {
    setCurrentMatch(match);
    setUpdateMatchModalOpen(true);
  };

  const closeUpdateMatchModal = () => {
    setUpdateMatchModalOpen(false);
    setCurrentMatch(null);
  };

  if (matchesLoading || sportsLoading || teamsLoading) {
    return (
      <Container sx={{ textAlign: "center", marginTop: 4, ml: 70 }}>
        <CircularProgress />
        <Typography variant="h6" component="div" sx={{ marginTop: 2 }}>
          Loading data...
        </Typography>
      </Container>
    );
  }

  if (matchesError || sportsError || teamsError) {
    return (
      <Container sx={{ textAlign: "center", marginTop: 4, ml: 70 }}>
        <Typography variant="h6" component="div" sx={{ color: "red" }}>
          Failed to load data.
        </Typography>
      </Container>
    );
  }

  // Filter matches based on sportId
  const filteredMatches = matches?.filter((match: Match) => match.sportId === sportId);
  console.log("harusnya dapet nih match", matches)

  if (filteredMatches && filteredMatches.length === 0) {
    return (
      <Container sx={{ textAlign: "center", marginTop: 4, ml: 70 }}>
        <Typography variant="h6">No matches found for this sport.</Typography>
      </Container>
    );
  }

  // For getting the name team and title sport
  const sportMap = new Map(sports?.map((sport: Sport) => [sport.id, sport.title]));
  const teamMap = new Map(teams?.map((team: Team) => [team.id, team.name]));

  return (
    <ThemeProvider theme={ColorTheme}>
      <Typography variant="h2" sx={{ mt: -20, ml: 85, mb: 3 }}>List Matches</Typography>
      <Button size="small" variant="contained" sx={{ ml: 170, mb: 3, maxHeight: 50, maxWidth: '100%' }} onClick={openAddMatchModal}>
        <AddOutlinedIcon /> Create Match
      </Button>
      <Container sx={{ mt: 4, ml: 40 }}>
        <Grid container spacing={4}>
          {filteredMatches?.map((match: Match) => (
            <Grid item xs={12} sm={6} md={4} key={match.id}>
              <Paper elevation={3} sx={{ padding: 3 }}>
                <Box mt={2} sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Grid item xs={6} sx={{ mt: -2, mb: 2 }}>
                    <Typography variant="h5" sx={{ mb: 1 }}>
                      {sportMap.get(match.sportId) || "Unknown Sport"}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {new Date(match.date).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Typography variant="body1" color="textSecondary">
                    {match.status}
                  </Typography>
                </Box>
                <Grid container spacing={3} sx={{ textAlign: "center" }}>
                  <Grid item xs={4}>
                    <Typography variant="h6">{teamMap.get(match.teamRedId) || "Unknown Team"}</Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {match.teamRedScore ?? 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography color="">VS</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h6">{teamMap.get(match.teamBlueId) || "Unknown Team"}</Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {match.teamBlueScore ?? 0}
                    </Typography>
                  </Grid>
                </Grid>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  Venue: {match.venue}
                </Typography>
                <Box sx={{ display: "flex", mt: 3, mb: -1 }}>
                  <Button
                    size="small"
                    onClick={() => openUpdateMatchModal(match)}
                  >
                    <EditCalendarOutlinedIcon />
                    Update
                  </Button>
                  <Button
                    size="small"
                    sx={{ color: "red" }}
                    onClick={() => handleDelete(match.id)}
                  >
                    <DeleteOutlineOutlinedIcon />
                    Delete
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <AddMatch open={isAddMatchModalOpen} handleClose={closeAddMatchModal} />
      {currentMatch && (
        <UpdateMatch
          open={isUpdateMatchModalOpen}
          handleClose={closeUpdateMatchModal}
          matchData={currentMatch}
        />
      )}
    </ThemeProvider>
  );
};

export default Matches;
