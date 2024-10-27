// import { AppBar, Box, CssBaseline, IconButton, MenuItem, Slide, ThemeProvider, Toolbar, Tooltip, Typography, useScrollTrigger } from '@mui/material'
// import React from 'react'
// import ColorTheme from '../../utils/ColorTheme'
// import { AccountCircle } from '@mui/icons-material';



// const Navbar = () => {
//  function HideOnScroll(props: any) {
//     const { children, window } = props;
//     const trigger = useScrollTrigger({
//       target: window ? window() : undefined,
//     });
//     return (
//       <Slide appear={false} direction="down" in={!trigger}>
//         {children}
//       </Slide>
//     ); return (
//     <ThemeProvider theme={ColorTheme}>
//      <HideOnScroll>
//         <AppBar position="fixed" sx={{ width: "100%" }}>
//           <Toolbar sx={{ justifyContent: "space-between" }}>
//             <Box>
//               <Typography
//                 variant="h6"
//                 noWrap
//                 component="div"
//                 sx={{ display: "flex" }}
//               >
//                 <img src={Logo} alt="Logo" width="40px" />
//                 DAD Sports League
//               </Typography>
//             </Box>
//             <Box sx={{ flexGrow: 0 }}>
//               <Tooltip title={isAuthenticated ? user?.name || "Profile" : "Login"}>
//                 <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
//                   <AccountCircle />
//                 </IconButton>
//               </Tooltip>
//               <Menu 
//                 sx={{ mt: "45px", ml: 175, width:500 }}
//                 id="menu-appbar"
//                 anchorEl={anchorElUser}
//                 anchorOrigin={{
//                   vertical: "top",
//                   horizontal: "right",
//                 }}
//                 keepMounted
//                 transformOrigin={{
//                   vertical: "top",
//                   horizontal: "right",
//                 }}
//                 open={Boolean(anchorElUser)}
//                 onClose={handleCloseUserMenu}
//               >
//                 {isAuthenticated ? (
//                   <>
//                     <MenuItem>
//                       <Typography>{user?.email}</Typography>
//                     </MenuItem>
//                     <MenuItem onClick={handleLogout}>
//                       <Typography sx={{ textAlign: "center", display: "flex" }}>
//                         <LogoutIcon />
//                         Logout
//                       </Typography>
//                     </MenuItem>
//                   </>
//                 ) : (
//                   <MenuItem onClick={() => loginWithRedirect()}>
//                     <Typography>Login</Typography>
//                   </MenuItem>
//                 )}
//               </Menu>
//             </Box>
//           </Toolbar>
//         </AppBar>
//       </HideOnScroll>
//         </ThemeProvider>
// ) }


// }

// export default Navbar