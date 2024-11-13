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
import { useGetAllTeams, useGetAllSportPlayers, useGetProfile } from "../../../services/queries";
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
import { AddOutlined, DeleteOutlineOutlined, KeyboardArrowDown, KeyboardArrowUp, SaveAltRounded } from "@mui/icons-material";
import { useDeleteSportPlayer } from "../../../services/mutation";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useAuthState } from "../../../hook/useAuth";
import useApi from "../../../services/api";
import axios from "axios";

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
  const deletePlayer = useDeleteSportPlayer();
  const queryClient = useQueryClient();
  const { data: allPlayers, isLoading: isLoadingPlayers } = useGetAllSportPlayers(
    eventId!,
    sportId!
  );
  const navigate = useNavigate();
  const {exportSportPlayers} = useApi();
  const [isPending, setIsPending] = useState(false);
  
  const handleDownload = async () =>{
    setIsPending(true)
    await exportSportPlayers(eventId!, sportId!)
    setIsPending(false)
  }  

  const handleDelete = async (id: string, eventId: string, sportId: string) => {
    console.log(eventId, 'ada eventid??');
    
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
            queryClient.invalidateQueries({ queryKey: ['sportplayers', eventId, sportId] });
          },
          onError: (error) => {
            if (axios.isAxiosError(error)){
            Swal.fire({
              icon: 'error',
              title: 'Failed!',
              text: error.response?.data,
              confirmButtonText: "Ok"
            })
          }
          }
        }
      )
    }
  }

  const {data : bio} = useAuthState();
  const user = bio?.user;
  const userId = user?.profile.sub;
  const {data: profile} = useGetProfile(userId!);
  const roles = profile?.roles || [];
  const isMember = roles.includes("member");

  const getTeamNameById = (teamId: string) => {
    const team = teams?.find((team: Team) => team.id=== teamId);
    return team?  team.name : 'Team not found';
  };

  const columns = useMemo<ColumnDef<SportPlayer>[]>(() => [
    {
      accessorFn: (row) => getTeamNameById(row.teamId),
      header: "Team Name",
    },
    {
      accessorKey: "fullname",
      header: "Players",
      cell: ({getValue}) => getValue() || "—"
    },
    {
      accessorKey: "userId",
      header: "Players",
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({getValue}) => getValue() || "—"
    },
    ...(isMember
      ? []
      : [{
          id: 'actions',
          header: 'Actions',
          cell: ({ row }) => (
            <Button
              onClick={() =>
                handleDelete(row.original.eventId, row.original.sportId, row.original.id)
              }
              sx={{ color: 'red' }}
            >
              <DeleteOutlineOutlined />
            </Button>
          ),
        }]
    )
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

  if (isLoading || isLoadingPlayers) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3, ml: 105 }}>
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
          No players found for this sport
        </Typography>
        {!isMember && (
          <Button
          size="small"
          variant="contained"
          sx={{ mt: 2, mb: 3, maxHeight: 50, maxWidth: "100%" }}
          onClick={() => navigate(`/events/${eventId}/sports/${sportId}/sportplayers/add`)}
        >
          <AddOutlined /> Create Player
        </Button>
        )}
        
      </Box>
      
    );
  }

  return (
      <Container sx={{ ml: 50, mb: 4, minHeight: 550, }}>       
        <Box>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography
            onClick={() => navigate(`/events/${eventId}/sports/`)}
            style={{ cursor: "pointer" }}
            color="inherit"
          >
            Sports
          </Typography>
          <Typography color="text.primary">Sport Players</Typography>
        </Breadcrumbs>
      </Box>
      <Typography variant="h3" sx={{ mt: 2, mb: 3 }}>
          List SportPlayer
        </Typography>
        {!isMember && (
          <Box sx={{ mb: 2, display: 'flex', gap : 2, justifyContent: 'flex-end', mr: 8}}>
            <Button variant='contained' size="small" sx={{gap: 1}} onClick={handleDownload} disabled={isPending}>
              {isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SaveAltRounded/>
              )}
              {isPending ? 'Downloading...' : 'Download'}
            </Button>
          <Button
          size="small"
          variant="contained"
          onClick={() => navigate(`/events/${eventId}/sports/${sportId}/sportplayers/add`)}
        >
          <AddOutlined /> Create Player
        </Button>
        </Box>
        )}
        <TableContainer component={Paper} sx={{maxWidth: 1000}}>
          <Table>
            <TableHead>
              <StyledTableRow>
                {table.getHeaderGroups().map((headerGroup) =>
                  headerGroup.headers.map((header) => (
                    <StyledTableCell key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          onClick: header.column.getToggleSortingHandler(),
                          style: { cursor: "pointer", display: "flex" },
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() === "asc" ? (
                          <KeyboardArrowUp />
                        ) : null}
                        {header.column.getIsSorted() === "desc" ? (
                          <KeyboardArrowDown />
                        ) : null}
                      </div>
                    )}
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
      </Container>
  );
};

export default SportPlayerTable;
