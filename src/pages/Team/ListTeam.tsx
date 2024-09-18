import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllTeams } from "../../services/queries";
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
  ThemeProvider,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Team } from "../../types/team";
import ColorTheme from "../../utils/ColorTheme";
import {
  DeleteOutlineOutlined,
  EditCalendarOutlined,
  AddOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteTeam } from "../../services/mutation";
import CreateTeam from "./teamsOfficial/AddTeam";
import UpdateTeam from "./teamsOfficial/UpdateTeam";

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

const ListTeam: React.FC = () => {
  const { eventId } = useParams();
  const { data, isLoading, isError } = useGetAllTeams(eventId!);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deleteTeam = useDeleteTeam();

  const handleOpenCreate = () => setOpenCreate(true);
  const handleCloseCreate = () => setOpenCreate(false);
  const handleOpenUpdate = (team: Team) => {
    setSelectedTeam(team);
    setOpenUpdate(true);
  };
  const handleCloseUpdate = () => setOpenUpdate(false);

  const handleDelete = async (id: string, eventId: string) => {
    const confirmation = await Swal.fire({
      title: "Are you sure want to delete this team?",
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
        await deleteTeam.mutateAsync({ id, eventId });
        queryClient.invalidateQueries({ queryKey: ["teams", eventId] });
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Team deleted successfully!",
          confirmButtonText: "Ok",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred.",
          confirmButtonText: "Ok",
        });
      }
    }
  };

  const columns = React.useMemo<ColumnDef<Team>[]>(
    () => [
      {
        accessorFn: (row, i) => i + 1,
        header: "No",
      },
      {
        accessorKey: "name",
        header: "Team Name",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <>
            <Button onClick={() => handleOpenUpdate(row.original)}>
              <EditCalendarOutlined /> {/*  Update */}
            </Button>
            <Button
              onClick={() =>
                handleDelete(row.original.id, row.original.eventId)
              }
              sx={{ color: "red" }}
            >
              <DeleteOutlineOutlined /> {/*Delete*/}
            </Button>
            <Button
              onClick={() =>
                navigate(`/events/${eventId}/teams/${row.original.id}/members`)
              }
              sx={{ color: "#24aed4" }}
            >
              <VisibilityOutlinedIcon /> {/*View Members*/}
            </Button>
          </>
        ),
      },
    ],
    [navigate, eventId]
  );

  // Set up the table instance
  const table = useReactTable({
    data: data ?? [],
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
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3, ml: 65 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography variant="h6" color="error" sx={{ mt: 3 , ml: 65}}>
        Error fetching teams.
      </Typography>
    );
  }

  return (
    <ThemeProvider theme={ColorTheme}>
      <Typography variant="h3" sx={{ ml: 90, mb: 3 }}>
        List Teams
      </Typography>
      <Button variant="contained" onClick= {handleOpenCreate} sx={{ml: 145, mb: 2}}>
        <AddOutlined/> Create Team
      </Button>
      <TableContainer component={Paper} sx={{ ml: 50, maxWidth: 900 }}>
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

      {/* Create Modal */}
      <CreateTeam eventId={eventId!} open={openCreate} onClose={handleCloseCreate} />

      {/* Update Modal */}
      <UpdateTeam eventId={eventId!} open={openUpdate} onClose={handleCloseUpdate} selectedTeam={selectedTeam} />
    </ThemeProvider>
  );
};

export default ListTeam;
