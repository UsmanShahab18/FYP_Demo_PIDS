import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './components/Dashboard';
import TrafficTable from './components/TrafficTable';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage';
import DocumentationPage from './components/DocumentationPage';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff00',
    },
    secondary: {
      main: '#ff00ff',
    },
    background: {
      default: '#000000',
      paper: '#001100',
    },
  },
  typography: {
    fontFamily: '"Rajdhani", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Orbitron", sans-serif',
    },
    h2: {
      fontFamily: '"Orbitron", sans-serif',
    },
    h3: {
      fontFamily: '"Orbitron", sans-serif',
    },
    h4: {
      fontFamily: '"Orbitron", sans-serif',
    },
    h5: {
      fontFamily: '"Orbitron", sans-serif',
    },
    h6: {
      fontFamily: '"Orbitron", sans-serif',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/docs" element={<DocumentationPage />} />
          <Route path="/*" element={
            <>
              <Navbar />
              <div className="container-fluid p-0">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/traffic" element={<TrafficTable />} />
                </Routes>
              </div>
            </>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;