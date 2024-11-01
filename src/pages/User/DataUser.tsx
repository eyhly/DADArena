import { Box, Button, CircularProgress, Container, Paper, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
// import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import React from 'react'
// import { useNavigate } from 'react-router-dom';
import { UserLogin } from '../../types/user';
import { AddOutlined, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { useGetUserInfo } from '../../services/queries';

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
    const {data: users, isLoading, isError} = useGetUserInfo();
    // const queryClient = useQueryClient();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    // const navigate = useNavigate();

    const columns = React.useMemo<ColumnDef<UserLogin>[]>(
        () => [
            {
                accessorKey: 'user_Id',
                header: "ID"
            },
            {
                accessorKey: 'nickname',
                header: "Name"
            },
            {
                accessorKey: "user_Metadata.fullname",
                header: "Username"
            },
            {
                accessorKey: 'email',
                header: "Email"
            },
            {
                accessorKey: "last_Login",
                header: "Last Login"
            }
        ], []
    )

    const table = useReactTable({
        data: Array.isArray(users) ? users : [], columns, 
        state: {
            sorting,
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
    })

    if (isLoading) {
        return (
          <Box sx={{ textAlign: "center", marginTop: 4, ml: 90 }}>
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
            <Typography variant="h6" sx={{ marginTop: 2, ml: 90 }}>
              Failed to load users
            </Typography>
          </Box>
        );
      }
    
      if (Array.isArray(users) && users.length ===  0) {
        return (
          <Box sx={{ textAlign: "center", marginTop: 3, ml: 90 }}>
            <Typography variant="h6">No users found for this event</Typography>
            <Button
              size="small"
              variant="contained"
              sx={{ mt: 2, mb: 3, maxHeight: 50, maxWidth: "100%" }}
            >
              <AddOutlined /> Create Sport
            </Button>
          </Box>
        );
      }

   return (
    <Container sx={{ml: 50, mt: 3}}>
        <Typography variant="h3" sx={{ color: "black", textAlign: 'center', mb: 2 }}>
            List User
        </Typography>
        <TableContainer
        component={Paper}
        sx={{maxWidth: 1000, maxHeight: 400, overflow: 'auto'}}
        >
            <Table stickyHeader aria-label='customized collapsible table'>
                <TableHead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
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
                                            {header.column.getIsSorted() === "asc" ? (
                                                <KeyboardArrowUp/>
                                            ) : null}
                                            {header.column.getIsSorted() === "desc" ? (
                                                <KeyboardArrowDown/>
                                            ) : null}
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
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell,  cell.getContext())}

                                </TableCell>
                            ))}
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Container>
  )
}

export default DataUser