import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
import { UserLogin } from "../../types/user";
import {  KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useGetUserInfo } from "../../services/queries";
import RolesModal from "./Roles";

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

const DataUser: React.FC = () => {
  const [pageNumber, setPageNumber] =useState(1);
  const pageSize = 5;
  const [sorting, setSorting] = useState<SortingState>([]);
  const { data, isLoading, isError } = useGetUserInfo(pageNumber);
  const users = data?.data || []
  const pagination = data?.pagination;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserLogin | null>(null);  

  const handleOpenModal = (user: UserLogin) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const columns = React.useMemo<ColumnDef<UserLogin>[]>(
    () => [
      {
        accessorKey: "user_Metadata.fullname",
        header: "Name",
        cell: ({ getValue }) => getValue() || "—",
      },
      {
        accessorKey: "user_Metadata.gender",
        header: "Gender",
        cell: ({ getValue }) => getValue() || "—",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "last_Login",
        header: "Last Login",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button variant="contained" onClick={() => handleOpenModal(row.original)}>
            Roles
          </Button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: Array.isArray(users) ? users : [],
    columns,
    
    state: {
      sorting,
      pagination: {pageIndex: pageNumber - 1, pageSize},
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    manualPagination: true,
    manualSorting: true,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: (updater) => {
      setPageNumber((oldPageNumber) => {
        const newPagination =
          typeof updater === "function" ? updater({ pageIndex: oldPageNumber - 1, pageSize }) : updater;
  
        return newPagination.pageIndex + 1;
      });
    },
  
  });

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4, ml: 25 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Loading users...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Failed to load users
        </Typography>
      </Box>
    );
  }

  if (Array.isArray(users) && users.length === 0) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 3 }}>
        <Typography variant="h6">No users found for this event</Typography>
      </Box>
    );
  }

  return (
    <Container sx={{ mb: 4, width: "1000px", minHeight: 600, maxHeight: 500}}>
      <Box sx={{display: 'flex', px: 2, borderLeft: '10px solid #FFD500', height:'55px', mb: 4}}>
        {/* <Box sx={{border: '5px solid #FFD500', height: '55px' }}/> */}
      <Typography sx={{ color: "black", fontSize: 40 }}>
        List User
      </Typography>
      </Box>
      
      <TableContainer component={Paper} sx={{ minWidth: 1200, maxWidth: 1200, maxHeight: 500, overflow: "auto", position: 'relative' }}>
        <Table stickyHeader aria-label="customized collapsible table">
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
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
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === "asc" ? <KeyboardArrowUp /> : null}
                        {header.column.getIsSorted() === "desc" ? <KeyboardArrowDown /> : null}
                      </div>
                    )}
                  </StyledTableCell>
                ))}
              </TableRow>
            ))}
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

      <Box sx={{ height: '50px', mt: 4, mb: 2, display: 'flex', position:'fixed', bottom: 0}}>
        <Grid container sx={{alignItems: 'center', justifyContent: 'space-between', gap: 2}}>
        {/* previousPage */}
        <Grid item>
        <Button onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))} disabled={pageNumber === 1}>
            Previous
          </Button>

            {/* next page */}
          <Button onClick={() => setPageNumber((prev) => prev + 1)} disabled={!users || users.length < pageSize}>
            Next
          </Button>
        </Grid>
            
         <Grid item>
         <Typography component="span">
            Page <Typography component="span">{pageNumber} of {pagination?.totalPages || 0}</Typography>
          </Typography>
         </Grid>

          <Grid item>
          <TextField
          size="small"
            type="number"
            inputProps={{
              min: 1,
            }}
            onKeyDown={(e) => {
              const target = e.target as HTMLInputElement;
          
              if (e.key === 'Enter') {
                const page = Number(target.value);
                if (page >= 1) {
                  setPageNumber(page);
                }
              }
            }}
          />
          </Grid>
        </Grid>      
      </Box>

      <RolesModal
        open={isModalOpen}
        onClose={handleCloseModal}
        selectedUser={selectedUser}
        getNameById={(id) => users?.find((user) => user.user_Id === id)?.user_Metadata.fullname || ""}
      />
    </Container>
  );
};

export default DataUser;
