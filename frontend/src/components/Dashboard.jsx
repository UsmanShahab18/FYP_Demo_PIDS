import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, Paper, Typography, Grid, Card, CardContent,
  LinearProgress, Alert, Button, Chip, IconButton,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Tooltip
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Wifi as WifiIcon
} from '@mui/icons-material';

const API_BASE = 'http://localhost:8000/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_traffic: 0,
    attacks: 0,
    suspicious: 0,
    normal: 0,
    attack_percentage: 0
  });
  const [recentTraffic, setRecentTraffic] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchRecentTraffic();
    fetchAlerts();
    
    // Simple WebSocket connection
    const ws = new WebSocket('ws://localhost:8000/ws/traffic/');
    
    ws.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'update') {
          // Add new data to top of list
          setRecentTraffic(prev => [data.data, ...prev.slice(0, 9)]);
          fetchStats(); // Update counters
        }
      } catch (error) {
        console.error('WebSocket error:', error);
      }
    };
    
    ws.onerror = () => setIsConnected(false);
    ws.onclose = () => setIsConnected(false);
    
    return () => ws.close();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE}/stats/`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentTraffic = async () => {
    try {
      const response = await axios.get(`${API_BASE}/traffic/?limit=10`);
      setRecentTraffic(response.data);
    } catch (error) {
      console.error('Error fetching traffic:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/alerts/`);
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const clearAlerts = async () => {
    try {
      await axios.post(`${API_BASE}/clear-alerts/`);
      setAlerts([]);
    } catch (error) {
      console.error('Error clearing alerts:', error);
    }
  };

  const downloadReport = () => {
    window.open(`${API_BASE}/report/`, '_blank');
  };

  const refreshData = () => {
    fetchStats();
    fetchRecentTraffic();
    fetchAlerts();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Attack': return <ErrorIcon sx={{ color: '#ff0000' }} />;
      case 'Suspicious': return <WarningIcon sx={{ color: '#ffa500' }} />;
      case 'Normal': return <CheckCircleIcon sx={{ color: '#00ff00' }} />;
      default: return <CheckCircleIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Attack': return '#ff0000';
      case 'Suspicious': return '#ffa500';
      case 'Normal': return '#00ff00';
      default: return '#9e9e9e';
    }
  };

  // Calculate distribution percentages
  const total = stats.total_traffic || 1;
  const normalPercent = (stats.normal / total) * 100;
  const suspiciousPercent = (stats.suspicious / total) * 100;
  const attackPercent = (stats.attacks / total) * 100;

  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: '#000', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ color: '#00ff00', fontFamily: 'Orbitron' }}>
            CyberShield Dashboard
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#99ff99' }}>
            Real-time Network Intrusion Detection System
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Chip 
            icon={<WifiIcon />}
            label={isConnected ? "Connected" : "Disconnected"} 
            sx={{ 
              color: isConnected ? '#00ff00' : '#ff0000',
              borderColor: isConnected ? '#00ff00' : '#ff0000',
              bgcolor: isConnected ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)'
            }}
            variant="outlined"
          />
          <Tooltip title="Refresh Data">
            <IconButton onClick={refreshData} sx={{ color: '#00ff00' }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download Report">
            <IconButton onClick={downloadReport} sx={{ color: '#00ff00' }}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#001100', border: '1px solid #004400' }}>
            <CardContent>
              <Typography sx={{ color: '#99ff99' }} gutterBottom>
                Total Traffic
              </Typography>
              <Typography variant="h4" sx={{ color: '#00ff00', fontFamily: 'Orbitron' }}>
                {stats.total_traffic.toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ color: '#99ff99' }}>
                Packets Analyzed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: '#001100', 
            border: '1px solid #ff0000',
            borderLeft: '4px solid #ff0000'
          }}>
            <CardContent>
              <Typography sx={{ color: '#99ff99' }} gutterBottom>
                Attacks Detected
              </Typography>
              <Typography variant="h4" sx={{ color: '#ff0000', fontFamily: 'Orbitron' }}>
                {stats.attacks}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={attackPercent} 
                sx={{ 
                  mt: 1, 
                  height: 6, 
                  borderRadius: 3,
                  bgcolor: 'rgba(255, 0, 0, 0.2)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#ff0000'
                  }
                }}
              />
              <Typography variant="caption" sx={{ color: '#99ff99' }}>
                {attackPercent.toFixed(1)}% of total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: '#001100', 
            border: '1px solid #ffa500',
            borderLeft: '4px solid #ffa500'
          }}>
            <CardContent>
              <Typography sx={{ color: '#99ff99' }} gutterBottom>
                Suspicious Activity
              </Typography>
              <Typography variant="h4" sx={{ color: '#ffa500', fontFamily: 'Orbitron' }}>
                {stats.suspicious}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={suspiciousPercent} 
                sx={{ 
                  mt: 1, 
                  height: 6, 
                  borderRadius: 3,
                  bgcolor: 'rgba(255, 165, 0, 0.2)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#ffa500'
                  }
                }}
              />
              <Typography variant="caption" sx={{ color: '#99ff99' }}>
                {suspiciousPercent.toFixed(1)}% of total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: '#001100', 
            border: '1px solid #00ff00',
            borderLeft: '4px solid #00ff00'
          }}>
            <CardContent>
              <Typography sx={{ color: '#99ff99' }} gutterBottom>
                Normal Traffic
              </Typography>
              <Typography variant="h4" sx={{ color: '#00ff00', fontFamily: 'Orbitron' }}>
                {stats.normal}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={normalPercent} 
                sx={{ 
                  mt: 1, 
                  height: 6, 
                  borderRadius: 3,
                  bgcolor: 'rgba(0, 255, 0, 0.2)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#00ff00'
                  }
                }}
              />
              <Typography variant="caption" sx={{ color: '#99ff99' }}>
                {normalPercent.toFixed(1)}% of total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Distribution Bar */}
      <Paper sx={{ p: 2, mb: 4, bgcolor: '#001100', border: '1px solid #004400' }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#00ff00', fontFamily: 'Orbitron' }}>
          Traffic Distribution
        </Typography>
        <Box sx={{ display: 'flex', height: 40, borderRadius: 1, overflow: 'hidden' }}>
          {/* Normal Section */}
          <Box 
            sx={{ 
              width: `${normalPercent}%`, 
              bgcolor: '#00ff00',
              display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}
          >
            {normalPercent > 10 && (
              <Typography variant="caption" sx={{ color: '#000', fontWeight: 'bold' }}>
                {normalPercent.toFixed(1)}%
              </Typography>
            )}
          </Box>

          {/* Suspicious Section */}
          <Box 
            sx={{ 
              width: `${suspiciousPercent}%`, 
              bgcolor: '#ffa500', 
              display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}
          >
            {suspiciousPercent > 10 && (
              <Typography variant="caption" sx={{ color: '#000', fontWeight: 'bold' }}>
                {suspiciousPercent.toFixed(1)}%
              </Typography>
            )}
          </Box>

          {/* Attack Section */}
          <Box 
            sx={{ 
              width: `${attackPercent}%`, 
              bgcolor: '#ff0000',
              display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}
          >
            {attackPercent > 10 && (
              <Typography variant="caption" sx={{ color: '#fff', fontWeight: 'bold' }}>
                {attackPercent.toFixed(1)}%
              </Typography>
            )}
          </Box>
        </Box>
        
        {/* Legend */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Chip label={`Normal: ${stats.normal}`} size="small" sx={{ bgcolor: '#00ff00', color: '#000', fontWeight: 'bold' }} />
          <Chip label={`Suspicious: ${stats.suspicious}`} size="small" sx={{ bgcolor: '#ffa500', color: '#000', fontWeight: 'bold' }} />
          <Chip label={`Attacks: ${stats.attacks}`} size="small" sx={{ bgcolor: '#ff0000', color: '#fff', fontWeight: 'bold' }} />
        </Box>
      </Paper>

      {/* Recent Traffic Table */}
      <Paper sx={{ p: 2, mb: 4, bgcolor: '#001100', border: '1px solid #004400' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#00ff00', fontFamily: 'Orbitron' }}>
            Recent Traffic
          </Typography>
          <Chip 
            label={`${recentTraffic.length} entries`} 
            size="small" 
            sx={{ color: '#00ff00', borderColor: '#00ff00', bgcolor: 'rgba(0, 255, 0, 0.1)' }}
            variant="outlined"
          />
        </Box>
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#99ff99' }}>Time</TableCell>
                <TableCell sx={{ color: '#99ff99' }}>Source IP</TableCell>
                <TableCell sx={{ color: '#99ff99' }}>Destination IP</TableCell>
                <TableCell sx={{ color: '#99ff99' }}>Dst Port</TableCell> {/* NEW COLUMN */}
                <TableCell sx={{ color: '#99ff99' }}>Protocol</TableCell>
                <TableCell sx={{ color: '#99ff99' }}>Status</TableCell>
                <TableCell sx={{ color: '#99ff99' }}>Prediction</TableCell>
                <TableCell align="right" sx={{ color: '#99ff99' }}>Confidence</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentTraffic.slice(0, 10).map((traffic, index) => (
                <TableRow 
                  key={index}
                  sx={{ 
                    bgcolor: traffic.status === 'Attack' ? 'rgba(255, 0, 0, 0.08)' : 
                             traffic.status === 'Suspicious' ? 'rgba(255, 165, 0, 0.08)' : 
                             'transparent'
                  }}
                >
                  <TableCell sx={{ color: '#99ff99' }}>
                    {traffic.timestamp ? traffic.timestamp.split(' ')[1] : '--:--:--'}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={traffic.src_ip || 'Unknown'} 
                      size="small" 
                      sx={{ color: '#00ff00', borderColor: '#00ff00', bgcolor: 'transparent' }}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={traffic.dst_ip || 'Unknown'} 
                      size="small" 
                      sx={{ color: '#00ff00', borderColor: '#00ff00', bgcolor: 'transparent' }}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#99ff99' }}>
                    {traffic.dst_port || '-'} 
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={traffic.protocol || 'Unknown'} 
                      size="small"
                      sx={{ 
                        color: traffic.protocol === 'TCP' ? '#0096ff' : traffic.protocol === 'UDP' ? '#ff00ff' : '#00ff00',
                        borderColor: traffic.protocol === 'TCP' ? '#0096ff' : traffic.protocol === 'UDP' ? '#ff00ff' : '#00ff00'
                      }}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getStatusIcon(traffic.status)}
                      <Typography sx={{ color: '#99ff99' }}>
                        {traffic.status || 'Unknown'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={traffic.prediction || 'Unknown'} 
                      size="small"
                      sx={{ 
                        bgcolor: getStatusColor(traffic.status),
                        color: '#000',
                        fontWeight: 'bold'
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography sx={{ color: '#99ff99', fontWeight: 'bold' }}>
                      {traffic.confidence ? `${(traffic.confidence * 100).toFixed(1)}%` : 'N/A'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Alerts Section */}
      <Paper sx={{ p: 2, bgcolor: '#001100', border: '1px solid #004400' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#00ff00', fontFamily: 'Orbitron' }}>
            System Alerts
          </Typography>
          {alerts.length > 0 && (
            <Button
              startIcon={<DeleteIcon />}
              onClick={clearAlerts}
              variant="outlined"
              sx={{ color: '#ff0000', borderColor: '#ff0000' }}
              size="small"
            >
              Clear All ({alerts.length})
            </Button>
          )}
        </Box>
        
        {alerts.length > 0 ? (
          alerts.slice(0, 5).map((alert, index) => (
            <Alert 
              key={index}
              severity={alert.severity === 'HIGH' ? 'error' : alert.severity === 'MEDIUM' ? 'warning' : 'info'}
              sx={{ 
                mb: 1,
                bgcolor: alert.severity === 'HIGH' ? 'rgba(255, 0, 0, 0.1)' : 
                         alert.severity === 'MEDIUM' ? 'rgba(255, 165, 0, 0.1)' : 
                         'rgba(0, 255, 0, 0.1)',
                color: '#99ff99',
                border: '1px solid',
                borderColor: alert.severity === 'HIGH' ? '#ff0000' : 
                             alert.severity === 'MEDIUM' ? '#ffa500' : '#00ff00'
              }}
            >
              {alert.message}
            </Alert>
          ))
        ) : (
          <Alert 
            severity="success"
            sx={{ bgcolor: 'rgba(0, 255, 0, 0.1)', color: '#99ff99', border: '1px solid #00ff00' }}
          >
            No active alerts. System is running normally.
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;