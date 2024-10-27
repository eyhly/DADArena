import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useParams } from "react-router-dom";
import { useGetAllTeamMembers } from "../../../services/queries";
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
} from "@mui/material";
import { DeleteOutlineOutlined, AddOutlined, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteTeamMember } from "../../../services/mutation"; // Assuming you have a delete mutation for members
import AddMember from './AddTeamMember'; // Assuming you have a AddMember component
import { TeamMember } from "../../../types/teamMember";
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

const TeamMembers: React.FC = () => {
  const { eventId, teamId } = useParams();
  const { data, isLoading, isError } = useGetAllTeamMembers(eventId!, teamId!);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const queryClient = useQueryClient();
  const deleteMember = useDeleteTeamMember(); 

  const handleOpenCreate = () => setOpenCreate(true);
  const handleCloseCreate = () => setOpenCreate(false);

  const handleDelete = async (userId: string, eventId: string, teamId: string) => {
    if (!userId) {
      console.error('Team member ID is missing');
      return;
    }
    const confirmation = await Swal.fire({
      title: "Are you sure you want to delete this member?",
      text: "You can cancel!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (confirmation.isConfirmed) {
      deleteMember.mutateAsync({ userId, eventId, teamId }, {
        
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Member deleted successfully!",
            confirmButtonText: "Ok",
          });
          queryClient.invalidateQueries({ queryKey: ["teamMembers", eventId, teamId] });
        },
        onError: (error) => {
          Swal.fire({
            icon: "error",
            title: "Failed!",
            text: error instanceof Error ? error.message : "An unexpected error occurred.",
            confirmButtonText: "Ok",
          });
          console.log(userId);
        }
      });
    }
  };

  const columns = React.useMemo<ColumnDef<TeamMember>[]>( 
    () => [
      // {
      //   accessorFn: (row, i) => i + 1,
      //   header: "No",
      // },
      {
        accessorKey: 'teamName',
        header: 'Team'
      },
      {
        accessorKey: "username",
        header: "Member Name",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          
          <>
            <Button
              onClick={() => handleDelete(row.original.userId, eventId!, teamId!)}
              sx={{ color: "red" }}
            >
              <DeleteOutlineOutlined /> {/* Delete */}
            </Button>
          </>
        ),
      },
    ],
    [eventId, teamId]
    
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
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3, ml: 65 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography variant="h6" color="error" sx={{ mt: 3, ml: 65 }}>
        Error fetching team members.
      </Typography>
    );
  }

  if (data.length === 0 ) {
    return (
      <Box sx={{ml: 95, textAlign: 'center'}}>
        <Typography variant="h6">
          No team members found.
        </Typography>
        <Button variant="contained" onClick={handleOpenCreate}>
        <AddOutlined /> Create Member
      </Button>
      <AddMember eventId={eventId!} teamId={teamId!} open={openCreate} onClose={handleCloseCreate} />
      </Box>
    )
  }

  return (
    <Container>
      <Typography variant="h3" sx={{ ml: 90, mb: 3 }}>
        List Team Members
      </Typography>
      <Button variant="contained" onClick={handleOpenCreate} sx={{ ml: 145, mb: 2 }}>
        <AddOutlined /> Create Member
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
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === "asc" ? <KeyboardArrowUp /> : null}
                        {header.column.getIsSorted() === "desc" ? <KeyboardArrowDown /> : null}
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
      <AddMember eventId={eventId!} teamId={teamId!} open={openCreate} onClose={handleCloseCreate} />
      </Container>
  );
};

export default TeamMembers;
