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
  HowToRegRounded,
  ManageAccountsRounded,
} from '@mui/icons-material';
import { Button, IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Logo from '/img/logo.png';
import { useAuthState, useSignOutRedirect } from '../../hook/useAuth';
import { useGetProfile } from '../../services/queries';

const drawerWidth = 260;

//untuk merubah icon di drawer
const roleLabels= {
  committee: { label: "Admin", icon: <SupportAgentOutlined /> },
  member: { label: "Member", icon: <PeopleOutlineOutlined /> },
  captain: { label: "Captain", icon: <GroupsOutlined /> },
  official: { label: "Official", icon: <HowToRegRounded /> },
};

const getRoleLabel = (userRoles) => {
  if (userRoles.includes("official")) {
    return roleLabels.official; // Prioritaskan role official
  }
  if (userRoles.includes("captain")) {
    return roleLabels.captain; // Jika ada captain
  }
  if (userRoles.includes("member")) {
    return roleLabels.member; // Jika ada member
  }
  return roleLabels.committee || { label: "Unknown Role", icon: null }; // Default ke committee jika tidak ada yang dikenal
};
export default function PermanentDrawerLeft() {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId } = useParams(); 
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const {mutate: signOutRedirect} = useSignOutRedirect();
  const {data} = useAuthState();
  const user = data?.user;
  const isAuthenticated = data?.isAuthenticated;
  const userId = user?.profile.sub;
  const { data: profile } = useGetProfile(userId!);

  //untuk mendapatkan data roles
  const userRole = profile?.roles?.[0]?.toLowerCase() || 'member'; 
  const secondUserRole = profile?.roles?.[1]?.toLowerCase()// default role ya member
  const roleData = getRoleLabel(userRole);
  const secondRole = getRoleLabel(secondUserRole)
  const isMember = userRole === "member";
  const isCaptain = userRole === "captain";
  
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

  const handleProfileClick = () => {
    if (user?.profile?.sub) {
      navigate(`/profile/${user.profile.sub}`);
      handleCloseUserMenu();
    }
  };

  const handleLogout = () => {
    signOutRedirect();
    handleCloseUserMenu();
  };

  const menuItems = [
    { text: 'Match', icon: <Scoreboard />, path: `/events/${eventId}/matches` },
    { text: 'Sport & Rules', icon: <SportsEsportsOutlined />, path: `/events/${eventId}/sports` },
    { text: 'Team', icon: <GroupsOutlined />, path: `/events/${eventId}/teams` },
    { text: 'Absence', icon: <EditNoteOutlined />, path: `/events/${eventId}/schedules` },
    { text: 'Recap Poin', icon: <EventNoteOutlined />, path: `/events/${eventId}/recap` },
    { text: 'Leaderboard', icon: <LeaderboardOutlined />, path: `/events/${eventId}/leaderboard` },
    ...(isMember ? [] : [{ text: 'Data User', icon: <PeopleOutlineOutlined />, path: `/events/${eventId}/user` }]),
    ...(isMember || isCaptain ? [] : [{ text: 'Settings', icon: <Settings />, path: `/events/${eventId}/detail` }]),
  ];
  

  const drawerContent = (
    <div>
      <Toolbar />
      <Typography sx={{ mt: -5, mb: 2, mx: 5, display: 'flex' }}>
        {roleData.icon}
        <Typography component={'span'} style={{ marginLeft: '8px' }}>{roleData.label}</Typography>
        { secondUserRole ? <Typography component={'span'} style={{ marginLeft: '8px' }}>({secondRole.label})</Typography> : <></> }
      </Typography>
      <Divider />
      <List>
        {menuItems.map(({ text, icon, path }) => (
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
              <Typography variant="h6" noWrap component="div" sx={{ ml: 2 }} onClick={() => navigate(`/`)}
            style={{ cursor: "pointer" }}>
                Sports Events
              </Typography>
            </Box>
            <Box>
              <Tooltip title={isAuthenticated ? user?.profile.name || "Profile" : "Login"}>
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
                  <div>
                    <MenuItem onClick={handleProfileClick}>
                      <ManageAccountsRounded/> My Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <Logout /> Logout
                    </MenuItem>
                  </div>
                ) : (
                  <MenuItem>
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
