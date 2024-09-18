import React, { useMemo, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Box,
  Menu,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import ColorTheme from "../../../utils/ColorTheme";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Match } from "../../../types/match";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteMatch } from "../../../services/mutation";
import AddMatch from "./AddMatch";
import UpdateMatch from "./UpdateMatch";
import { useGetAllMatches } from "../../../services/queries";

const Matches = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const queryClient = useQueryClient();
  const deleteMatch = useDeleteMatch();

  const { data: matches, isLoading: matchesLoading, isError: matchesError } = useGetAllMatches(eventId!);

  const [isAddMatchModalOpen, setAddMatchModalOpen] = useState(false);
  const [isUpdateMatchModalOpen, setUpdateMatchModalOpen] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const formatStatus = (status: string) => {
    // format for status
    return status
      .replace(/([A-Z])/g, ' $1')  
      .replace(/^./, (str) => str.toUpperCase());  
  };

  // States for filtering
  const [weekFilter, setWeekFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [sportFilter, setSportFilter] = useState<string[]>([]);

  //
  const [anchorElWeek, setAnchorElWeek] = useState<null | HTMLElement>(null);
  const [anchorElStatus, setAnchorElStatus] = useState<null | HTMLElement>(null);
  const [anchorElSport, setAnchorElSport] = useState<null | HTMLElement>(null);

  const handleDelete = async (id: string, eventId: string) => {
    const confirmation = await Swal.fire({
      title: "Are you sure you want to delete this match?",
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
        await deleteMatch.mutateAsync({id, eventId});
        queryClient.invalidateQueries({ queryKey: ['matches', eventId] });
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

   // Functions for handling filter changes
   const handleWeekChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setWeekFilter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setStatusFilter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSportChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSportFilter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // Get unique values for week, status, and sportTitle from the matches data
  const uniqueWeeks = useMemo(() => {
    return [...new Set(matches?.map((match) => match.week.toString()))];
  }, [matches]);

  const uniqueStatuses = useMemo(() => {
    return [...new Set(matches?.map((match) => match.status))];
  }, [matches]);

  const uniqueSports = useMemo(() => {
    return [...new Set(matches?.map((match) => match.sportTitle))];
  }, [matches]);

  // Filter matches based on selected filters
  const filteredMatches = matches?.filter((match: Match) => {
    const weekMatch = weekFilter.length === 0 || weekFilter.includes(match.week.toString());
    const statusMatch = statusFilter.length === 0 || statusFilter.includes(match.status);
    const sportMatch = sportFilter.length === 0 || sportFilter.includes(match.sportTitle);
    return weekMatch && statusMatch && sportMatch;
  });

  const handleOpenWeekMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElWeek(event.currentTarget);
  };

  const handleCloseWeekMenu = () => {
    setAnchorElWeek(null);
  };

  const handleOpenStatusMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElStatus(event.currentTarget);
  };

  const handleCloseStatusMenu = () => {
    setAnchorElStatus(null);
  };

  const handleOpenSportMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElSport(event.currentTarget);
  };

  const handleCloseSportMenu = () => {
    setAnchorElSport(null);
  };



  if (matchesLoading) {
    return (
      <Container sx={{ textAlign: "center", marginTop: 4 }}>
        <CircularProgress />
        <Typography variant="h6" component="div" sx={{ marginTop: 2 }}>
          Loading data...
        </Typography>
      </Container>
    );
  }

  if (matchesError) {
    return (
      <Container sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography variant="h6" component="div" sx={{ color: "red" }}>
          Failed to load data.
        </Typography>
      </Container>
    );
  }

  if (matches && matches.length === 0) {
    return (
      <ThemeProvider theme={ColorTheme}>
        <Container sx={{ textAlign: "center", marginTop: 3, ml: 60 }}>
        <Typography variant="h6">No matches found for this event.</Typography>
        <Button size="small" variant="contained" sx={{ maxHeight: 50, maxWidth: '100%', mt:2 }} onClick={openAddMatchModal}>
        <AddOutlinedIcon /> Create Match
      </Button>
      </Container>
      </ThemeProvider>
      
    );
  }

  return (
    <ThemeProvider theme={ColorTheme}>
      <Typography variant="h4" sx={{  ml: 42, mb: 3, fontWeight: 500}}>List Matches</Typography>
      {/* Filter Section */}
      <Container sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, ml: 40 }}>
        
        <Box>
          <Typography variant="h6">Sort By : </Typography>
       {/* Week Filter */}
       <Button onClick={handleOpenWeekMenu} variant="text"  >
          Week 
        </Button>
        <Menu anchorEl={anchorElWeek} open={Boolean(anchorElWeek)} onClose={handleCloseWeekMenu}>
          {uniqueWeeks.map((week) => (
            <MenuItem key={week}>
              <FormControlLabel
                control={
                  <Checkbox
                    value={week}
                    checked={weekFilter.includes(week)}
                    onChange={handleWeekChange}
                  />
                }
                label={`Week ${week}`}
              />
            </MenuItem>
          ))}
        </Menu>
        

        {/* Status Filter */}
        <Button onClick={handleOpenStatusMenu} variant="text"  >
          Status 
        </Button>
        <Menu anchorEl={anchorElStatus} open={Boolean(anchorElStatus)} onClose={handleCloseStatusMenu}>
          {uniqueStatuses.map((status) => (
            <MenuItem key={status}>
              <FormControlLabel
                control={
                  <Checkbox
                    value={status}
                    checked={statusFilter.includes(status)}
                    onChange={handleStatusChange}
                  />
                }
                label={formatStatus(status)}
              />
            </MenuItem>
          ))}
        </Menu>

        {/* Sport Filter */}
        <Button onClick={handleOpenSportMenu} variant="text"  >
          Sport 
        </Button>
        <Menu anchorEl={anchorElSport} open={Boolean(anchorElSport)} onClose={handleCloseSportMenu}>
          {uniqueSports.map((sport) => (
            <MenuItem key={sport}>
              <FormControlLabel
                control={
                  <Checkbox
                    value={sport}
                    checked={sportFilter.includes(sport)}
                    onChange={handleSportChange}
                  />
                }
                label={sport}
              />
            </MenuItem>
          ))}
        </Menu>
        </Box>

          <Box>
        {/* Button Create Match */}
        <Button
          size="small"
          variant="contained"
          sx={{ mx: 2, maxHeight: 50, maxWidth: '100%' }}
          onClick={openAddMatchModal}
        >
          <AddOutlinedIcon /> Create Match
        </Button>
        </Box>
      </Container>
      <Container sx={{ mt: 4, ml: 40 }}>
        <Grid container spacing={4}>
          {filteredMatches?.map((match: Match) => (
            <Grid item xs={12} sm={6} md={4} key={match.id}>
              <Paper elevation={3} sx={{ padding: 3}}>
                <Box mt={2} sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Grid item xs={6} sx={{ mt: -2, mb: 2,  maxWidth: 400, maxHeight: "100%"  }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {match.sportTitle}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {new Date(match.date).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Typography variant="body1" color="blue">
                    {formatStatus(match.status)}
                  </Typography>
                </Box>
                <Grid container spacing={3} sx={{ textAlign: "center" }}>
                  <Grid item xs={4}>
                    <Typography variant="h6">{match.teamRedName}</Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {match.teamRedScore ?? 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography color="">VS</Typography>
                  </Grid> 
                  <Grid item xs={4}>
                    <Typography variant="h6">{match.teamBlueName}</Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {match.teamBlueScore ?? 0}
                    </Typography>
                  </Grid>
                </Grid>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2, display: 'flex' }}>
                  <FmdGoodOutlinedIcon/> {match.venue}
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
                    onClick={() => handleDelete(match.id, eventId!)}
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
