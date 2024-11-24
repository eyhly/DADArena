import React from "react";
import {
  AppBar,
  Toolbar,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import { AccountCircle, ManageAccountsRounded } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useSignOutRedirect, useAuthState } from "../../hook/useAuth";
import Logo from "/img/logo.png";

interface NavbarProps {
  onOpenUserMenu: (event: React.MouseEvent<HTMLElement>) => void;
  anchorElUser: HTMLElement | null;
  onCloseUserMenu: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenUserMenu, anchorElUser, onCloseUserMenu }) => {
  const navigate = useNavigate();
  const { mutate: signOutRedirect } = useSignOutRedirect();
  const { data } = useAuthState();
  const user = data?.user;
  const isAuthenticated = data?.isAuthenticated;

  const handleProfileClick = () => {
    if (user?.profile?.sub) {
      navigate(`/profile/${user.profile.sub}`);
      onCloseUserMenu();
    }
  };

  const handleLogout = () => {
    signOutRedirect();
    onCloseUserMenu();
  };

  return (
    <AppBar position="fixed" sx={{ width: "100%" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex"}}>
            <img src={Logo} alt="Logo" width="40px" />
          <Typography variant="h6" noWrap component="div" ml={2}>
            Sports Events
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title={isAuthenticated ? user?.profile?.name || "Profile" : "Login"}>
            <IconButton onClick={onOpenUserMenu} sx={{ px: 2, borderRadius: 2 }}>
              <AccountCircle />
              <Typography>
                {user?.profile?.email}
              </Typography>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={onCloseUserMenu}
          >
                <MenuItem onClick={handleProfileClick}>
                  <ManageAccountsRounded sx={{ mr: 1 }} /> My Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} /> Logout
                </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
