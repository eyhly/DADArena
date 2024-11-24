import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { ThemeProvider } from "@mui/material";
import ColorTheme from "@/utils/ColorTheme";

const App = () =>  {

  return (
    <ThemeProvider theme={ColorTheme}>
      <RouterProvider router={router}  />
    </ThemeProvider>
  );
}

export default App;
