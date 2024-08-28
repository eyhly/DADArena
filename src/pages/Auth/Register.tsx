// import React, { useState } from 'react';
// import { Box, Button, Card, Container, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
// import { Visibility, VisibilityOff } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import { useRegister } from '../../services/mutation'; // Import hook untuk registrasi
// import ImageLogReg from '../../../public/img/login&register.webp';
// import Logo from '../../../public/img/logo.png';

// const Register = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setEmail(e.target.value);
//   };

//   const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setPassword(e.target.value);
//   };

//   const onChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setConfirmPassword(e.target.value);
//   };

//   const registerMutation = useRegister();
//   const navigate = useNavigate();

//   const onSubmit = async () => {
//     if (password !== confirmPassword) {
//       Swal.fire({
//         icon: "error",
//         title: "Gagal",
//         text: "Password dan konfirmasi password tidak cocok.",
//         confirmButtonText: "Ok",
//       });
//       return;
//     }

//     try {
//       await registerMutation.mutateAsync({
//         email: email,
//         password: password,
//       });

//       Swal.fire({
//         icon: "success",
//         title: "Registrasi Berhasil",
//         text: "Anda telah berhasil mendaftar. Silakan login.",
//         confirmButtonText: "Login",
//       }).then((result) => {
//         if (result.isConfirmed) {
//           navigate("/login");
//         }
//       });
//     } catch (error: any) {
//       Swal.fire({
//         icon: "error",
//         title: "Registrasi Gagal",
//         text: error.toString(),
//         confirmButtonText: "Ok",
//       });
//     }
//   };

//   return (
//     <Container 
//       sx={{
//         display: 'flex',
//         marginX: 30
//       }}
//     >
//       <Card 
//         sx={{ 
//           width: 400, 
//           padding: 3, 
//           borderRadius: 3,
//           boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
//           backgroundColor: 'rgba(255, 255, 255, 0.8)', 
//           marginRight: 20,
//         }}
//       >
//         <Box
//           sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             marginTop: 5
//           }}
//         >
//           <img src={Logo} alt="Logo" width="100"  />
//           <Typography component="h1" variant="h5" sx={{ marginTop: 3, marginBottom: 2 }}>
//             Register
//           </Typography>
//           <TextField
//             margin="normal"
//             fullWidth
//             id="email"
//             label="Email Address"
//             value={email}
//             onChange={onChangeEmail}
//             sx={{ marginBottom: 2 }}
//           />
//           <TextField
//             margin="normal"
//             fullWidth
//             label="Password"
//             type={showPassword ? 'text' : 'password'}
//             id="password"
//             value={password}
//             onChange={onChangePassword}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     onClick={togglePasswordVisibility}
//                     edge="end"
//                   >
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <TextField
//             margin="normal"
//             fullWidth
//             label="Confirm Password"
//             type={showPassword ? 'text' : 'password'}
//             id="confirm-password"
//             value={confirmPassword}
//             onChange={onChangeConfirmPassword}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     onClick={togglePasswordVisibility}
//                     edge="end"
//                   >
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <Button
//             type="button"
//             fullWidth
//             variant="contained"
//             color="primary"
//             onClick={onSubmit}
//             sx={{ mt: 3, mb: 1 }}
//           >
//             Register
//           </Button>
//           <Typography
//             variant="body2"
//             sx={{ mt: 2, cursor: 'pointer', color: 'blue' }}
//             onClick={() => navigate('/login')}
//           >
//             Sudah punya akun? Login sekarang
//           </Typography>
//         </Box>
//       </Card>
//       <Box sx={{ textAlign: 'center' }}>
//         <Typography variant="h4" sx={{ mb: 8, mt: 3}}>
//           Selamat Datang di Pendaftaran!
//         </Typography>
//         <img src={ImageLogReg} alt="Register" width="400" />
//       </Box>
//     </Container>
//   );
// };

// export default Register;
