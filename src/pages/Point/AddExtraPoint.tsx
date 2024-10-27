import React from "react";
import { useParams } from "react-router-dom";
import { useCreateExtraPoint } from "../../services/mutation";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ExtraPoint } from "../../types/extraPoint";
import Swal from "sweetalert2";
import { ThemeProvider } from "@emotion/react";
import ColorTheme from "../../utils/colorTheme";
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

interface AddExtraPointModalProps {
  open: boolean;
  handleClose: () => void;
}

const AddExtraPoint: React.FC<AddExtraPointModalProps> = ({
  open,
  handleClose,
}) => {
  const { eventId, teamId } = useParams();
  const { mutate } = useCreateExtraPoint();
  const queryClient = useQueryClient();

  const { handleSubmit, control, reset, formState:{errors} } = useForm<ExtraPoint>({
    resolver: zodResolver(extraPointSchema)
  });

  const onSubmit: SubmitHandler<ExtraPoint> = async (data) => {
    console.log("isi datanya", data);
    if (!teamId) {
      console.log("team Id not found");
      return;
    }
    const format = {
      ...data,
      week: Number(data.week),
      point: Number(data.point)
    }
    mutate(
      { data: format, eventId: eventId!, teamId: teamId! },
      {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Extra Point added successfully!",
            confirmButtonText: "Ok",
          });
          queryClient.invalidateQueries({ queryKey: ["extrapoints", eventId] });
          reset();
          handleClose();
        },
        onError: (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              error instanceof Error
                ? error.message
                : "An unexpected error occurred.",
            confirmButtonText: "Ok",
          });
          handleClose();
        },
      }
    );
  };

  return (
    <ThemeProvider theme={ColorTheme}>
      <Dialog open={open}>
        <DialogContent>
          <DialogTitle variant="h6" sx={{ mb: 2 }}>
            Add Extra Point
          </DialogTitle>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Controller
                  name="week"
                  control={control}
                  defaultValue={1}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<Typography component='span'>
                        Week <Typography component='span' color='red'> *</Typography>
                      </Typography>}
                      type="number"
                      variant="outlined"
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
                  defaultValue={0}
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
                      // onChange={(e) => {
                      //   field.onChange(Number(e.target.value))
                      // }}
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
                  Add Extra Point
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="contained" fullWidth onClick={handleClose}>
                  Close
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default AddExtraPoint;
