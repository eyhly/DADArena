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
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateRoles, useDeleteRoles } from '../../services/mutation';
import { useGetAllRoles } from '../../services/queries';
import Swal from 'sweetalert2';
import axios from 'axios';

interface RolesProps {
  open: boolean;
  onClose: () => void;
  selectedUser:  UserLogin | null;
  getNameById: (user_Id: string) => string;
}

const RolesModal: React.FC<RolesProps> = ({ open, onClose, selectedUser , getNameById }) => {
  const { data: roleList = [], isLoading } = useGetAllRoles();
  const { mutate: createRole } = useCreateRoles();
  const { mutate: deleteRole } = useDeleteRoles();
  const queryClient = useQueryClient();
  const userId = selectedUser ?.user_Id;
  console.log("idddd", userId)

  const { handleSubmit, control, reset } = useForm<{ roles: { id: string }[] }>({
    defaultValues: { roles: [{ id: '' }] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'roles',
  });

  if (!selectedUser ) return null;

  const onSubmit = async (data: { roles: { id: string }[] }) => {
    if (!userId) return;

    const roles =data.roles.filter(role => role.id).map(role => role.id)

    const payload = {roles}
      // .filter(role => role.id) 
      // .map(role => ({ userId, roleId: role.id }));
      console.log(payload, "payload")
      console.log(userId, "id userby");
      
        await createRole({data: payload, userId},
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['roles'] });
              reset();
              Swal.fire('Success', 'Roles added successfully', 'success');
              onClose();
            }, 
            onError: (error) => {
              if (axios.isAxiosError(error)) {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: error.response?.data,
                  confirmButtonText: 'Ok',
                });
                onClose();
              }
            }
          }
        );  
  };

  const handleRemoveRole = async (roleName: string) => {
    if (!userId) return;

    const roleToRemove = roleList.find(role => role.name === roleName);

    const payload = {roles : [roleToRemove.id]}
    console.log('payload delete', payload);
    

      await deleteRole({ userId, data: payload}, 
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Role Successfully Removed!',
              cancelButtonText: "Ok"
            });      
            onClose();
          },
          onError : (error) => {
            if (axios.isAxiosError(error)) {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data,
                confirmButtonText: 'Ok',
              });
              onClose();
            }
          }
        }
      );    
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Roles of {getNameById(selectedUser .user_Id)}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h6" gutterBottom>
            Assigned Roles:
          </Typography>
          <Table>
            <TableBody>
              {selectedUser .roles && selectedUser .roles.length > 0 ? (
                selectedUser .roles.map((role, index) => (
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
            {fields.map((field, index) => (
              <Box key={field.id} display="flex " alignItems="center" mb={2}>
                <Controller
                  name={`roles.${index}.id`}
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      fullWidth
                      displayEmpty
                      variant="outlined"
                      required
                      sx={{ mr: 2 }}
                    >
                      <MenuItem value="" disabled>
                        Select Role
                      </MenuItem>
                      {isLoading ? (
                        <MenuItem disabled>
                          <Typography>Loading roles...</Typography>
                        </MenuItem>
                      ) : (
                        roleList.map((role) => (
                          <MenuItem key={role.id} value={role.id}>
                            {role.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  )}
                />
                <IconButton onClick={() => remove(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>

          <Button
            variant="contained"
            onClick={() => append({ id: '' })}
            startIcon={<AddIcon />}
            fullWidth
            sx={{ mb: 2 }}
          >
            Add Role
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
        <Button type="submit" variant="contained" onClick={handleSubmit(onSubmit)}>
          Add Roles
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RolesModal;