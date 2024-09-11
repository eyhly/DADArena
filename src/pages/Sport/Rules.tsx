import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
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
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllRules, useSportDetails } from "../../services/queries";
import { useDeleteRule } from "../../services/mutation";
import Swal from "sweetalert2";
import { Rule } from "../../types/rules"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { styled, tableCellClasses } from "@mui/material";
import AddRule from "./AddRule"; // Modal component for adding rules
import ColorTheme from "../../utils/ColorTheme";
import { LoginOutlined } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
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

const ListRules: React.FC = () => {
  const { sportId } = useParams();
  const { data: allRules, isLoading, isError } = useGetAllRules();
  const { data: sport } = useSportDetails(sportId);
  const deleteRule = useDeleteRule();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [addRuleOpen, setAddRuleOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleBack = () => {
    navigate(-1)
  }
  const filteredRules = React.useMemo(() => {
    if (!allRules || !sportId) return [];
    return allRules.filter((rule) => rule.sportId === sportId);
  }, [allRules, sportId]);

  const handleDelete = async (id: string) => {
    const confirmation = await Swal.fire({
      title: "Are you sure you want to delete this rule?",
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
        await deleteRule.mutateAsync(id);
        queryClient.invalidateQueries({ queryKey: ['rules'] });
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Rule deleted successfully!",
          confirmButtonText: "Ok",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: error.toString(),
          confirmButtonText: "Ok",
        });
      }
    }
  };

  const columns = React.useMemo<ColumnDef<Rule>[]>(
    () => [
      { accessorFn: (row, i) => i + 1, header: "No" },
      { accessorKey: "minPlayer", header: "Min Player" },
      { accessorKey: "maxPlayer", header: "Max Player" },
      { accessorKey: "minWomen", header: "Min Woman" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <>
            <Button onClick={() => handleOpenUpdateRuleModal(row.original)}>
              <EditOutlinedIcon /> Update
            </Button>
            <Button
              onClick={() => handleDelete(row.original.id)}
              sx={{ color: "red" }}
            >
              <DeleteOutlineOutlinedIcon /> Delete
            </Button>
          </>
        ),
      },
    ],
    []
  );

  const tableInstance = useReactTable({
    data: filteredRules,
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
          Loading rules...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Failed to load rules
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={ColorTheme}>
      <Box sx={{ padding: 2, ml: 70, mt: -15 }}>
      <Typography variant="h3" sx={{ml:10, mb : 5}}>List Rule Sport {sport?.title}</Typography>    
          <Button
            variant="contained"
            color="primary"
            onClick={() => setAddRuleOpen(true)}
            sx={{mb: 3, ml: 60 }} 
          >
            <AddOutlinedIcon /> Add Rule
          </Button>
       
        <TableContainer component={Paper}>
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
                            style: {
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                            },
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
              {tableInstance.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    sx={{ textAlign: "center" }}
                  >
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                tableInstance.getRowModel().rows.map((row) => (
                  <StyledTableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {addRuleOpen && (
          <AddRule
            open={addRuleOpen}
            handleClose={() => setAddRuleOpen(false)}
            sportId={sportId || ""}
          />
        )}
      <Button
            variant="contained"
            color="primary"
            sx={{maxHeight: 50, mt: 5 }}
            onClick={handleBack}
          >
            <LoginOutlined /> Back
          </Button>
      </Box>
    </ThemeProvider>
  );
};

export default ListRules;
