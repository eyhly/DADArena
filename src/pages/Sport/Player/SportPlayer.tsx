import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllTeams, useGetAllSportPlayers } from "../../../services/queries";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  styled,
  tableCellClasses,
  Button,
  Container,
  Breadcrumbs,
} from "@mui/material";
import { Team } from "../../../types/team";
import { SportPlayer } from "../../../types/sportPlayer";
import { AddOutlined, DeleteOutlineOutlined } from "@mui/icons-material";
import AddSportPlayer from "./AddSportPlayer";
import { useDeleteSportPlayer } from "../../../services/mutation";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const SportPlayerTable: React.FC = () => {
  const { eventId, sportId } = useParams(); 
  const { data: teams, isLoading, isError } = useGetAllTeams(eventId!);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [open, setOpen] = useState(false);
  const deletePlayer = useDeleteSportPlayer();
  const queryClient = useQueryClient();
  const { data: allPlayers, isLoading: isLoadingPlayers } = useGetAllSportPlayers(
    eventId!,
    sportId!
  );
  const navigate = useNavigate();

  // Filter players by teamId
  const getTeamNameById = (teamId: string) => {
    const team = teams?.find((team: Team) => team.id=== teamId);
    return team?  team.name : 'Team not found';
  };

  const handleDelete = async (id: string, eventId: string, sportId: string) => {
    const confirmation = await Swal.fire({
      title: "Are you sure you want to delete this player?",
      text: "You can cancel this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    })
    if (confirmation.isConfirmed){
      await deletePlayer.mutateAsync(
        {id, eventId, sportId},
        {
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Player deleted successfully',
              confirmButtonText: 'Ok'
            })
            queryClient.invalidateQueries({ queryKey: ['sportplayers',  eventId, sportId] });
          },
          onError: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error instanceof Error ? error.message : 'An unexpected error occured'
            })
          }
        }
      )
    }
  }

  const columns = useMemo<ColumnDef<SportPlayer>[]>(() => [
    {
      accessorFn: (row) => getTeamNameById(row.teamId),
      header: "Team Name",
    },
    {
      accessorKey: "userId",
      header: "Players",
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({row}) => (
        <Button 
        onClick={() => handleDelete(row.original.id, row.original.eventId, row.original.sportId)}
        sx={{color: 'red'}}
        >
          <DeleteOutlineOutlined/>
        </Button>
      )
    }
  ], [allPlayers, isLoadingPlayers]);

  const table = useReactTable({
    data: allPlayers ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography variant="h6" color="error" sx={{ mt: 3 }}>
        Error fetching teams.
      </Typography>
    );
  }

  if (!allPlayers || allPlayers.length === 0) {
    return (
        <Box sx={{ textAlign: "center", marginTop: 3,ml: 90 }}>
        <Typography variant="h6">
          No sports found for this event
        </Typography>
        <Button
          size="small"
          variant="contained"
          sx={{ mt: 2, mb: 3, maxHeight: 50, maxWidth: "100%" }}
          onClick={() => setOpen(true)}
        >
          <AddOutlined /> Create Player
        </Button>
        {/* modal add sport */}
        <AddSportPlayer open={open} handleClose={() => setOpen(false)} />
      </Box>
      
    );
  }

  return (
      <Container sx={{ width: "1000px", ml: 50 }}>       
        <Box sx={{ mt: -20  }}>
        <Breadcrumbs aria-label="breadcrumb">
        {/* <Typography>Absence</Typography> */}
          <Typography
            onClick={() => navigate(`/events/${eventId}/sports/`)}
            style={{ cursor: "pointer" }}
            color="inherit"
          >
            Sports
          </Typography>
          <Typography color="text.primary">Sport Player</Typography>
        </Breadcrumbs>
      </Box>
      <Typography variant="h3" sx={{ mt: 2, mb: 3 }}>
          List SportPlayer
        </Typography>
        <Button
          size="small"
          variant="contained"
          sx={{ mt: 2, mb: 3, maxHeight: 50, ml: 94 }}
          onClick={() => setOpen(true)}
        >
          <AddOutlined /> Create Player
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <StyledTableRow>
                {table.getHeaderGroups().map((headerGroup) =>
                  headerGroup.headers.map((header) => (
                    <StyledTableCell key={header.id} colSpan={header.colSpan}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </StyledTableCell>
                  ))
                )}
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <StyledTableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <StyledTableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* modal add sport */}
        <AddSportPlayer open={open} handleClose={() => setOpen(false)} />
      </Container>
  );
};

export default SportPlayerTable;
