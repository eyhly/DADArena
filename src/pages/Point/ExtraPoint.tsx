import React, { useState, useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
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
  tableCellClasses,
  Button,
  Container,
  Breadcrumbs,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllExtraPoints, useGetAllTeams, useGetProfile } from "../../services/queries";
import { styled } from "@mui/system";
import { ExtraPoint } from "../../types/extraPoint";
import {
  AddOutlined,
  DeleteOutlineOutlined,
  EditOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { useDeleteExtraPoint } from "../../services/mutation";
import AddExtraPoint from "./AddExtraPoint";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import UpdateExtraPoint from "./UpdateExtraPoint";
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

const ExtraPointPage: React.FC = () => {
  const { eventId, teamId } = useParams<{ eventId: string; teamId: string }>();
  const {
    data: extraPoints,
    isLoading: isExtraPointsLoading,
    isError: isExtraPointsError,
  } = useGetAllExtraPoints(eventId!);
  const {
    data: teams,
    isLoading: isTeamsLoading,
    isError: isTeamsError,
  } = useGetAllTeams(eventId!);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedExtraPoint, setSelectedExtraPoint] =
    useState<ExtraPoint | null>(null);
  const deleteExtraPoint = useDeleteExtraPoint();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const {data : bio} = useAuthState();
  const user = bio?.user;
  const userId = user?.profile.sub;
  const {data: profile} = useGetProfile(userId!);
  const roles = profile?.roles || [];
  const isMemberOrKapten = roles.includes("member") || roles.includes("captain");


  const filteredExtraPoints = useMemo(
    () =>
      extraPoints?.filter((point: ExtraPoint) => point.teamId === teamId) || [],
    [extraPoints, teamId]
  );

  const getTeamNameById = useCallback(
    (teamId: string) => {
      const team = teams?.find((team) => team.id === teamId);
      return team ? team.name : "Team not found";
    },
    [teams]
  );

  const handleOpenUpdate = (point: ExtraPoint) => {
    setSelectedExtraPoint(point);
    setOpenUpdate(true);
  };

  const handleDelete = async (id: string, teamId: string) => {
    const confirmation = await Swal.fire({
      title: "Are you sure you want to delete this extra point?",
      text: "You can cancel it!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirmation.isConfirmed) {
      if (!eventId || !teamId) {
        console.error("eventId or teamId is undefined");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Event ID or Team ID is missing. Please try again.",
          confirmButtonText: "Ok",
        });
        return;
      }

      deleteExtraPoint.mutateAsync(
        { id, eventId, teamId },
        {
          onSuccess: () => {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Extra point deleted successfully",
              confirmButtonText: "Ok",
            });
            queryClient.invalidateQueries({
              queryKey: ["extrapoints", eventId],
            });
          },
          onError: (error) => {
            if (axios.isAxiosError(error)){
            Swal.fire({
              icon: "error",
              title: "Error",
              text: error.response?.data,
              confirmButtonText: "Ok",
            });
          }
          },
        }
      );
    }
  };

  const columns = useMemo<ColumnDef<ExtraPoint>[]>(
    () => [
      {
        accessorKey: "week",
        header: "Week",
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "point",
        header: "Extra Point",
        cell: (info) => {
          const value = info.getValue() as number;
          return value < 0 ? value : value.toString();
        },
      },
      ...(isMemberOrKapten
        ? []
        : [{
        id: "action",
        header: "Actions",
        cell: ({ row }) => (
          <div>
            <Button onClick={() => handleOpenUpdate(row.original)}>
              <EditOutlined />
            </Button>
            <Button
              onClick={() => handleDelete(row.original.id, row.original.teamId)}
            >
              <DeleteOutlineOutlined sx={{ color: "red" }} />
            </Button>
          </div>
        ),
      }]
      ),
    ],
    [navigate]
  );

  const tableInstance = useReactTable({
    data: filteredExtraPoints,
    columns,
    state: { sorting },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  });

  if (isExtraPointsLoading || isTeamsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3, ml: 90 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isExtraPointsError || isTeamsError) {
    return (
      <Typography variant="h6" color="error" sx={{ mt: 3, ml: 90 }}>
        Error fetching data.
      </Typography>
    );
  }

  if (filteredExtraPoints.length === 0) {
    return(
      <Box sx={{ textAlign: "center", marginTop: 3, ml: 90 }}>
        <Typography variant="h6">No extra point found for this team</Typography>
        {!isMemberOrKapten && (
          <Button
          size="small"
          variant="contained"
          sx={{ mt: 2}}
          onClick={() => setOpenAdd(true)}
        >
          <AddOutlined /> Add Extra Point
        </Button>
        )}
      <AddExtraPoint open={openAdd} handleClose={() => setOpenAdd(false)} />
      </Box>
    )
  }

  return (
    <Container sx={{ ml: 50, mb: 4, minHeight: 550, maxHeight: 550 }}>
      <Box>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography
            onClick={() => navigate(`/events/${eventId}/recap/`)}
            style={{ cursor: "pointer" }}
            color="inherit"
          >
            Recap
          </Typography>
          <Typography color="text.primary">Extra Point</Typography>
        </Breadcrumbs>
      </Box>
      <Typography variant="h4" sx={{ mt: 3, mb: 2}}>
        Extra Points for {getTeamNameById(teamId!)}
      </Typography>
      {!isMemberOrKapten && (
        <Button
        size="small"
        variant="contained"
        sx={{ mt: -3, mb: 3, ml: 105}}
        onClick={() => setOpenAdd(true)}
      >
        <AddOutlined /> Add Extra Point
      </Button>
      )}
      <AddExtraPoint open={openAdd} handleClose={() => setOpenAdd(false)} />
      <TableContainer component={Paper} sx={{ maxWidth: 1000,}}>
        <Table>
          <TableHead>
            {tableInstance.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
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
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {tableInstance.getRowModel().rows.map((row) => (
              <StyledTableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedExtraPoint && (
        <UpdateExtraPoint
          open={openUpdate}
          handleClose={() => setOpenUpdate(false)}
          extrapoint={selectedExtraPoint}
        />
      )}
    </Container>
  );
};

export default ExtraPointPage;
