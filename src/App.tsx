import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { ThemeProvider } from "@mui/material";
import ColorTheme from "./utils/colorTheme";

const App = () =>  {

  return (
    <ThemeProvider theme={ColorTheme}>
      <RouterProvider router={router}  />
    </ThemeProvider>
  );
}

export default App;
