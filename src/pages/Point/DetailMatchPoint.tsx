// import React, { useState, useMemo, useCallback } from "react";
// import {
//   useReactTable,
//   getCoreRowModel,
//   flexRender,
//   ColumnDef,
//   SortingState,
//   getSortedRowModel,
// } from "@tanstack/react-table";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   CircularProgress,
//   Typography,
//   Box,
//   tableCellClasses,
//   Button,
// } from "@mui/material";
// import { useNavigate, useParams } from "react-router-dom";
// import { useGetAllPoints, useGetAllTeams } from "../../services/queries";
// import { Container, styled } from "@mui/system";
// import {
//   // AddOutlined,
//   DeleteOutlineOutlined,
// //   EditOutlined,
//   KeyboardArrowDown,
//   KeyboardArrowUp,
// } from "@mui/icons-material";
// import { useDeleteExtraPoint } from "../../services/mutation";
// import AddExtraPoint from "./AddExtraPoint";
// import Swal from "sweetalert2";
// import { useQueryClient } from "@tanstack/react-query";
// // import UpdateExtraPoint from "./UpdateExtraPoint";
// import { Point } from "../../types/point";

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: theme.palette.primary.main,
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type(odd)": {
//     backgroundColor: theme.palette.action.hover,
//   },
//   "&:last-child td, &:last-child th": {
//     border: 0,
//   },
// }));

// const DetailMatchPoint: React.FC = () => {
//   const { eventId, teamId } = useParams<{ eventId: string; teamId: string }>();
//   const {
//     data: detailMatchPoint,
//     isLoading: isExtraPointsLoading,
//     isError: isExtraPointsError,
//   } = useGetAllPoints(eventId!);
//   const {
//     data: teams,
//     isLoading: isTeamsLoading,
//     isError: isTeamsError,
//   } = useGetAllTeams(eventId!);
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [openAdd, setOpenAdd] = useState(false);
// //   const [openUpdate, setOpenUpdate] = useState(false);
// //   const [selectedExtraPoint, setSelectedExtraPoint] =
//     useState<Point | null>(null);
//   const deleteExtraPoint = useDeleteExtraPoint();
//   const queryClient = useQueryClient();

//   const navigate = useNavigate();

//   const filteredExtraPoints = useMemo(
//     () =>
//       detailMatchPoint?.filter((point: Point) => point.teamId === teamId) || [],
//     [detailMatchPoint, teamId]
//   );

//   const getTeamNameById = useCallback(
//     (teamId: string) => {
//       const team = teams?.find((team) => team.id === teamId);
//       return team ? team.name : "Team not found";
//     },
//     [teams]
//   );

// //   const handleOpenUpdate = (point: Point) => {
// //     setSelectedExtraPoint(point);
// //     setOpenUpdate(true);
// //   };

//   const handleDelete = async (id: string, teamId: string) => {
//     const confirmation = await Swal.fire({
//       title: "Are you sure you want to delete this extra point?",
//       text: "You can cancel it!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "Cancel",
//     });

//     if (confirmation.isConfirmed) {
//       if (!eventId || !teamId) {
//         console.error("eventId or teamId is undefined");
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: "Event ID or Team ID is missing. Please try again.",
//           confirmButtonText: "Ok",
//         });
//         return;
//       }

//       deleteExtraPoint.mutateAsync(
//         { id, eventId, teamId },
//         {
//           onSuccess: () => {
//             Swal.fire({
//               icon: "success",
//               title: "Success",
//               text: "Extra point deleted successfully",
//               confirmButtonText: "Ok",
//             });
//             queryClient.invalidateQueries({
//               queryKey: ["points", eventId],
//             });
//           },
//           onError: (error) => {
//             Swal.fire({
//               icon: "error",
//               title: "Error",
//               text:
//                 error instanceof Error
//                   ? error.message
//                   : "An unexpected error occurred.",
//               confirmButtonText: "Ok",
//             });
//           },
//         }
//       );
//     }
//   };

//   const columns = useMemo<ColumnDef<Point>[]>(
//     () => [
//       // {
//       //   accessorFn: (row, i) => i + 1,
//       //   header: "No",
//       // },
//       {
//         accessorKey: "week",
//         header: "Week",
//       },
//       {
//         accessorKey: "sportTitle",
//         header: "Sport",
//       },
//       {
//         accessorKey: "matchPoint",
//         header: "Point",
//         // cell: (info) => {
//         //   const value = info.getValue() as number;
//         //   return value < 0 ? value : value.toString();
//         // },
//       },
//       {
//         id: "action",
//         header: "Actions",
//         cell: ({ row }) => (
//           <>
//             {/* <Button onClick={() => handleOpenUpdate(row.original)}>
//               <EditOutlined />
//             </Button> */}
//             <Button
//               onClick={() => handleDelete(row.original.id, row.original.teamId)}
//             >
//               <DeleteOutlineOutlined sx={{ color: "red" }} />
//             </Button>
//           </>
//         ),
//       },
//     ],
//     [navigate]
//   );

//   const tableInstance = useReactTable({
//     data: filteredExtraPoints,
//     columns,
//     state: { sorting },
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     onSortingChange: setSorting,
//   });

//   if (isExtraPointsLoading || isTeamsLoading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 3, ml: 90 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (isExtraPointsError || isTeamsError) {
//     return (
//       <Typography variant="h6" color="error" sx={{ mt: 3, ml: 90 }}>
//         Error fetching data.
//       </Typography>
//     );
//   }

//   return (
//     <Container sx={{minWidth: 550, ml: 65, mt: -30}}>
//       <Typography variant="h4" align="center">
//         Detail Match Point {getTeamNameById(teamId!)}
//       </Typography>
//       <AddExtraPoint open={openAdd} handleClose={() => setOpenAdd(false)} />
//       <TableContainer component={Paper} sx={{ mt: 5, maxWidth: 800}}>
//         <Table>
//           <TableHead>
//             {tableInstance.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <StyledTableCell key={header.id} colSpan={header.colSpan}>
//                     {header.isPlaceholder ? null : (
//                       <div
//                         {...{
//                           onClick: header.column.getToggleSortingHandler(),
//                           style: { cursor: "pointer", display: "flex" },
//                         }}
//                       >
//                         {flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                         {header.column.getIsSorted() === "asc" ? (
//                           <KeyboardArrowUp />
//                         ) : null}
//                         {header.column.getIsSorted() === "desc" ? (
//                           <KeyboardArrowDown />
//                         ) : null}
//                       </div>
//                     )}
//                   </StyledTableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHead>
//           <TableBody>
//             {tableInstance.getRowModel().rows.map((row) => (
//               <StyledTableRow key={row.id}>
//                 {row.getVisibleCells().map((cell) => (
//                   <TableCell key={cell.id}>
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </TableCell>
//                 ))}
//               </StyledTableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       {/* {selectedExtraPoint && (
//         <UpdateExtraPoint
//           open={openUpdate}
//           handleClose={() => setOpenUpdate(false)}
//           extrapoint={selectedExtraPoint}
//         />
//       )} */}
//     </Container>
//   );
// };

// export default DetailMatchPoint;


import React from 'react';
import { Modal, Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import { TotalPoint } from '../../types/totalPoint'; // Assuming TotalPoint is defined in types

interface DetailMatchPointProps {
  open: boolean;
  onClose: () => void;
  selectedTeamPoints: TotalPoint | null; // Data for the selected team
  getTeamNameById: (teamId: string) => string;
}

const DetailMatchPoint: React.FC<DetailMatchPointProps> = ({
  open,
  onClose,
  selectedTeamPoints,
  getTeamNameById,
}) => {
  // If no selectedTeamPoints, return null
  if (!selectedTeamPoints) return null;

  const { matchPoints = [], totalPoints, teamId } = selectedTeamPoints;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: '80%',
          maxWidth: 800,
          padding: 3,
          backgroundColor: 'white',
          margin: 'auto',
          marginTop: '5%',
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        {/* Header Section */}
        <Typography variant="h6" gutterBottom>
          {getTeamNameById(teamId)} - Match Point Details
        </Typography>

        {/* Table to display matchPoints */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Week</TableCell>
              <TableCell>Sport</TableCell>
              <TableCell>Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matchPoints.map((point, index) => (
              <TableRow key={index}>
                <TableCell>{point.week}</TableCell>
                <TableCell>{point.sportTitle}</TableCell>
                <TableCell>{point.matchPoint}</TableCell>
              </TableRow>
            ))}
            <TableRow>
          <TableCell colSpan={2} align="right" sx={{ fontWeight: 'bold' }}>
            Total Points:
          </TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>
            {totalPoints}
          </TableCell>
        </TableRow>
          </TableBody>
        </Table>
      <Button onClick={onClose} variant='contained' sx={{mt: 2}}>
        Close
      </Button>
      </Box>
    </Modal>
  );
};

export default DetailMatchPoint;
