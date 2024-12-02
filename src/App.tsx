import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { CssBaseLine, ThemeProvider } from "@mui/material";
import ColorTheme from "./utils/ColorTheme";

const App = () =>  {

  return (
    <ThemeProvider theme={ColorTheme}>
      <CssBaseLine/>
      <RouterProvider router={router}  />
    </ThemeProvider>
  );
}

export default App;
