import * as React from 'react';
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
import {
  EditNoteOutlined,
  PeopleOutlineOutlined,
  LeaderboardOutlined,
  Scoreboard,
  GroupsOutlined,
  SupportAgentOutlined,
  Settings,
  SportsEsportsOutlined,
  LoginOutlined,
  AccountCircle,
  Logout,
  EventNoteOutlined,
} from '@mui/icons-material';
import { Button, IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import Logo from '/img/logo.png';

const drawerWidth = 260;

export default function PermanentDrawerLeft() {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId } = useParams(); 
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const drawerContent = (
    <div>
      <Toolbar />
      <Typography sx={{ mt: -5, mb: 2, mx: 5, display: 'flex' }}>
        <SupportAgentOutlined />
        Admin
      </Typography>
      <Divider />
      <List>
        {[
          { text: 'Match', icon: <Scoreboard />, path: `/events/${eventId}/matches` },
          { text: 'Sport & Rules', icon: <SportsEsportsOutlined />, path: `/events/${eventId}/sports` },
          { text: 'Team', icon: <GroupsOutlined />, path: `/events/${eventId}/teams` },
          { text: 'Absence', icon: <EditNoteOutlined />, path: `/events/${eventId}/schedules` },
          { text: 'Recap Poin', icon: <EventNoteOutlined />, path: `/events/${eventId}/recap` },
          { text: 'Leaderboard', icon: <LeaderboardOutlined />, path: `/events/${eventId}/leaderboard` },
          { text: 'Data User', icon: <PeopleOutlineOutlined />, path: `/events/${eventId}/user` },
          { text: 'Settings', icon: <Settings />, path: `/events/${eventId}/detail` },
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
        sx={{ maxHeight: 50, mb: -50, mx: 7 }}
        onClick={handleBack}
      >
        <LoginOutlined /> Back
      </Button>
      <Divider />
    </div>
  );

  return (
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        {/* AppBar */}
        <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img src={Logo} alt="Logo" width="40px" />
              <Typography variant="h6" noWrap component="div" sx={{ ml: 2 }} onClick={() => navigate(`/events`)}
            style={{ cursor: "pointer" }}>
                Sports Events
              </Typography>
            </Box>
            <Box>
              <Tooltip title={isAuthenticated ? user?.name || "Profile" : "Login"}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <AccountCircle />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {isAuthenticated ? (
                  <>
                    <MenuItem>
                      <Typography>{user?.email}</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                      <Logout /> Logout
                    </MenuItem>
                  </>
                ) : (
                  <MenuItem onClick={() => loginWithRedirect()}>
                    <Typography>Login</Typography>
                  </MenuItem>
                )}
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        {/* Drawer */}
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
      </Box>
  );
}
