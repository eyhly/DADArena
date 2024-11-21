import React, { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetAllTeams,
  useGetAllSportPlayers,
  useGetProfile,
} from "../../../services/queries";
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
import {
  AddOutlined,
  DeleteOutlineOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  SaveAltRounded,
} from "@mui/icons-material";
import { useDeleteSportPlayer } from "../../../services/mutation";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useApi from "../../../services/api";
import axios from "axios";
import { useAuthState } from "../../../hook/useAuth";

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
  console.log(teams, 'teams');
  
  const [sorting, setSorting] = useState<SortingState>([]);
  const deletePlayer = useDeleteSportPlayer();
  const queryClient = useQueryClient();
  const { data: allPlayers, isLoading: isLoadingPlayers } =
    useGetAllSportPlayers(eventId!, sportId!);
  const navigate = useNavigate();

  const {data : bio} = useAuthState();
  const user = bio?.user;
  const userId = user?.profile.sub;
  const {data: profile} = useGetProfile(userId!);
  const roles = profile?.roles || [];
  const isCaptain = roles.includes("captain");
  const isMember = roles.includes("member");
  const isOrganizer = roles.includes("committee") || roles.includes("official");

  const { exportSportPlayers } = useApi();
  const [isPending, setIsPending] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({
    'actions': true
  })

  useEffect(() => {
    setColumnVisibility({
      actions: !(isMember || isOrganizer)
    })
  }, [isMember, isOrganizer])

  const handleDownload = async () => {
    setIsPending(true);
    await exportSportPlayers(eventId!, sportId!);
    setIsPending(false);
  };

  const handleDelete = async (id: string, eventId: string, sportId: string) => {
    console.log(id, "ada id??");

    const confirmation = await Swal.fire({
      title: "Are you sure you want to delete this player?",
      text: "You can cancel this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (confirmation.isConfirmed) {
      await deletePlayer.mutateAsync(
        { id, eventId, sportId },
        {
          onSuccess: () => {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Player deleted successfully",
              confirmButtonText: "Ok",
            });
            queryClient.invalidateQueries({
              queryKey: ["sportplayers", eventId, sportId],
            });
          },
          onError: (error) => {
            if (axios.isAxiosError(error)) {
              Swal.fire({
                icon: "error",
                title: "Failed!",
                text: error.response?.data,
                confirmButtonText: "Ok",
              });
            }
          },
        }
      );
    }
  };

  const getTeamNameById = (teamId: string) => {
    const team = teams?.find((team: Team) => team.id === teamId);
    console.log(team, 'team');
    console.log(teamId, 'id tim');
    
    return team ? team.name : "Team not found";
  };
  

  const columns = useMemo<ColumnDef<SportPlayer>[]>(
    () => [
      {
        accessorFn: (row) => getTeamNameById(row.teamId),
        header: "Team Name",
      },
      // {
      //   accessorKey: 'teamName',
      //   header: "Team Name",
      // },
      {
        accessorKey: "fullname",
        header: "Players",
        cell: ({ getValue }) => getValue() || "—",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "gender",
        header: "Gender",
        cell: ({ getValue }) => getValue() || "—",
      },
            {
              id: "actions",
              header: "Actions",
              enableHiding: true,
              cell: ({ row }) => (
                <Button
                  onClick={() =>
                    handleDelete(
                      row.original.id,
                      eventId!, sportId!
                    )     
                    
                  }
                  sx={{ color: "red" }}
                >
                  <DeleteOutlineOutlined />
                </Button>
              ),
            },

    ],
    [allPlayers, isLoadingPlayers]
  );

  const table = useReactTable({
    data: allPlayers ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
  });

  if (isLoading || isLoadingPlayers) {
    return (
      <Box sx={{ display: "block", justifyContent: "center", textAlign: 'center', ml: 20 }}>
        <CircularProgress />
        <Typography variant="h6">Loading Sport Players ...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography variant="h6" color="error" sx={{ textAlign:'center', ml: 20 }}>
        Error fetching SportPlayer.
      </Typography>
    );
  }

  if (!allPlayers || allPlayers.length === 0) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 3 }}>
        <Typography variant="h6">No players found for this sport</Typography>
        {isCaptain && (
          <Button
            size="small"
            variant="contained"
            sx={{ mt: 2, mb: 3, maxHeight: 50, maxWidth: "100%" }}
            onClick={() =>
              navigate(`/events/${eventId}/sports/${sportId}/sportplayers/add`)
            }
          >
            <AddOutlined /> Create Player
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Container sx={{ mb: 4, minHeight: 550, maxHeight: 550, width:'1000px' }}>

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
      <Box sx={{display: 'flex', justifyContent:'space-between', width: '1200px', mb: 2}}>
      <Typography variant="h4">
        List SportPlayer
      </Typography>

      <Box
        sx={{
          mt: 5,
          display: "flex",
          gap: 2,
          justifyContent: "flex-end",
          mr: 2,
        }}
      >
        {(isOrganizer || isCaptain)
          ? [ 
            <Button
              variant="contained"
              size="small"
              sx={{ gap: 1, maxHeight: 30 }}
              onClick={handleDownload}
              disabled={isPending}
            >
              {isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SaveAltRounded />
              )}
              {isPending ? "Downloading..." : "Download"}
            </Button>
          ] : null}
        {isCaptain && (
          <Button
            size="small"
            sx={{maxHeight: 30}}
            variant="contained"
            onClick={() =>
              navigate(`/events/${eventId}/sports/${sportId}/sportplayers/add`)
            }
          >
            <AddOutlined /> Create Player
          </Button>
        )}
      </Box>
      </Box>

      <TableContainer component={Paper} sx={{ maxWidth: 1200, minWidth: 1200 }}>
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
