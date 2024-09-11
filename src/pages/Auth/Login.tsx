import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  ThemeProvider,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useLogin } from "../../services/mutation";
import Logo from "../../../public/img/logo.png";
import ColorTheme from "../../utils/ColorTheme";
import Lottie from 'lottie-react'
import Log from '../../../public/img/login.json'
// import LoginButton from "./LoginButton";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(0);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const loginMutation = useLogin();
  const navigate = useNavigate();

  const onSubmit = async () => {
    try {
      const result = await loginMutation.mutateAsync({
        email: email,
        password: password,
        token: "",
        role: role,
      });

      const data = result;
      localStorage.setItem("token", data.token);
      setRole(data.role);

      Swal.fire({
        icon: "success",
        title: "Login successfully",
        text: "Welcome Back!",
        confirmButtonText: "Ok",
      }).then((result) => {
        if (result.isConfirmed) {
          if (data.role === 1) {
            navigate("/dashboard-admin");
          } else if (data.role === 2) {
            navigate("/dashboard-official");
          } else if (data.role === 3) {
            navigate("/dashboard-captain");
          }
        }
      });
    } catch (error: any) {
      if (error.message.includes("No account found")) {
        Swal.fire({
          icon: "warning",
          title: "Account not found",
          text: "Don't have an account? Register now",
          confirmButtonText: "Register",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/register");
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: error.toString(),
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/");
          }
        });
      }
    }
  };

  return (
    <ThemeProvider theme={ColorTheme}>
      <Container
        sx={{
          display: "flex",
          marginX: 30,
        }}
      >
        <Card
          sx={{
            mt: 15,
            width: 400,
            height: 500,
            padding: 3,
            borderRadius: 3,
            boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            marginRight: 20,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <img src={Logo} alt="Logo" width="100" />
            <Typography
              component="h1"
              variant="h5"
              sx={{ marginTop: 3, marginBottom: 2 }}
            >
              Welcome Back!
            </Typography>
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Email Address"
              value={email}
              onChange={onChangeEmail}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={onChangePassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {/* <LoginButton/> */}
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              onClick={onSubmit}
              sx={{ mt: 3, mb: 1 }}
            >
              Login
            </Button>
            <Typography variant="body2">
              Don't have an account?{" "}
              <Typography
                variant="body2"
                component="span"
                sx={{
                  cursor: "pointer",
                  color: ColorTheme.palette.primary.main,
                  textDecoration: "underline",
                }}
                onClick={() => navigate("/register")}
              >
                Register now!
              </Typography>
            </Typography>
          </Box>
        </Card>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" sx={{ mb: 5, mt: 3 }}>
            Welcome Back To DAD Sports League!
          </Typography>
          <Lottie animationData={Log} /> 
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
