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
  tableCellClasses,
  Tooltip,
  Container,
  Breadcrumbs,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllTeams, useGetAllTotalPoints, useGetProfile } from "../../services/queries";
import { styled } from "@mui/system";
import { TotalPoint } from "../../types/totalPoint";
import { KeyboardArrowDown, KeyboardArrowUp, RemoveRedEyeOutlined, SaveAltRounded } from "@mui/icons-material";
import { Team } from "../../types/team";
import DetailMatchPoint from "./DetailMatchPoint";
import { useAuthState } from "../../hook/useAuth";
import useApi from "../../services/api";

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
  const {exportRecapPoint} = useApi();
  const { data: teams} = useGetAllTeams(eventId!);
  const { data: totalPoints, isLoading, isError } = useGetAllTotalPoints(eventId!);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTeamPoints, setSelectedTeamPoints] = useState<TotalPoint | null>(null);  
  const [isPending, setIsPending] = useState(false);

  const {data : bio} = useAuthState();
  const user = bio?.user;
  const userId = user?.profile.sub;
  const {data: profile} = useGetProfile(userId!);
  const roles = profile?.roles || [];
  const isCaptain = roles.includes("captain");
  const isOrganizer = roles.includes("committee") || roles.includes("official");

  const handleDownload = async () => {
    setIsPending(true);
    await exportRecapPoint(eventId!)
    setIsPending(false);
  }

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
             Extra Point
          </Button>
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
      <Box sx={{ display: "block", justifyContent: "center", textAlign:'center', alignItems: 'center', ml: 20}}> 
        <CircularProgress />
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography variant="h6" color="error" sx={{ display: "block", justifyContent: "center", textAlign:'center', alignItems: 'center'}}>
        Error fetching data.
      </Typography>
    );
  }

  if (totalPoints.length === 0 ) {
     return (
      <Box sx={{ display: "block", justifyContent: "center", textAlign:'center', alignItems: 'center', ml: 20}}>
        <Typography variant="h6">No recap point found for this event</Typography>
      </Box>
     )
  }

  return (
    <Container sx={{ mb: 4, width: '1000px', minHeight: 550, maxHeight: 550 }}>
      <Breadcrumbs aria-label="breadcrumb">
          <Typography
            color="text.primary"
          >
          Recap
          </Typography>
        </Breadcrumbs>
        <Box sx={{display: 'flex', justifyContent:'space-between', width: '1200px', mb: 2}}>
        <Typography variant="h4" >
          Recap Point
        </Typography>
        {(isOrganizer || isCaptain)
          ? [ 
            <Button
              variant="contained"
              size="small"
              sx={{ gap: 1, mt: 5, maxHeight: 30 }}
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
          </Box>
      <TableContainer component={Paper} sx={{maxWidth: 1200, minWidth: 1200, overflow:'auto', maxHeight: 500}}>
        <Table stickyHeader aria-label="customized collapsible table">
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
    </Container>
  );
};

export default Recap;
