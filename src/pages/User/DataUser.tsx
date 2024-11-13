import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
import { UserLogin } from "../../types/user";
import { AddOutlined, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
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
  const { data: users, isLoading, isError } = useGetUserInfo();
  const [sorting, setSorting] = useState<SortingState>([]);
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
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  });

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4, ml: 95 }}>
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
        <Button
          size="small"
          variant="contained"
          sx={{ mt: 2, mb: 3 }}
          startIcon={<AddOutlined />}
        >
          Create Sport
        </Button>
      </Box>
    );
  }

  return (
    <Container sx={{ mb: 4, width: "1000px", minHeight: 500, maxHeight: 500, ml: 50 }}>
      <Typography variant="h3" sx={{ color: "black", textAlign: "center", mb: 4 }}>
        List User
      </Typography>
      <TableContainer component={Paper} sx={{ maxWidth: 1000, maxHeight: 500, overflow: "auto" }}>
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
