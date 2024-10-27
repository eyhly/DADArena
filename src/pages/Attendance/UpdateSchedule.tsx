import React, { useState } from 'react';
import { Schedule } from '../../types/schedule';
import { useParams } from 'react-router-dom';
import { useUpdateSchedule } from '../../services/mutation';
import { useQueryClient } from '@tanstack/react-query';
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { zodResolver } from '@hookform/resolvers/zod';
import { scheduleSchema } from '../../utils/schema';

interface UpdateModalSchedule {
    open: boolean;
    handleClose: () => void;
    schedule: Schedule;
}

const submitDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString();
};

const UpdateSchedule: React.FC<UpdateModalSchedule> = ({ open, handleClose, schedule }) => {
    const { eventId } = useParams();
    const { mutate } = useUpdateSchedule();
    const queryClient = useQueryClient();
    const [startAttendance, setStartAttendance] = useState<string>("");

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        const padTo2Digits = (num: number) => num.toString().padStart(2, '0');
        const year = date.getFullYear();
        const month = padTo2Digits(date.getMonth() + 1);
        const day = padTo2Digits(date.getDate());
        const hours = padTo2Digits(date.getHours());
        const minutes = padTo2Digits(date.getMinutes());

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const today = formatDate(new Date().toISOString());

    const { handleSubmit, control, watch, formState: {errors} } = useForm<Schedule>({
        defaultValues: {
            ...schedule,
            week: Number(schedule.week),
            startAttendance: formatDate(schedule.startAttendance),
            endAttendance: formatDate(schedule.endAttendance),
        },
        resolver: zodResolver(scheduleSchema)
    });

    //biar value awalnya sesuai dengan startattendance yang akan diedit
    const startAttendanceValue = watch('startAttendance'); 

    const onSubmit: SubmitHandler<Schedule> = async (data) => {
        const formattedData = {
            ...data,
            startAttendance: submitDate(data.startAttendance),
            endAttendance: submitDate(data.endAttendance),
        };

        mutate(
            { id: schedule.id, eventId: eventId!, data: formattedData },
            {
                onSuccess: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Schedule updated successfully',
                        confirmButtonText: 'Ok',
                    });
                    queryClient.invalidateQueries({ queryKey: ['schedules']});
                    handleClose();
                },
                onError: (error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error instanceof Error ? error.message : 'An unexpected error occurred',
                        confirmButtonText: 'Ok',
                    });
                    handleClose();
                },
            }
        );
    };

    return (
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle variant="h6">Update Schedule</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Controller
                                    name="week"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={<Typography component="span">
                                                Week <Typography component="span" color="red"> *</Typography>
                                            </Typography>}
                                            type="number"
                                            variant="outlined"
                                            fullWidth
                                            error={!!errors.week}
                                            helperText={errors.week?.message}
                                            onChange={(e) => {
                                                field.onChange(Number(e.target.value))
                                            }}
                                         />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controller
                                    name="startAttendance"
                                    control={control}
                                    render={({ field}) => (
                                        <TextField
                                            {...field}
                                            label={<Typography component="span">
                                                Start Attendance <Typography component="span" color="red"> *</Typography>
                                            </Typography>}
                                            type="datetime-local"
                                            variant="outlined"
                                            fullWidth
                                            inputProps={{min: startAttendanceValue}}
                                            error={!!errors.startAttendance}
                                            helperText={errors.startAttendance?.message}
                                            onChange={(e) => {
                                                setStartAttendance(e.target.value);
                                                field.onChange(e);
                                            }}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controller
                                    name="endAttendance"
                                    control={control}
                                    render={({ field}) => (
                                        <TextField
                                            {...field}
                                            label={<Typography component="span">
                                                End Attendance <Typography component="span" color="red"> *</Typography>
                                            </Typography>}
                                            type="datetime-local"
                                            variant="outlined"
                                            fullWidth
                                            disabled={!startAttendance}
                                            error={!!errors.endAttendance}
                                            helperText={errors.endAttendance?.message}
                                            InputLabelProps={{ shrink: true }}
                                            inputProps={{
                                                min: startAttendance || today, 
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Button type="submit" variant="contained" fullWidth>
                                    Update Schedule
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="contained" fullWidth onClick={handleClose}>
                                    Batal
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
            </Dialog>
    );
};

export default UpdateSchedule;
