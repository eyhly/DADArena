import React, { useState } from "react";
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
  styled,
  tableCellClasses,
  Button,
  Tooltip,
  Container,
  Breadcrumbs,
  // Tooltip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllSchedules } from "../../services/queries";
import { useDeleteSchedule } from "../../services/mutation";
import Swal from "sweetalert2";
import { Schedule } from "../../types/schedule";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AddSchedule from "./AddSchedule";
// import UpdateSchedule from "./UpdateSchedule";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import UpdateSchedule from "./UpdateSchedule";
import { useQueryClient } from "@tanstack/react-query";

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

const renderDate = (dateString: string) => {
  if (!dateString) return "Unknown Date";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.toLocaleString("en-US", { month: "long" });
  const day = String(date.getDate()).padStart(2, "0");

  return `${day} ${month} ${year}`;
};
const renderDateTime = (dateString: string) => {
  if (!dateString) return "Unknown Date";
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

const SchedulesTable: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { data, isLoading, isError } = useGetAllSchedules(eventId!);
  const queryClient = useQueryClient();
  const deleteSchedule = useDeleteSchedule();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [updateScheduleOpen, setUpdateScheduleOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const navigate = useNavigate();

  const filteredData = React.useMemo(
    () =>
      data?.filter((schedule: Schedule) => schedule.eventId === eventId) ?? [],
    [data, eventId]
  );

  const handleOpenModalUpdate = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setUpdateScheduleOpen(true);
  };

  const handleDelete = async (id: string, eventId: string) => {
    const confirmation = await Swal.fire({
      title: "Are you sure want to delete this schedule?",
      text: "You can cancel!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (confirmation.isConfirmed) {
      deleteSchedule.mutate(
        { id, eventId },
        {
          onSuccess: () => {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Schedule deleted successfully!",
              confirmButtonText: "Ok",
            });
            queryClient.invalidateQueries({ queryKey: ["schedules",  eventId] });

          },
          onError: (error) => {
            Swal.fire({
              icon: "error",
              title: "Failed!",
              text:
                error instanceof Error
                  ? error.message
                  : "An unexpected error occurred.",
              confirmButtonText: "Ok",
            });
          },
        }
      );
    }
  };

  const columns = React.useMemo<ColumnDef<Schedule>[]>(
    () => [
      // { accessorFn: (row, i) => i + 1, header: "No" },
      { accessorKey: "week", header: "Week" },
      { accessorFn: (row) => renderDate(row.startAttendance), header: "Date" },
      {
        accessorFn: (row) => renderDateTime(row.startAttendance),
        header: "Start Attendance",
      },
      {
        accessorFn: (row) => renderDateTime(row.endAttendance),
        header: "End Attendance",
        
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <>
            <Button onClick={() => handleOpenModalUpdate(row.original)}>
              <EditOutlinedIcon />
            </Button>
            <Button
              onClick={() =>
                handleDelete(row.original.id, row.original.eventId)
              }
              sx={{ color: "red" }}
            >
              <DeleteOutlineOutlined /> {/*Delete*/}
            </Button>
            <Tooltip title={"attendances"} placement="top-end">
              <Button
                variant="contained"
                onClick={() =>
                  navigate(
                    `/events/${eventId}/schedules/${row.original.id}/attendances`
                  )
                }
              >
                <VisibilityOutlinedIcon /> Attendances{/*View*/}
              </Button>
            </Tooltip>
          </>
        ),
      },
    ],
    []
  );

  const tableInstance = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  });

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Loading schedules...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Failed to load schedules
        </Typography>
      </Box>
    );
  }

  if (filteredData.length === 0) {
    return (
      <Box sx={{ textAlign: "center", ml: 85 }}>
        <Typography variant="h6">No schedules found for this event</Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => setOpenAddModal(true)}
        >
          <AddOutlinedIcon /> Create Schedule
        </Button>
        <AddSchedule
          open={openAddModal}
          handleClose={() => setOpenAddModal(false)}
        />
      </Box>
    );
  }

  return (
    <Container sx={{ ml: 50, mb: 4, width: '1000px', minHeight: 550 }}>
      {/* Breadcrumbs */}
      
        <Breadcrumbs aria-label="breadcrumb">
          {/* <Typography>Absence</Typography> */}
          <Typography
            // onClick={() => navigate(`/events/${eventId}/schedules/`)}
            // style={{ cursor: "pointer" }}
            color="text.primary"
          >
            Schedule
          </Typography>
        </Breadcrumbs>
        <Box>
        <Typography variant="h4" sx={{ mb: 2, mt: 2}}>
          List of Schedules
        </Typography>
        <Button
          variant="contained"
          sx={{ mb: 2, ml: 95, maxHeight: 50}}
          onClick={() => setOpenAddModal(true)}
        >
          <AddOutlinedIcon /> Create Schedule
        </Button>
        <AddSchedule
          open={openAddModal}
          handleClose={() => setOpenAddModal(false)}
        />
      </Box>
      <TableContainer component={Paper} sx={{ maxWidth: 1000 }}>
        <Table stickyHeader>
          <TableHead>
            {tableInstance.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <StyledTableCell key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          onClick: header.column.getToggleSortingHandler(),
                          style: { cursor: "pointer" },
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() === "asc" ? (
                          <KeyboardArrowUpIcon />
                        ) : null}
                        {header.column.getIsSorted() === "desc" ? (
                          <KeyboardArrowDownIcon />
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
      {selectedSchedule && (
        <UpdateSchedule
          open={updateScheduleOpen}
          handleClose={() => setUpdateScheduleOpen(false)}
          schedule={selectedSchedule}
        />
      )}
    </Container>
  );
};

export default SchedulesTable;
