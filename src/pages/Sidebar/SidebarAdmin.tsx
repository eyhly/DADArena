import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import ColorTheme from '../../utils/ColorTheme';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import { LoginOutlined } from '@mui/icons-material';

const drawerWidth = 240;

export default function PermanentDrawerLeft() {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId } = useParams(); 

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const drawerContent = (
    <div>
      <Toolbar />
      <Typography sx={{ mt: -6, mb: 2, mx: 5, display: 'flex' }}>
        <SupportAgentOutlinedIcon />
        Admin
      </Typography>
      <Divider />
      <List>
        {[
          { text: 'Team', icon: <GroupsOutlinedIcon />, path: `/events/${eventId}/team` },
          { text: 'Match', icon: <ScoreboardIcon />, path: `/events/${eventId}/match` },
          { text: 'Absensi', icon: <EditNoteOutlinedIcon />, path: `/events/${eventId}/absensi` },
          { text: 'Leaderboard', icon: <LeaderboardOutlinedIcon />, path: `/events/${eventId}/leaderboard` },
          { text: 'Data User', icon: <PeopleOutlineOutlinedIcon />, path: `/events/${eventId}/data-user` },
          { text: 'Settings', icon: <SettingsIcon />, path: `/events/${eventId}/data-user` },
        ].map(({ text, icon, path }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              selected={location.pathname === path}
              onClick={() => handleNavigation(path)}
              sx={{
                '&.Mui-selected': {
                  '& .MuiListItemIcon-root': {
                    color: (theme) => theme.palette.primary.main,
                  },
                  '& .MuiListItemText-primary': {
                    color: (theme) => theme.palette.primary.main,
                  },
                },
              }}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        color="primary"
        sx={{ maxHeight: 50, mb: -80, mx: 7 }}
        onClick={handleBack}
      >
        <LoginOutlined /> Back
      </Button>
      <Divider />
    </div>
  );

  return (
    <ThemeProvider theme={ColorTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              DAD Sports League
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          {drawerContent}
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
        >
          <Toolbar />
          {/* <Outlet /> */}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
