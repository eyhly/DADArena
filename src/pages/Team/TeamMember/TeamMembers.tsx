import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllTeamMembers, useGetProfile } from "../../../services/queries";
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
import { DeleteOutlineOutlined, AddOutlined, KeyboardArrowDown, KeyboardArrowUp, SaveAltRounded } from "@mui/icons-material";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteTeamMember } from "../../../services/mutation"; 
import AddMember from './AddTeamMember'; 
import { TeamMember } from "../../../types/teamMember";
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

const TeamMembers: React.FC = () => {
  const { eventId, teamId } = useParams();

  const {data : bio} = useAuthState();
  const user = bio?.user;
  const userId = user?.profile.sub;
  const {data: profile} = useGetProfile(userId!);
  const roles = profile?.roles || [];
  const isCaptain = roles.includes("captain");
  const isMember = roles.includes("member");
  const isOrganizer = roles.includes("committee") || roles.includes("official");
  
  const { data, isLoading, isError } = useGetAllTeamMembers(eventId!, teamId!);
  const {exportTeamMembers} = useApi();
  const [isPending, setIsPending] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([]);

  const [columnVisibility, setColumnVisibility] = useState({
    // eslint-disable-next-line no-extra-boolean-cast
    'actions': true
  });

  useEffect(() => {
    setColumnVisibility({
      actions: !(isMember || isOrganizer  ), 
    });
  }, [isMember, isOrganizer ]);

  const [openCreate, setOpenCreate] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deleteMember = useDeleteTeamMember(); 

  const handleOpenCreate = () => setOpenCreate(true);
  const handleCloseCreate = () => setOpenCreate(false);

  const handleDownload = async () => {
    setIsPending(true)
    await exportTeamMembers(eventId!, teamId!)
    setIsPending(false)
  }; 

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
          if (axios.isAxiosError(error)){
          Swal.fire({
            icon: "error",
            title: "Failed!",
            text: error.response?.data,
            confirmButtonText: "Ok",
          });
        }
          console.log(userId);
        }
      });
    }
  };

  const columns = React.useMemo<ColumnDef<TeamMember>[]>( 
    () => [
      {
        accessorKey: 'teamName',
        header: 'Team'
      },
      {
        accessorKey: "fullname",
        header: "Name",
        cell: ({getValue}) => getValue() || "—"
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "gender",
        header: "Gender",
        cell: ({getValue}) => getValue() || "—"
      },
          {
          id: "actions",
          header: "Actions",
          enableHiding: true,
          cell: ({ row }) => (
              <Button
                onClick={() => handleDelete(row.original.userId, eventId!, teamId!)}
                sx={{ color: "red" }}
              >
                <DeleteOutlineOutlined />
              </Button>
            ),
          }
    ],
    [eventId, teamId]
  );

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnVisibility,
      sorting
    },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });
  console.log(data);
  

  if (isLoading) {
    return (
      <Box sx={{ display: "block", justifyContent: "center", textAlign:'center' }}>
        <CircularProgress />
      <Typography variant="h6">Loading...</Typography>
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

  if (data?.length === 0 ) {
    return (
      <Box sx={{ml: 95, textAlign: 'center'}}>
        <Typography variant="h6">
          No team members found.
        </Typography>
        {isCaptain && 
          <Button variant="contained" onClick={handleOpenCreate}>
          <AddOutlined /> Create Member
        </Button>
        }
      <AddMember eventId={eventId!} teamId={teamId!} open={openCreate} onClose={handleCloseCreate} />
      </Box>
    )
  }

  return (
    <Container sx={{ mb: 4, minHeight: 550, maxHeight: 550, width: '1000px' }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography
            onClick={() => navigate(`/events/${eventId}/teams/`)}
            style={{ cursor: "pointer" }}
            color="inherit"
          >
            Team
          </Typography>
          <Typography color="text.primary">Team Members</Typography>
        </Breadcrumbs>
      <Box sx={{display: 'flex', justifyContent:'space-between', width: '1200px', mb: 2}}>
      <Typography variant="h4" sx={{ mb: 2, mt: 2}}>
        List Team Members
      </Typography>
      
        <Box sx={{ mb: 2, display: 'flex', gap : 2, justifyContent: 'flex-end', maxWidth: '1000px', mt: 7}}>
        {isOrganizer || isCaptain ? [<Button size="small" variant="contained" sx={{maxWidth: "100%", gap: 1, maxHeight: 30}} onClick={handleDownload} disabled={isPending}>
          {isPending ? (
            <CircularProgress size={24} color="inherit"/>
          ) : (
            <SaveAltRounded/> 
          )} {isPending ? 'Downloading...' : 'Download'}
        </Button>] : null}
        {isCaptain && <Button size="small" variant="contained" sx={{maxWidth: 250, maxHeight: 30}} onClick={handleOpenCreate} >
          <AddOutlined /> Create Member
        </Button>}
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
      {isCaptain && <AddMember eventId={eventId!} teamId={teamId!} open={openCreate} onClose={handleCloseCreate} />}
      </Container>
  );
};

export default TeamMembers;
