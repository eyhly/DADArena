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
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

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
  const navigate = useNavigate();

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
          <Button
            onClick={() =>
              navigate(`/events/${eventId}/teams/${row.original.id}/members`)
            }
            sx={{ color: "#24aed4" }}
          >
            <VisibilityOutlinedIcon /> View Members
          </Button>
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
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography variant="h6" color="error" sx={{ mt: 3 }}>
        Error fetching teams.
      </Typography>
    );
  }

  return (
    <ThemeProvider theme={ColorTheme}>
      <Typography variant="h3" sx={{ ml: 90, mb: 3 }}>
        List Teams
      </Typography>
      <TableContainer component={Paper} sx={{ ml: 50, maxWidth: 900 }}>
        <Table>
          <TableHead>
            <StyledTableRow>
              {table
                .getHeaderGroups()
                .map((headerGroup) =>
                  headerGroup.headers.map((header) => (
                    <StyledTableCell key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div 
                        {...{
                          onClick: header.column.getToggleSortingHandler(),
                          style: {cursor: 'pointer', display: 'flex'}
                        }}
                        >

                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getIsSorted() === 'asc' ? <KeyboardArrowUp/> : null}
                          {header.column.getIsSorted() === 'desc' ? <KeyboardArrowDown/> : null}
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
    </ThemeProvider>
  );
};

export default ListTeam;
