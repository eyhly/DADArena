import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { useParams } from "react-router-dom";
import { useGetAllSports } from "../../services/queries";
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
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Sport } from "../../types/sport";
import ColorTheme from "../../utils/ColorTheme";
import EditCalendarOutlined from "@mui/icons-material/EditCalendarOutlined";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },

  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const columnDef: ColumnDef<Sport>[] = [
  // {
  //   accessorKey: "id",
  //   header: "ID",
  // },
  {
    accessorKey: "title",
    header: "Title",
  },
  // {
  //   accessorKey: "eventId",
  //   header: "Event ID",
  // },
];

const SportsTable: React.FC = () => {
    const { id } = useParams(); 
    const { data, isLoading, isError } = useGetAllSports();
  
    console.log("Data fetched:", data);
    console.log("Event ID from URL params:", id);
  
    const filteredData = React.useMemo(
      () => data?.filter((sport) => sport.eventId === id) ?? [],
      [data, id]
    );
  
    console.log("Filtered Data:", filteredData);
  
    const tableInstance = useReactTable({
      columns: columnDef,
      data: filteredData,
      getCoreRowModel: getCoreRowModel(),
    });
  
    if (isLoading) {
      return (
        <Box sx={{ textAlign: "center", marginTop: 4 }}>
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
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Failed to load sports
          </Typography>
        </Box>
      );
    }
  
    if (filteredData.length === 0) {
      return (
        <Box sx={{ textAlign: "center", marginTop: 4, ml: 35 }}>
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            No sports found for this event
          </Typography>
        </Box>
      );
    }
  
    return (
      <ThemeProvider theme={ColorTheme}>
        <Button size="small" variant="contained" sx={{ ml:180, mt:-20, mb: 3, maxHeight: 50, maxWidth: '100%' }} onClick={() => navigate('/events/add')}>
        <AddOutlinedIcon /> Create Sport
      </Button>
      <TableContainer component={Paper} sx={{ml: 50, maxWidth:1000}}>
        <Table aria-label="customized table">
          <TableHead>
            {tableInstance.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <StyledTableCell key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </StyledTableCell>
                ))}
                <StyledTableCell colSpan={2}>Action</StyledTableCell>
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {tableInstance.getRowModel().rows.map((row) => (
              <StyledTableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
                <TableCell sx={{maxWidth: 50}}>
                  <Button>
                  <EditCalendarOutlined/>
                  Update
                  </Button>
                  </TableCell>
                <TableCell>
                  <Button sx={{color: 'red'}}>
                  <DeleteOutlineOutlined/>
                  Delete
                  </Button>
                  </TableCell>
              </StyledTableRow>
            ))}
          
          </TableBody>
          <tfoot>
            {tableInstance.getFooterGroups().map((footerGroup) => (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((footer) => (
                  <TableCell key={footer.id} colSpan={footer.colSpan}>
                    {flexRender(
                      footer.column.columnDef.footer,
                      footer.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </tfoot>
        </Table>
      </TableContainer>
      </ThemeProvider>
    );
  };

export default SportsTable;
