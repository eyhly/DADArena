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
  Button,
  ThemeProvider,
  tableCellClasses,
  Tooltip,
} from "@mui/material";
// import { AddOutlined } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllTeams, useGetAllTotalPoints } from "../../services/queries";
import { styled } from "@mui/system";
import ColorTheme from "../../utils/colorTheme";
import { TotalPoint } from "../../types/totalPoint";
import { KeyboardArrowDown, KeyboardArrowUp, RemoveRedEyeOutlined } from "@mui/icons-material";
import { Team } from "../../types/team";
import DetailMatchPoint from "./DetailMatchPoint";
// import DetailMatchPoint from "./DetailMatchPoint"; // Import modal


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

const StyledTotalPointsCell = styled(TableCell)({
  backgroundColor: "#6EC207", 
  fontWeight: "bold",         
  color: "white",             
});

const Recap: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { data: teams} = useGetAllTeams(eventId!);
  const { data: totalPoints, isLoading, isError } = useGetAllTotalPoints(eventId!);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTeamPoints, setSelectedTeamPoints] = useState<TotalPoint | null>(null);  

  const handleOpenModal = (teamPoints: TotalPoint) => {
    setSelectedTeamPoints(teamPoints);
    setOpenModal(true);
  };
  console.log(selectedTeamPoints);
  

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTeamPoints(null);
  };

  const getTeamNameById = (teamId: string) => {
    const team = teams?.find((team: Team) => team.id === teamId);
    console.log(team)
    return team ? team.name : 'Team not found';
  };

  const columns = React.useMemo<ColumnDef<TotalPoint>[]>(
    () => [
      // {
      //   accessorFn: (row, i) => i + 1,
      //   header: "No",
      // },
      {
        accessorFn: (row) => getTeamNameById(row.teamId),
        header: "Team Name",
      },
      {
        accessorKey: "totalMatchPoints",
        header: "Match Points",
      },
      {
        accessorKey: "totalExtraPoints",
        header: "Extra Points",
      },
      {
        accessorKey: 'totalPoints',
        header: "Total Points",
        cell: (info) =>(
          <StyledTotalPointsCell>
        {info.getValue() as number}
      </StyledTotalPointsCell>
      )},
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Box sx={{display: 'flex', justifyContent: 'space-evenly'}}>
          <Button variant="contained" onClick={() => navigate(`/events/${eventId}/recap/${row.original.teamId}/extrapoints`)}>
            {/*<AddOutlined /> Add*/} Extra Point
          </Button>
          {/* <Tooltip title="Detail Match Point" placement="right-end">
            <Button variant="contained" onClick={() => navigate(`/events/${eventId}/recap/${row.original.teamId}/detailmatchpoints`)}>
              <RemoveRedEyeOutlined/>
            </Button>
          </Tooltip> */}
          <Tooltip title="Detail Match Point" placement="right-end">
            <Button variant="contained" onClick={() => handleOpenModal(row.original)}>
              <RemoveRedEyeOutlined />
            </Button>
          </Tooltip>
          </Box>
        ),
      },
    ],
    []
  );

  const tableInstance = useReactTable({
    data: totalPoints ?? [],
    columns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  });

  if (isLoading ) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography variant="h6" color="error" sx={{ mt: 3 }}>
        Error fetching data.
      </Typography>
    );
  }

  if (totalPoints.length === 0 ) {
     return (
      <Box sx={{ textAlign: "center", marginTop: 3, ml: 90 }}>
        <Typography variant="h6">No recap point found for this event</Typography>
      </Box>
     )
  }

  return (
    <ThemeProvider theme={ColorTheme}>
      <Typography variant="h4" align="center" sx={{ mt: 3, ml: 80 }}>
        Recap Points
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 5, maxWidth: 1000, ml: 50 }}>
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

      <DetailMatchPoint
        open={openModal}
        onClose={handleCloseModal}
        selectedTeamPoints={selectedTeamPoints}
        getTeamNameById={getTeamNameById}
      />
    </ThemeProvider>
  );
};

export default Recap;
