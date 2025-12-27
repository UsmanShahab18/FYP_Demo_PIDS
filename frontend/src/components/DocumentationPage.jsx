import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Grid  // ADD THIS LINE
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Download as DownloadIcon,
  Code as CodeIcon,
  Settings as SettingsIcon,
  PlayCircle as PlayCircleIcon,
  Help as HelpIcon,
  Book as BookIcon,
  Security as SecurityIcon,
  ArrowRight as ArrowRightIcon
} from '@mui/icons-material';

const DocumentationPage = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const installationSteps = [
    'Clone the repository from GitHub',
    'Install Python dependencies: pip install -r requirements.txt',
    'Set up PostgreSQL database',
    'Run database migrations: python manage.py migrate',
    'Start the Django server: python manage.py runserver',
    'Install Node.js dependencies: npm install',
    'Start the React development server: npm start',
    'Access the application at http://localhost:3000'
  ];

  const apiEndpoints = [
    { method: 'GET', endpoint: '/api/stats/', desc: 'Get system statistics' },
    { method: 'GET', endpoint: '/api/traffic/', desc: 'Get traffic logs' },
    { method: 'GET', endpoint: '/api/alerts/', desc: 'Get security alerts' },
    { method: 'POST', endpoint: '/api/clear-alerts/', desc: 'Clear all alerts' },
    { method: 'GET', endpoint: '/api/report/', desc: 'Download CSV report' },
    { method: 'WS', endpoint: '/ws/traffic/', desc: 'WebSocket for live traffic' },
  ];

  return (
    <Box sx={styles.page}>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        {/* Header */}
        <Box sx={styles.header}>
          <Typography variant="h2" component="h1" gutterBottom sx={styles.title}>
            <span className="glitch" data-text="Documentation">Documentation</span>
          </Typography>
          <Typography variant="h6" sx={styles.subtitle}>
            Complete Guide to CyberShield IDS
          </Typography>
        </Box>

        {/* Quick Navigation */}
        <Card sx={styles.card}>
          <CardContent>
            <Typography variant="h5" sx={styles.cardTitle} gutterBottom>
              <BookIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Quick Navigation
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {['Installation', 'Configuration', 'API Reference', 'Usage Guide', 'Troubleshooting'].map((item, index) => (
                <Chip
                  key={index}
                  label={item}
                  onClick={() => setTabValue(index)}
                  sx={{
                    bgcolor: tabValue === index ? 'rgba(0, 255, 0, 0.2)' : 'rgba(0, 30, 0, 0.5)',
                    color: '#00ff00',
                    border: '1px solid #00ff00',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(0, 255, 0, 0.1)',
                    }
                  }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card sx={{ ...styles.card, mt: 3 }}>
          <CardContent>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  color: '#99ff99',
                  '&.Mui-selected': {
                    color: '#00ff00',
                  }
                },
                '& .MuiTabs-indicator': {
                  bgcolor: '#00ff00'
                }
              }}
            >
              <Tab icon={<DownloadIcon />} label="Installation" />
              <Tab icon={<SettingsIcon />} label="Configuration" />
              <Tab icon={<CodeIcon />} label="API Reference" />
              <Tab icon={<PlayCircleIcon />} label="Usage Guide" />
              <Tab icon={<HelpIcon />} label="Troubleshooting" />
            </Tabs>

            {/* Installation Tab */}
            {tabValue === 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h5" sx={styles.cardTitle} gutterBottom>
                  Installation Guide
                </Typography>
                
                <Typography variant="h6" sx={{ color: '#00ff00', mt: 3, mb: 2 }}>
                  Prerequisites
                </Typography>
                <List>
                  {['Python 3.1 or higher', 'ReactJS 16 or higher', 'PostgreSQL 12 or higher', 'Git'].map((item, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <ArrowRightIcon sx={{ color: '#00ff00' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={item}
                        primaryTypographyProps={{ sx: styles.cardText }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Typography variant="h6" sx={{ color: '#00ff00', mt: 3, mb: 2 }}>
                  Step-by-Step Installation
                </Typography>
                <List>
                  {installationSteps.map((step, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Chip label={index + 1} size="small" sx={{ bgcolor: 'rgba(0, 255, 0, 0.2)', color: '#00ff00' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={step}
                        primaryTypographyProps={{ sx: styles.cardText }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Typography variant="h6" sx={{ color: '#00ff00', mt: 3, mb: 2 }}>
                  Quick Start Commands
                </Typography>
                <Paper sx={styles.codeBlock}>
                  <Typography sx={{ fontFamily: "'Share Tech Mono', monospace", color: '#00ff00' }}>
{`# Backend setup
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend setup
cd frontend
npm install
npm start`}
                  </Typography>
                </Paper>
              </Box>
            )}

            {/* Configuration Tab */}
            {tabValue === 1 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h5" sx={styles.cardTitle} gutterBottom>
                  Configuration
                </Typography>
                
                <Typography variant="h6" sx={{ color: '#00ff00', mt: 3, mb: 2 }}>
                  Environment Variables
                </Typography>
                <Paper sx={styles.codeBlock}>
                  <Typography sx={{ fontFamily: "'Share Tech Mono', monospace", color: '#00ff00' }}>
{`# Backend .env file
DATABASE_URL=postgresql://user:password@localhost:5432/cybershield
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Frontend .env file
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_WS_URL=ws://localhost:8000/ws`}
                  </Typography>
                </Paper>

                <Typography variant="h6" sx={{ color: '#00ff00', mt: 3, mb: 2 }}>
                  Database Configuration
                </Typography>
                <Typography sx={styles.cardText} paragraph>
                  Configure PostgreSQL database settings in the backend settings.py file:
                </Typography>
                <Paper sx={styles.codeBlock}>
                  <Typography sx={{ fontFamily: "'Share Tech Mono', monospace", color: '#00ff00' }}>
{`DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'cybershield',
        'USER': 'your_username',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}`}
                  </Typography>
                </Paper>
              </Box>
            )}

            {/* API Reference Tab */}
            {tabValue === 2 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h5" sx={styles.cardTitle} gutterBottom>
                  API Reference
                </Typography>
                
                <Typography variant="h6" sx={{ color: '#00ff00', mt: 3, mb: 2 }}>
                  Available Endpoints
                </Typography>
                <TableContainer component={Paper} sx={{ bgcolor: 'rgba(0, 30, 0, 0.3)', border: '1px solid #004400' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: '#99ff99', fontWeight: 'bold' }}>Method</TableCell>
                        <TableCell sx={{ color: '#99ff99', fontWeight: 'bold' }}>Endpoint</TableCell>
                        <TableCell sx={{ color: '#99ff99', fontWeight: 'bold' }}>Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {apiEndpoints.map((api, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Chip 
                              label={api.method}
                              size="small"
                              sx={{
                                bgcolor: 
                                  api.method === 'GET' ? 'rgba(0, 150, 255, 0.2)' :
                                  api.method === 'POST' ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 165, 0, 0.2)',
                                color: 
                                  api.method === 'GET' ? '#0096ff' :
                                  api.method === 'POST' ? '#00ff00' : '#ffa500',
                                fontWeight: 'bold'
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: '#99ff99', fontFamily: "'Share Tech Mono', monospace" }}>
                            {api.endpoint}
                          </TableCell>
                          <TableCell sx={{ color: '#99ff99' }}>{api.desc}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography variant="h6" sx={{ color: '#00ff00', mt: 3, mb: 2 }}>
                  Example API Request
                </Typography>
                <Paper sx={styles.codeBlock}>
                  <Typography sx={{ fontFamily: "'Share Tech Mono', monospace", color: '#00ff00' }}>
{`// JavaScript Fetch Example
fetch('http://localhost:8000/api/stats/')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Python Requests Example
import requests
response = requests.get('http://localhost:8000/api/stats/')
print(response.json())`}
                  </Typography>
                </Paper>
              </Box>
            )}

            {/* Usage Guide Tab */}
            {tabValue === 3 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h5" sx={styles.cardTitle} gutterBottom>
                  Usage Guide
                </Typography>
                
                <Accordion sx={{ bgcolor: 'rgba(0, 30, 0, 0.2)', border: '1px solid #004400', mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#00ff00' }} />}>
                    <Typography sx={{ color: '#00ff00', fontWeight: 'bold' }}>Dashboard Overview</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={styles.cardText}>
                      The dashboard provides real-time monitoring of network traffic. 
                      Key sections include statistics cards, traffic distribution charts, 
                      recent traffic table, and system alerts.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                
                <Accordion sx={{ bgcolor: 'rgba(0, 30, 0, 0.2)', border: '1px solid #004400', mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#00ff00' }} />}>
                    <Typography sx={{ color: '#00ff00', fontWeight: 'bold' }}>Traffic Monitoring</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={styles.cardText}>
                      Monitor all network traffic in real-time. Filter by status, protocol, 
                      or IP address. View detailed information about each network packet.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                
                <Accordion sx={{ bgcolor: 'rgba(0, 30, 0, 0.2)', border: '1px solid #004400', mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#00ff00' }} />}>
                    <Typography sx={{ color: '#00ff00', fontWeight: 'bold' }}>Alert Management</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={styles.cardText}>
                      Receive instant alerts for suspicious activities. Clear alerts when 
                      addressed. Configure alert thresholds and notification methods.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                
                <Accordion sx={{ bgcolor: 'rgba(0, 30, 0, 0.2)', border: '1px solid #004400' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#00ff00' }} />}>
                    <Typography sx={{ color: '#00ff00', fontWeight: 'bold' }}>Report Generation</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={styles.cardText}>
                      Generate detailed security reports in CSV format. Reports include 
                      traffic analysis, threat detection statistics, and system performance 
                      metrics.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}

            {/* Troubleshooting Tab */}
            {tabValue === 4 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h5" sx={styles.cardTitle} gutterBottom>
                  Support & Troubleshooting
                </Typography>
                
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid item xs={12} md={6}>
                    <Card sx={styles.card}>
                      <CardContent>
                        <Typography variant="h6" sx={{ color: '#00ff00', mb: 2 }}>
                          Common Issues
                        </Typography>
                        <List>
                          {[
                            'Port conflicts (check ports 3000 and 8000)',
                            'Database connection errors',
                            'CORS policy issues',
                            'WebSocket connection failures',
                            'Missing dependencies',
                            'Environment configuration errors'
                          ].map((issue, index) => (
                            <ListItem key={index} sx={{ py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                <Chip label="!" size="small" sx={{ bgcolor: 'rgba(255, 0, 0, 0.2)', color: '#ff0000' }} />
                              </ListItemIcon>
                              <ListItemText 
                                primary={issue}
                                primaryTypographyProps={{ sx: styles.cardText }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card sx={styles.card}>
                      <CardContent>
                        <Typography variant="h6" sx={{ color: '#00ff00', mb: 2 }}>
                          Getting Help
                        </Typography>
                        <List>
                          {[
                            'Check the troubleshooting guide',
                            'Review system logs for errors',
                            'Verify environment variables',
                            'Check network connectivity',
                            'Test API endpoints directly',
                            'Contact support team'
                          ].map((help, index) => (
                            <ListItem key={index} sx={{ py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                <Chip label="?" size="small" sx={{ bgcolor: 'rgba(0, 255, 0, 0.2)', color: '#00ff00' }} />
                              </ListItemIcon>
                              <ListItemText 
                                primary={help}
                                primaryTypographyProps={{ sx: styles.cardText }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Back to Dashboard */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <Box
              component="button"
              sx={styles.cyberButton}
            >
              <SecurityIcon sx={{ mr: 1 }} />
              Go to Dashboard
            </Box>
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #000000 0%, #001100 100%)',
    color: '#ffffff',
    fontFamily: "'Rajdhani', sans-serif"
  },
  header: {
    textAlign: 'center',
    mb: 5
  },
  title: {
    fontFamily: "'Orbitron', sans-serif",
    color: '#00ff00',
    textTransform: 'uppercase',
    mb: 2
  },
  subtitle: {
    color: '#00cc00',
    fontFamily: "'Share Tech Mono', monospace",
    opacity: 0.9
  },
  card: {
    bgcolor: 'rgba(0, 30, 0, 0.3)',
    border: '1px solid #004400',
    borderRadius: 2,
    transition: 'all 0.3s',
    '&:hover': {
      borderColor: '#00ff00',
      boxShadow: '0 0 20px rgba(0, 255, 0, 0.1)'
    }
  },
  cardTitle: {
    color: '#00ff00',
    fontFamily: "'Orbitron', sans-serif",
    fontWeight: 'bold'
  },
  cardText: {
    color: '#99ff99',
    lineHeight: 1.6
  },
  codeBlock: {
    bgcolor: '#001100',
    color: '#00ff00',
    p: 3,
    borderRadius: 1,
    border: '1px solid #00ff00',
    fontFamily: "'Share Tech Mono', monospace",
    overflowX: 'auto',
    mb: 3
  },
  cyberButton: {
    bgcolor: 'transparent',
    color: '#00ff00',
    border: '2px solid #00ff00',
    padding: '12px 30px',
    fontSize: '1.1rem',
    fontFamily: "'Orbitron', sans-serif",
    fontWeight: 'bold',
    textTransform: 'uppercase',
    cursor: 'pointer',
    borderRadius: '0',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    '&:hover': {
      bgcolor: 'rgba(0, 255, 0, 0.1)',
      boxShadow: '0 0 20px rgba(0, 255, 0, 0.5)',
      transform: 'translateY(-2px)'
    }
  }
};

export default DocumentationPage;