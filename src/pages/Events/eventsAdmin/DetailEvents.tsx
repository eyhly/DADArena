import React from 'react';
// import { Event } from '../../../types/event';
import { Button, CardMedia, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import ColorTheme from '../../../utils/colorTheme';
import { ThemeProvider } from '@emotion/react';
import { useEvent } from '../../../services/queries';
import { AccessTimeOutlined, HourglassTopOutlined } from '@mui/icons-material';

interface DetailEventsProps {
  open: boolean;
  onClose: () => void;
  eventId?: string;
}

const formatStatus = (status: string) => {
  return status
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

const DetailEvents: React.FC<DetailEventsProps> = ({ open, onClose, eventId }) => {

  const {data: event} = useEvent(eventId);

  const renderDate = (dateString: string) => {
    if (!dateString) return 'Unknown Date';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const day = String(date.getDate()).padStart(2, '0');
    return `${day} ${month} ${year}`;
  };

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <ThemeProvider theme={ColorTheme}>
        {/* Menambahkan properti `onClose` di Dialog untuk bisa di-close dengan backdrop */}
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
          <DialogTitle>Event Details: {event?.title}</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <CardMedia
                  component="img"
                  image={event?.image}
                  sx={{ objectFit: 'cover', width: 300, height: 200, borderRadius: 5}}
                  alt={event?.title}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" color='blue' gutterBottom display={'flex'}>
                  <HourglassTopOutlined/>{formatStatus(event?.status ?? 'Unknown')}
                </Typography>
              <Grid item xs={12}>
                <Typography sx={{fontStyle:'italic', fontWeight:700}} gutterBottom>
                Registration
                </Typography>
                <Typography variant="body1" gutterBottom display={'flex'}>
                <AccessTimeOutlined/>{renderDate(event?.registrationStartDate ?? '')} to{' '}
                  {renderDate(event?.registrationEndDate ?? '')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom sx={{fontStyle:'italic', fontWeight: 700}}>
                  Event Date
                </Typography>
                <Typography variant="body1" gutterBottom display={'flex'}>
                  <AccessTimeOutlined/> {renderDate(event?.eventStartDate ?? '')} to{' '}
                  {renderDate(event?.eventEndDate ?? '')}
                </Typography>
              </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='h6' sx={{fontStyle:'italic'}} gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1">
                 {event?.description ?? 'No description available'}
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </Container>
  );
};

export default DetailEvents;
