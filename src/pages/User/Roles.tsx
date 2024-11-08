import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Box,
  Select,
  MenuItem,
  IconButton,
  DialogActions,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { UserLogin } from '../../types/user';
import useRoles from '../../hook/useRoles';
import { useCreateRoles, useDeleteRoles } from '../../services/mutation';
import { useGetAllRoles } from '../../services/queries';

interface RolesProps {
  open: boolean;
  onClose: () => void;
  selectedUser: UserLogin | null;
  getNameById: (user_Id: string) => string;
}

const RolesModal: React.FC<RolesProps> = ({ open, onClose, selectedUser, getNameById }) => {
  const userRoles = useRoles();
  const roleList = useGetAllRoles();
  const { mutate: createRole } = useCreateRoles();
  const { mutate: deleteRole } = useDeleteRoles();
  
  const [selectedRole, setSelectedRole] = React.useState<string>('');

  if (!selectedUser) return null;

  const handleAddRole = () => {
    if (selectedRole) {
      createRole({ userId: selectedUser.user_Id, roleId: selectedRole });
      setSelectedRole(''); 
    }
  };

  const handleRemoveRole = (roleId: string) => {
    deleteRole({ userId: selectedUser.user_Id, roleId });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Roles of {getNameById(selectedUser.user_Id)}</DialogTitle>
      <DialogContent>
        <Box>
          <Typography variant="h6" gutterBottom>
            Assigned Roles:
          </Typography>
          <Table>
            <TableBody>
              {selectedUser.roles && selectedUser.roles.length > 0 ? (
                selectedUser.roles.map((role, index) => (
                  <TableRow key={index}>
                    <TableCell>{role}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleRemoveRole(role)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2}>
                    <Typography variant="body2" align="center">
                      No roles assigned
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Box display="flex" alignItems="center" mt={2}>
            {/* <Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              displayEmpty
              fullWidth
              placeholder="Select a role"
            >
              <MenuItem value="" disabled>
                Select Role
              </MenuItem>
              {roleList?.map((role : Roles['roles'][0]) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select> */}
            <IconButton color="primary" onClick={handleAddRole} sx={{ ml: 2 }}>
              <AddIcon />
            </IconButton>
          </Box>
        </Box>
        <DialogActions>
            <Button onClick={onClose}>
                Close
            </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default RolesModal;
