import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SidebarAdmin from '../Sidebar/SidebarAdmin';
import { Grid } from '@mui/material';
import EventsPage from '../Events/EventsPage';

// contoh data untuk kartu
// const cardData = [
//   {
//     id: 1,
//     title: 'Lizard 1',
//     description: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species.',
//     image: '../../../public/logo.png',
//   },
//   {
//     id: 2,
//     title: 'Lizard 2',
//     description: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species.',
//     image: '../../../public/logo.png',
//   },
//   {
//     id: 3,
//     title: 'Lizard 3',
//     description: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species.',
//     image: '../../../public/logo.png',
//   },
//   // Tambahkan lebih banyak data sesuai kebutuhan
// ];

export default function DashboardAdmin() {
  return (
    <>
      <SidebarAdmin />
      {/* <Grid container spacing={2} sx={{ flexGrow: 1, p: 2 }}>
        <Grid item xs={12}>
          <Grid container spacing={2} justifyContent="center">
            {cardData.map((card) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={card.id}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                    component="img"
                    alt={card.title}
                    height="220"
                    image={card.image}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Share</Button>
                    <Button size="small">Learn More</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid> */}
      <EventsPage/>
    </>
  );
}