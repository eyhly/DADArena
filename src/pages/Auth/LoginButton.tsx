import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, Container, ThemeProvider } from "@mui/material";
import ColorTheme from "../../utils/ColorTheme";

const LoginButton = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect(); 
    }
  }, [isAuthenticated, loginWithRedirect]);

  return (
    <ThemeProvider theme={ColorTheme}>
      <Container sx={{ mx: 10 }}>
        {isAuthenticated ? (
          <>
            <Button
              type="button" 
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 1 }}
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            >
              Log out
            </Button>
            <h2>Welcome beb</h2>
          </>
        ) : (
          <h2>Redirecting to login...</h2>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default LoginButton;
