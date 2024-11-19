import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
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
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { Button, IconButton, Tooltip, Menu, MenuItem } from "@mui/material";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Logo from "/img/logo.png";
import { useAuthState, useSignOutRedirect } from "../../hook/useAuth";
import { useGetProfile } from "../../services/queries";
import useRolesLevel from "../../hook/useRolesLevel";

//mengatur width drawer normal dan ketika mini
const drawerWidth = 260;
const miniDrawerWidth = 72;

//untuk merubah icon di drawer
const roleLabels = {
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
  return roleLabels.committee || { label: "Unknown Role", icon: null };
};
export default function PermanentDrawerLeft() {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId } = useParams();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);
  const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);

  const { mutate: signOutRedirect } = useSignOutRedirect();
  const { data } = useAuthState();
  const user = data?.user;
  const isAuthenticated = data?.isAuthenticated;
  const userId = user?.profile.sub;
  const { data: profile } = useGetProfile(userId!);

  //untuk mendapatkan data roles
  const userRole = profile?.roles?.[0]?.toLowerCase() || "member";
  const secondUserRole = profile?.roles?.[1]?.toLowerCase(); // default role ya member
  const roleData = getRoleLabel([userRole]);
  const secondRole = secondUserRole
    ? getRoleLabel([secondUserRole])
    : { label: "unknown role", icon: null };
  const { isUser, isMember, isOfficial } = useRolesLevel();

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
    { text: "Match", icon: <Scoreboard />, path: `/events/${eventId}/matches` },
    {
      text: "Sport & Rules",
      icon: <SportsEsportsOutlined />,
      path: `/events/${eventId}/sports`,
    },
    {
      text: "Team",
      icon: <GroupsOutlined />,
      path: `/events/${eventId}/teams`,
    },
    {
      text: "Absence",
      icon: <EditNoteOutlined />,
      path: `/events/${eventId}/schedules`,
    },
    {
      text: "Recap Poin",
      icon: <EventNoteOutlined />,
      path: `/events/${eventId}/recap`,
    },
    {
      text: "Leaderboard",
      icon: <LeaderboardOutlined />,
      path: `/events/${eventId}/leaderboard`,
    },
    ...(isMember
      ? []
      : [
          {
            text: "Data User",
            icon: <PeopleOutlineOutlined />,
            path: `/events/${eventId}/user`,
          },
        ]),
    ...((isUser || isOfficial)
      ? []
      : [
          {
            text: "Settings",
            icon: <Settings />,
            path: `/events/${eventId}/detail`,
          },
        ]),
  ];

  const drawerContent = (
    <Box sx={{minHeight: 300, maxHeight: 300}}>
      <Toolbar />
      <Typography sx={{ mt: -5, mb: 2, mx: 2, display: "flex" }}>
        {roleData.icon}
        <Typography component={"span"} sx={{ml: 4}}>
          {roleData.label}
        </Typography>
        {secondUserRole && (
          <Typography component={"span"} sx={{ ml: 1}}>
            ({secondRole.label})
          </Typography>
        )}
      </Typography>
      <Divider />
      <List>
        {menuItems.map(({ text, icon, path }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              selected={location.pathname === path}
              onClick={() => handleNavigation(path)}
              sx={{
                "&.Mui-selected": {
                  "& .MuiListItemIcon-root": {
                    color: (theme) => theme.palette.primary.main,
                  },
                  "& .MuiListItemText-primary": {
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
      {isDrawerOpen ? <Button
        variant="contained"
        color="primary"
        sx={{ maxHeight: 50, mb: -50, mx: 7, }}
        onClick={handleBack}
      >
        <LoginOutlined /> Back
      </Button> : 
      
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: -40, p:1, minWidth: 10, ml: 2}}
        onClick={handleBack}
      >
        <LoginOutlined /> 
      </Button>}
      <Divider />
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: 1,
          width: `calc(100% - ${isDrawerOpen ? drawerWidth : miniDrawerWidth}px)`,
          ml: drawerWidth,
        }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", justifyContent: "space-between", width: '100%', alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
              <img src={Logo} alt="Logo" width="40px" />
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ ml: 2 }}
                onClick={() => navigate(`/`)}
                style={{ cursor: "pointer" }}
              >
                Sports Events
              </Typography>
            </Box>
            <Box sx={{display: 'flex', alignItems:'center'}}>
              <Tooltip
                title={
                  isAuthenticated ? user?.profile.name || "Profile" : "Login"
                }
              >
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ px: 2, borderRadius: 2 }}
                >
                  <AccountCircle />
                  <Typography>{user?.profile.email}</Typography>
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
                      <ManageAccountsRounded /> My Profile
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
          </Box>
        </Toolbar>
      </AppBar>
      {/* Drawer */}
      <Drawer
        sx={{
          width: isDrawerOpen ? drawerWidth : miniDrawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isDrawerOpen ? drawerWidth : miniDrawerWidth,
            transition: "width 0.5s",
            overflowX: "hidden",
          },
        }}
        variant="permanent"
        open={isDrawerOpen}
        anchor="left"
      >
        {drawerContent}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { xs: miniDrawerWidth, sm: isDrawerOpen ? 160 : 160 },
          transition: "margin-left 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Toolbar />
      </Box>
    </Box>
  );
}
