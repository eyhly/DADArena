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
import { useGetAllTeams, useGetProfile } from "../../services/queries";
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
  Tooltip,
  Breadcrumbs,
  Container,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Team } from "../../types/team";
import {
  DeleteOutlineOutlined,
  AddOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  EditOutlined,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteTeam } from "../../services/mutation";
import CreateTeam from "./AddTeam";
import UpdateTeam from "./UpdateTeam";
import { useAuthState } from "../../hook/useAuth";
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

  const {data : bio} = useAuthState();
  const user = bio?.user;
  const userId = user?.profile.sub;
  const {data: profile} = useGetProfile(userId!);
  const roles = profile?.roles || [];
  const isAdmin = roles.includes("committee");
  const isCaptain = roles.includes("captain");


  const filteredData = React.useMemo(
    () =>
      data?.filter((team: Team) => team.eventId === eventId) ?? [],
    [data, eventId]
  );

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
      deleteTeam.mutateAsync({ id, eventId },
        {
          onSuccess: () => {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Team deleted successfully!",
              confirmButtonText: "Ok",
            });
            queryClient.invalidateQueries({ queryKey: ["teams", eventId] });
      }, onError: (error) => {
        if (axios.isAxiosError(error)){
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: error.response?.data,
        });
      }
      }
    }
  )}
  };

  const columns = React.useMemo<ColumnDef<Team>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Team Name",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Box sx={{display: 'flex'}}>
          {!!isAdmin && (
            <div>
            <Button onClick={() => handleOpenUpdate(row.original)}>
              <EditOutlined /> 
            </Button>
            <Button
              onClick={() =>
                handleDelete(row.original.id, row.original.eventId)
              }
              sx={{ color: "red" }}
            >
              <DeleteOutlineOutlined /> 
            </Button>
            </div>
          )}
            <div>
            <Tooltip title='View Members' placement="right-end">
            <Button variant="contained"
              size="small"
              onClick={() =>
                navigate(`/events/${eventId}/teams/${row.original.id}/teamMembers`)
              }
            >
              <VisibilityOutlinedIcon /> View Members
            </Button>
            </Tooltip>
          </div>
          </Box>
        ),
      },
    ],
    [navigate, eventId]
  );

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
      <Box sx={{ display: "flex", mt: 3, ml: 105 }}>
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

  if (filteredData.length === 0) {
    return (
      <Box sx={{ textAlign: "center", display: 'block', alignItems: 'center', ml: 25, justifyContent:'center'}}>
        <Typography variant="h6">No teams found for this event</Typography>
        {(isCaptain || isAdmin) && 
          <Button
          size="small"
          variant="contained"
          sx={{ maxHeight: 50, maxWidth: "100%" }}
          onClick={handleOpenCreate}
        >
          <AddOutlined /> Create Team
        </Button>
        }
      <CreateTeam eventId={eventId!} open={openCreate} onClose={handleCloseCreate} />
      </Box>
    );
  }

  return (
    <Container sx={{ mb: 4, width: '1000px', minHeight: 550, maxHeight: 550 }}>      
        <Breadcrumbs aria-label="breadcrumb">
          <Typography
            color="text.primary"
          >
            Team
          </Typography>
        </Breadcrumbs>
        <Box sx={{display: 'flex', justifyContent:'space-between', width: '1200px', mb: 2}}>
        <Typography variant="h4" sx={{ mb: 2}}>
          List of Team
        </Typography>
        {(isAdmin || isCaptain) && (
          <Button
          variant="contained"
          size="small"
          sx={{ mt: 5, maxHeight: 30}}
          onClick={handleOpenCreate}
        >
          <AddOutlined /> Create Team
        </Button>
        )}
      </Box>
      <TableContainer component={Paper} sx={{maxWidth: 1200, minWidth: 1200, maxHeight: 450, overflow: "auto"}}>
        <Table stickyHeader aria-label="customized collapsible table">
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
    </Container>
  );
};

export default ListTeam;
