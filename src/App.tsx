import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Dashboard from "./Pages/Dashboard";

// A simple theme to make sure fonts and basics look good
const theme = createTheme({
  palette: {
    background: {
      default: "#f8fafc", // matches the slate-50/slate-100 look
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kicksstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;
