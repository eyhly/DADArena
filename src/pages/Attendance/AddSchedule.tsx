import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { useCreateSchedule } from '../../services/mutation';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Schedule } from '../../types/schedule';
import Swal from 'sweetalert2';
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { scheduleSchema } from '../../utils/schema';

interface AddModalSchedule {
    open: boolean;
    handleClose: () => void;
}
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // return date.toISOString().slice(0, 16).replace('T', ' ') + 'Z';
    console.log('date', date.toISOString())
    return date.toISOString();
}

const AddSchedule:React.FC<AddModalSchedule>= ({open, handleClose}) => {
    const {eventId} = useParams();
    const {mutate} = useCreateSchedule();
    const queryClient = useQueryClient();
    const today = new Date().toISOString().slice(0, 16);
    console.log(today)

    const {handleSubmit, control, reset, formState: {errors}} = useForm<Schedule>({
        resolver: zodResolver(scheduleSchema)
    });
    const [startAttendance, setStartAttendance] = useState<string>("");

    const onSubmit: SubmitHandler<Schedule> = (data) => {
        console.log('yang di submit?', data);
        if (!eventId) {
            console.log('event id not found!');
            return;
        }
    
        const formattedData = {
            ...data,
            // startAttendance: formatDate(data.startAttendance),
            // endAttendance: formatDate(data.endAttendance),
            week: Number(data.week),
            startAttendance: formatDate(data.startAttendance),
            endAttendance: formatDate(data.endAttendance),
        };
    
        mutate(
            { data: formattedData, eventId },
            {
                onSuccess: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Schedule added successfully!',
                        confirmButtonText: 'Ok',
                    });
                    queryClient.invalidateQueries({ queryKey: ['schedules'] });
                    reset();
                    handleClose();
                },
                onError: (error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error instanceof Error ? error.message : 'An unexpected error occurred.',
                        confirmButtonText: 'Ok',
                    });
                    handleClose();
                },
            }
        );
    };
  return (
        <Dialog open={open}>
            <DialogContent>
                <DialogTitle variant='h6' sx={{mb: 2}}>
                    Add Schedule
                </DialogTitle>
                <Box component='form' onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <Grid item  xs={12}>
                            <Controller
                            name='week'
                            control={control}
                            defaultValue={1}
                            render={({field}) => (
                                <TextField
                                {...field}
                                label={<Typography component="span">
                                    Week <Typography component="span" color="red"> *</Typography>
                                </Typography>}
                                type='number'
                                variant='outlined'
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
                            name='startAttendance'
                            control={control}
                            defaultValue={today}
                            render={({field}) => (
                                <TextField
                                {...field}
                                label={<Typography component="span">
                                    Start Attendance <Typography component="span" color="red"> *</Typography>
                                </Typography>}
                                type='datetime-local'
                                inputProps={{min: today}}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant='outlined'
                                fullWidth
                                error={!!errors.startAttendance}
                                helperText={errors.startAttendance?.message}
                                onChange={(e) => {
                                    setStartAttendance(e.target.value);
                                    field.onChange(e);
                                }}
                                />
                            )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                            name='endAttendance'
                            control={control}
                            defaultValue={today}
                            render={({field}) => (
                                <TextField
                                {...field}
                                label={<Typography component="span">
                                    End Attendance <Typography component="span" color="red"> *</Typography>
                                </Typography>}
                                type='datetime-local'
                                inputProps={{min: startAttendance || today}}
                                InputLabelProps={{
                                    shrink: true
                                }}
                                variant='outlined'
                                disabled={!startAttendance}
                                fullWidth
                                error={!!errors.endAttendance}
                                helperText={errors.endAttendance?.message}
                                />
                            )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Button type='submit' variant='contained' fullWidth>
                                Add Schedule
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant='contained' fullWidth onClick={handleClose}>
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
        </Dialog>
  )
}

export default AddSchedule