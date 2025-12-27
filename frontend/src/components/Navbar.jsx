import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box,
  Chip, IconButton, Tooltip, Badge
} from '@mui/material';
import {
  Security as SecurityIcon,
  Dashboard as DashboardIcon,
  ListAlt as ListIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Description as DocsIcon,
  WifiTethering as WifiIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Traffic Logs', icon: <ListIcon />, path: '/traffic' },
    { text: 'About', icon: <InfoIcon />, path: '/about' },
    { text: 'Docs', icon: <DocsIcon />, path: '/docs' },
  ];

  return (
    <AppBar position="static" sx={{ bgcolor: '#001100', borderBottom: '1px solid #00ff00' }}>
      <Toolbar>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 3, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <SecurityIcon sx={{ mr: 1, color: '#00ff00' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#00ff00' }}>
            CyberShield IDS
          </Typography>
        </Box>

        {/* Navigation */}
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          {menuItems.map((item) => (
            <Button
              key={item.text}
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                mx: 1,
                color: location.pathname === item.path ? '#00ff00' : '#99ff99',
                backgroundColor: location.pathname === item.path ? 'rgba(0, 255, 0, 0.1)' : 'transparent',
                border: location.pathname === item.path ? '1px solid #00ff00' : '1px solid transparent',
                '&:hover': {
                  backgroundColor: 'rgba(0, 255, 0, 0.15)',
                  border: '1px solid #00ff00',
                }
              }}
            >
              {item.text}
            </Button>
          ))}
        </Box>

        {/* Status Indicators */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Live Monitoring Active">
            <Chip 
              icon={<WifiIcon />}
              label="LIVE"
              size="small"
              sx={{ 
                color: '#00ff00',
                borderColor: '#00ff00',
                bgcolor: 'rgba(0, 255, 0, 0.1)'
              }}
              variant="outlined"
            />
          </Tooltip>
          
          <Tooltip title="System Status">
            <Chip 
              label="ACTIVE"
              size="small"
              sx={{ 
                color: '#00ff00',
                bgcolor: 'rgba(0, 255, 0, 0.2)',
                fontWeight: 'bold'
              }}
            />
          </Tooltip>
          
          <Tooltip title="Notifications">
            <IconButton 
              sx={{ 
                color: '#00ff00',
                '&:hover': { bgcolor: 'rgba(0, 255, 0, 0.1)' }
              }}
              size="small"
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Home Button */}
          <Tooltip title="Go to Home">
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              sx={{
                color: '#00ff00',
                borderColor: '#00ff00',
                '&:hover': {
                  borderColor: '#00ff00',
                  bgcolor: 'rgba(0, 255, 0, 0.1)'
                }
              }}
            >
              Home
            </Button>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;