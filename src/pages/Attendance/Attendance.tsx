import React, { useEffect, useState } from "react";
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
  Breadcrumbs,
  Container,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetAllAttendances,
  useGetAllSchedules,
  useGetAllTeams,
} from "../../services/queries";
import { Attendance } from "../../types/attendance";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Team } from "../../types/team";
import {
  AddOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import AddAttendance from "./AddAttendance";
import { useAuthState } from "../../hook/useAuth";

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
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}, ${day} ${month} ${year}`;
};

const AttendancePage: React.FC = () => {
  const { eventId, scheduleId } = useParams<{
    eventId: string;
    scheduleId: string;
  }>();
  const {
    data: attendances,
    isLoading,
    isError,
  } = useGetAllAttendances(scheduleId!, eventId!);
  const { data: schedules } = useGetAllSchedules(eventId!);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { data: teams } = useGetAllTeams(eventId!);
  const navigate = useNavigate();
  const getTeamNameById = (teamId: string) => {
    const team = teams?.find((team: Team) => team.id === teamId);
    return team ? team.name : "Unknown Team";
  };
  const [openAddModal, setOpenAddModal] = useState(false);
  const { data } = useAuthState();
  const user = data?.user;  

  const currentSchedule = schedules?.find(
    (schedule) => schedule.id === scheduleId
  );
  const isScheduleEnded = currentSchedule
    ? new Date() > new Date(currentSchedule.endAttendance)
    : true;
  const hasUserAttended = attendances?.some(
    (att) => att.userId === user?.profile.sub
  );
  const isButtonDisabled = isScheduleEnded || hasUserAttended;

  const columns = React.useMemo<ColumnDef<Attendance>[]>(
    () => [
      { accessorFn: (row) => getTeamNameById(row.teamId), header: "Team Name" },
      { accessorKey: "fullname", header: "User" },
      { accessorKey: "name", header: "Email" },
      { accessorFn: (row) => renderDate(row.time), header: "Attendance time" },
    ],
    [teams]
  );

  useEffect(() => {
    console.log("Event ID:", eventId);
    console.log("Schedule ID:", scheduleId);
  }, [eventId, scheduleId]);

  const tableInstance = useReactTable({
    data: attendances || [],
    columns,
    state: { sorting },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  });

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", ml: 20 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Loading attendance data...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ textAlign: "center", justifyContent: "center", ml: 20 }}>
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Failed to load attendance data
        </Typography>
      </Box>
    );
  }

  if (attendances?.length === 0) {
    return (
      <Box
        sx={{
          display: "block",
          textAlign: "center",
          justifyContent: "center",
          ml: 40,
        }}
      >
        <Typography variant="h6">
          No attendance records found for this schedule
        </Typography>
        <Button
          variant="contained"
          sx={{ mb: 2 }}
          onClick={() => setOpenAddModal(true)}
          disabled={isButtonDisabled}
        >
          <AddOutlined /> Create Attendance
        </Button>
        <AddAttendance
          open={openAddModal}
          handleClose={() => setOpenAddModal(false)}
        />
        {/* </Box> */}
      </Box>
    );
  }

  return (
    <Container sx={{ mb: 4, minHeight: 550, width: "1000px" }}>
      <Breadcrumbs aria-label="breadcrumb">
        <Typography
          onClick={() => navigate(`/events/${eventId}/schedules/`)}
          style={{ cursor: "pointer" }}
          color="inherit"
        >
          Schedule
        </Typography>
        <Typography color="text.primary">Attendance</Typography>
      </Breadcrumbs>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "1200px",
          mb: 2,
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, mt: 2 }}>
          Attendance List
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 5, maxHeight: 30 }}
          onClick={() => setOpenAddModal(true)}
          disabled={isButtonDisabled}
        >
          <AddOutlined /> Create Attendance
        </Button>

        <AddAttendance
          open={openAddModal}
          handleClose={() => setOpenAddModal(false)}
        />
      </Box>
      <TableContainer component={Paper} sx={{ maxWidth: 1200, minWidth: 1200 }}>
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
    </Container>
  );
};

export default AttendancePage;
