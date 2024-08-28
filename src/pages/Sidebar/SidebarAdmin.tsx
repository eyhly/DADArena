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
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import ColorTheme from '../../utils/ColorTheme';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

export default function PermanentDrawerLeft() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const drawerContent = (
    <div>
      <Toolbar />
      <Typography sx={{ mt: -6, mb: 2, mx: 5 }}>
        <SupportAgentOutlinedIcon/>
        Admin
      </Typography>
      <Divider />
      <List>
        {[
          { text: 'Events', icon: <CalendarMonthIcon />, path: '/events' },
          { text: 'Team', icon: <GroupsOutlinedIcon />, path: '/team' },
          { text: 'Match', icon: <ScoreboardIcon />, path: '/match' },
          { text: 'Absensi', icon: <EditNoteOutlinedIcon />, path: '/absensi' },
          { text: 'Leaderboard', icon: <LeaderboardOutlinedIcon />, path: '/leaderboard' },
          { text: 'Data User', icon: <PeopleOutlineOutlinedIcon />, path: '/data-user' },
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
        </Box>
      </Box>
    </ThemeProvider>
  );
}
