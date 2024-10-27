import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { ThemeProvider } from "@mui/material";
import ColorTheme from "./utils/colorTheme";
// import { Auth0Provider, useAuth0 } from "./auth0";
// import history from "./utils/history";

const App = () =>  {

  // const onRedirectCallback = (appState: any) => {
  //   history.push(
  //     appState && appState.targetUrl
  //       ? appState.targetUrl
  //       : window.location.pathname
  //   );
  // };

  // const {loading} = useAuth0();

  // if (loading) {
  //   return <CircularProgress/>
  // }


  return (
    <ThemeProvider theme={ColorTheme}>
      {/* <Auth0Provider
          domain={import.meta.env.VITE_AUTH0_DOMAIN}
          clientId={import.meta.env.VITE_AUTH0_CLIENT_ID || ""}
          audience={import.meta.env.VITE_AUTH0_AUDIENCE}
          redirectUri={import.meta.env.VITE_API_REDIRECT_URI}
          onRedirectCallback={onRedirectCallback}
        > */}

      <RouterProvider router={router}  />
        {/* </Auth0Provider> */}
    </ThemeProvider>
  );
}

export default App;
