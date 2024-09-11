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
import { useGetAllSports } from "../../../services/queries";
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
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditCalendarOutlined from "@mui/icons-material/EditCalendarOutlined";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Swal from "sweetalert2";
import { useDeleteSport } from "../../../services/mutation";
import { useQueryClient } from "@tanstack/react-query";
import { Sport } from "../../../types/sport";
import AddSport from "./AddSport"; 
import ColorTheme from "../../../utils/ColorTheme";
import UpdateSport from "./UpdateSport";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { LogoutOutlined } from "@mui/icons-material";
import DescriptionRule from "./DescriptionRule";

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

const SportsTable: React.FC = () => {
  const { eventId } = useParams<{eventId: string}>();
  const { data, isLoading, isError } = useGetAllSports(eventId!);
  const queryClient = useQueryClient();
  const deleteSport = useDeleteSport();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [open, setOpen] = useState(false); //modal add sport
  const [updateSportOpen, setUpdateSportOpen] = useState(false); //update sport
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false); //description rule
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  const filteredData = React.useMemo(
    () => data?.filter((sport) => sport.eventId === eventId) ?? [],
    [data, eventId]
  );

  const handleOpenDescriptionModal = (sport: Sport) => {
    setSelectedSport(sport);
    setDescriptionModalOpen(true);
  };

  const handleOpenUpdateSportModal = (sport: Sport) => {
    setSelectedSport(sport);
    setUpdateSportOpen(true);
  };

  const handleDelete = async (id: string, eventId: string) => {
    const confirmation = await Swal.fire({
      title: "Are you sure want to delete this sport?",
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
        await deleteSport.mutateAsync({id, eventId});
        queryClient.invalidateQueries({ queryKey: ["sports", eventId] });
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Sport deleted successfully!",
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

  const columns = React.useMemo<ColumnDef<Sport>[]>(
    () => [
      {
        accessorFn: (row, i) => i + 1,
        header: "No",
      },
      {
        accessorKey: "title",
        header: "Title ",
      },
      {
        accessorKey: "minPlayer",
        header: "Min Player",
      },
      {
        accessorKey: "maxPlayer",
        header: "Max Player",
      },
      {
        accessorKey: "minWomen",
        header: "Min Women",
      },
      {
        accessorKey: "minMen",
        header: "Min Men",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <>
            <Button onClick={() => handleOpenUpdateSportModal(row.original)}>
             <EditCalendarOutlined /> {/*  Update */}
            </Button>
            <Button
              onClick={() => handleDelete(row.original.id, row.original.eventId)}
              sx={{ color: "red" }}
            >
              <DeleteOutlineOutlined /> {/*Delete*/}
            </Button>
            <Button onClick={() => handleOpenDescriptionModal(row.original)} sx={{ color: "#24aed4" }}>
              <VisibilityOutlinedIcon /> {/*More Rules*/}
            </Button>
            <Button onClick={() => navigate(`/events/${eventId}/sports/${row.original.id}/matches`)}>
            <ScoreboardIcon />
            </Button>
          </>
        ),
      },
    ],
    []
  );

  const tableInstance = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  });

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4, ml: 90 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Loading sports...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography variant="h6" sx={{ marginTop: 2, ml: 90 }}>
          Failed to load sports
        </Typography>
      </Box>
    ); 
  }

  if (filteredData.length === 0) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 2 }}>
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          No sports found for this event
        </Typography>
        <Button
          size="small"
          variant="contained"
          sx={{ mt: 2, mb: 3, maxHeight: 50, maxWidth: "100%" }}
          onClick={() => setOpen(true)}
        >
          <AddOutlinedIcon /> Create Sport
        </Button>
        <AddSport open={open} handleClose={() => setOpen(false)} />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={ColorTheme}>
      <Typography variant="h3" sx={{ ml: 90, mb: 3 }}>
        List Sport
      </Typography>
      <Button
        size="small"
        variant="contained"
        sx={{ mb: 2, maxHeight: 50, ml: 145, maxWidth: "100%" }}
        onClick={() => setOpen(true)}
      >
        <AddOutlinedIcon /> Create Sport
      </Button>
      <AddSport open={open} handleClose={() => setOpen(false)} />
      <TableContainer component={Paper} sx={{ ml: 50, maxWidth: 1000 }}>
        <Table aria-label="customized collapsible table">
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
      <Button onClick={handleBack} variant="contained">
        <LogoutOutlined /> Back
      </Button>

      {/* update sport modal */}
      {selectedSport && (
        <UpdateSport
          open={updateSportOpen}
          handleClose={() => setUpdateSportOpen(false)}
          sport={selectedSport}
        />
      )}

      {/* description rule modal */}
      <DescriptionRule
        open={descriptionModalOpen}
        handleClose={() => setDescriptionModalOpen(false)}
        sport={selectedSport}
      />
    </ThemeProvider>
  );
};

export default SportsTable;
