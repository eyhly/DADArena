import React from "react";
import { useParams } from "react-router-dom";
import { useUpdateExtraPoint } from "../../services/mutation";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ExtraPoint } from "../../types/extraPoint";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { extraPointSchema } from "../../utils/schema";
import axios from "axios";

interface UpdateExtraPointModalProps {
  open: boolean;
  handleClose: () => void;
  extrapoint: ExtraPoint;
}

const UpdateExtraPoint: React.FC<UpdateExtraPointModalProps> = ({
  open,
  handleClose,
  extrapoint,
}) => {
  const { eventId, teamId } = useParams();
  const { mutate } = useUpdateExtraPoint();
  const queryClient = useQueryClient();

  const { handleSubmit, control, formState: {errors} } = useForm<ExtraPoint>({
    defaultValues: extrapoint, resolver: zodResolver(extraPointSchema)
  });

  const onSubmit: SubmitHandler<ExtraPoint> = async (data) => {
    const format = {
      ...data,
      week: Number(data.week),
      point:  Number(data.point),
    }
    mutate(
      { id: extrapoint.id, eventId: eventId!, teamId: teamId!, data: format },
      {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Extra Point updated successfully!",
            confirmButtonText: "Ok",
          });
          queryClient.invalidateQueries({
            queryKey: ["extrapoints", eventId],
          });
          handleClose();
        },
        onError: (error) => {
          if (axios.isAxiosError(error)){
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data,
            confirmButtonText: "Ok",
          });
        }
          handleClose();
        },
      }
    );
  };

  return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle variant="h6">Update Extra Point</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 2 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Controller
                  name="week"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<Typography component='span'>
                        Week <Typography component='span' color='red'> *</Typography>
                      </Typography>}
                      type="number"
                      variant="outlined"
                      inputProps={{
                        min: 1,
                      }}
                      fullWidth
                      onChange={(e) => {
                        field.onChange(Number(e.target.value))
                      }}
                      error={!!errors.week}
                      helperText={errors.week?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="point"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<Typography component='span'>
                        Point
                        <Typography component='span' color='red'> *</Typography>
                      </Typography>}
                      type="number"
                      variant="outlined"
                      fullWidth
                      error={!!errors.point}
                      helperText={errors.point?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="dense"
                      label={<Typography component="span">
                        Description <Typography component="span" color="red" >
                          *
                        </Typography>
                      </Typography>}
                      type="text"
                      fullWidth
                      error={!!errors.description}
                      helperText={errors.description?.message}
                      variant="outlined"
                      multiline
                      rows={4}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Button type="submit" variant="contained" fullWidth>
                  Update Extra Point
                </Button>
              </Grid>
                <Grid item xs={6}>
                <Button variant="contained" fullWidth onClick={handleClose}>
                  Cancel
                </Button>
                </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
  );
};

export default UpdateExtraPoint;
