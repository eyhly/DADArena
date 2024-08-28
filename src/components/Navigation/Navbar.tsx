import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { styled, ThemeProvider } from '@mui/material/styles';
import ColorTheme from '../../utils/ColorTheme';

interface AppBarProps {
  onMenuClick: () => void;
}

const drawerWidth = 240;

const StyledAppBar = styled(AppBar)(({theme}) => ({
  width: `calc(100% - ${drawerWidth}px)`,
  marginLeft: `${drawerWidth}px`,
  backgroundColor: theme.palette.primary.main,
}));

const Navbar: React.FC<AppBarProps> = ({ onMenuClick }) => {
  return (
    <ThemeProvider theme={ColorTheme}>
    <StyledAppBar position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onMenuClick}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          Dashboard Admin
        </Typography>
      </Toolbar>
    </StyledAppBar>
    </ThemeProvider>
  );
};

export default Navbar;
