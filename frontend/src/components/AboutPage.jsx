import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Grid,
  Chip
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Security as SecurityIcon,
  Memory as MemoryIcon,
  FlashOn as FlashIcon,
  ShowChart as ChartIcon,
  Verified as VerifiedIcon,
  WorkspacePremium as PremiumIcon,
  TrendingUp as TrendingUpIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Storage as StorageIcon,
  Cloud as CloudIcon,
  Dataset as DatasetIcon
} from '@mui/icons-material';

const AboutPage = () => {
  const features = [
    { icon: <MemoryIcon />, title: 'AI Threat Detection', desc: 'Machine learning algorithms analyze network patterns to identify anomalies and potential threats.' },
    { icon: <FlashIcon />, title: 'Real-time Monitoring', desc: 'Live traffic analysis with instant alerts for suspicious activities and potential attacks.' },
    { icon: <ChartIcon />, title: 'Detailed Analytics', desc: 'Comprehensive reports and visualizations to understand your network security posture.' },
    { icon: <VerifiedIcon />, title: 'Multi-layer Security', desc: 'Multiple detection layers for comprehensive protection against various attack vectors.' },
    { icon: <HistoryIcon />, title: 'Historical Analysis', desc: 'Track and analyze historical data to identify patterns and improve threat detection.' },
    { icon: <TrendingUpIcon />, title: 'Performance Metrics', desc: 'Detailed performance and threat analysis with actionable insights.' },
  ];

  const technologies = [
    'React.js & Material-UI',
    'Python Django',
    'Machine Learning',
    'WebSocket',
    'REST API',
    'Packet Analysis',
    'Real-time Processing',
    'Data Visualization',
    'PostgreSQL',
    'Scikit-learn'
  ];

  const benefits = [
    { type: 'Enhanced Security', desc: 'Proactive threat detection reduces security breaches by up to 95%', color: 'success' },
    { type: 'Improved Efficiency', desc: 'Automated monitoring reduces manual security checks by 80%', color: 'info' },
    { type: 'Cost Effective', desc: 'Reduces security operation costs by minimizing false positives', color: 'warning' },
    { type: 'Real-time Protection', desc: 'Instant detection and response to security incidents', color: 'error' },
  ];

  return (
    <Box sx={styles.page}>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        {/* Header */}
        <Box sx={styles.header}>
          <Typography variant="h2" component="h1" gutterBottom sx={styles.title}>
            <span className="glitch" data-text="About CyberShield IDS">About CyberShield IDS</span>
          </Typography>
          <Typography variant="h6" sx={styles.subtitle}>
            Advanced Network Intrusion Detection System Powered by Machine Learning
          </Typography>
        </Box>

        {/* Overview */}
        <Card sx={styles.card}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SecurityIcon sx={{ mr: 2, color: '#00ff00', fontSize: 40 }} />
              <Typography variant="h5" sx={styles.cardTitle}>
                Project Overview
              </Typography>
            </Box>
            <Typography sx={styles.cardText}>
              CyberShield IDS is a cutting-edge network security solution designed to protect 
              your digital infrastructure from modern cyber threats. By leveraging advanced 
              machine learning algorithms and real-time monitoring capabilities, our system 
              provides unparalleled security for networks of all sizes.
            </Typography>
            <Typography sx={{ ...styles.cardText, mt: 2 }}>
              The system continuously analyzes network traffic patterns, detects anomalies, 
              identifies potential attacks, and provides instant alerts to security personnel. 
              With a user-friendly interface and powerful analytics tools, CyberShield IDS 
              makes network security management efficient and effective.
            </Typography>
          </CardContent>
        </Card>

        {/* Features */}
        <Typography variant="h4" sx={{ ...styles.cardTitle, mt: 5, mb: 3, textAlign: 'center' }}>
          <PremiumIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Key Features
        </Typography>
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={styles.featureCard}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={styles.featureIcon}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={styles.featureTitle}>
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography sx={styles.cardText}>
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Technologies & Architecture */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} md={6}>
            <Card sx={styles.card}>
              <CardContent>
                <Typography variant="h5" sx={styles.cardTitle} gutterBottom>
                  <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Technologies Used
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  {technologies.map((tech, index) => (
                    <Chip
                      key={index}
                      label={tech}
                      sx={{
                        bgcolor: 'rgba(0, 30, 0, 0.5)',
                        color: '#00ff00',
                        border: '1px solid #00ff00',
                        '&:hover': {
                          bgcolor: 'rgba(0, 255, 0, 0.1)',
                        }
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={styles.card}>
              <CardContent>
                <Typography variant="h5" sx={styles.cardTitle} gutterBottom>
                  <DatasetIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  System Architecture
                </Typography>
                <List>
                  {[
                    'Frontend: React.js with Material-UI & Bootstrap',
                    'Backend: Python Django with REST API',
                    'Database: PostgreSQL for data storage',
                    'Real-time: WebSocket for live updates',
                    'ML Models: Scikit-learn for threat detection',
                    'Deployment: Docker containers for scalability'
                  ].map((item, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: '#00ff00' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={item}
                        primaryTypographyProps={{ sx: styles.cardText }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Benefits */}
        <Typography variant="h4" sx={{ ...styles.cardTitle, mb: 3, textAlign: 'center' }}>
          Benefits
        </Typography>
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Alert 
                severity={benefit.color}
                sx={{
                  bgcolor: `rgba(0, 30, 0, 0.3)`,
                  border: '1px solid',
                  borderColor: 
                    benefit.color === 'success' ? '#00ff00' :
                    benefit.color === 'info' ? '#0096ff' :
                    benefit.color === 'warning' ? '#ffa500' : '#ff0000',
                  '& .MuiAlert-icon': { 
                    color: 
                      benefit.color === 'success' ? '#00ff00' :
                      benefit.color === 'info' ? '#0096ff' :
                      benefit.color === 'warning' ? '#ffa500' : '#ff0000'
                  }
                }}
              >
                <Typography variant="h6" sx={{ color: '#ffffff', mb: 1 }}>
                  {benefit.type}
                </Typography>
                <Typography sx={{ color: '#99ff99' }}>
                  {benefit.desc}
                </Typography>
              </Alert>
            </Grid>
          ))}
        </Grid>

        {/* CTA */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Link to="/dashboard">
            <Box
              component="button"
              sx={styles.cyberButton}
            >
              <SecurityIcon sx={{ mr: 1 }} />
              Launch Dashboard
            </Box>
          </Link>
          <Link to="/" style={{ textDecoration: 'none', marginLeft: '16px' }}>
            <Box
              component="button"
              sx={styles.outlineButton}
            >
              Back to Home
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
  featureCard: {
    bgcolor: 'rgba(0, 30, 0, 0.2)',
    border: '1px solid #003300',
    borderRadius: 2,
    height: '100%',
    transition: 'all 0.3s',
    '&:hover': {
      borderColor: '#00ff00',
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 30px rgba(0, 255, 0, 0.1)'
    }
  },
  cardTitle: {
    color: '#00ff00',
    fontFamily: "'Orbitron', sans-serif",
    fontWeight: 'bold'
  },
  featureTitle: {
    color: '#00ff00',
    fontFamily: "'Orbitron', sans-serif",
    fontWeight: 'bold'
  },
  cardText: {
    color: '#99ff99',
    lineHeight: 1.6
  },
  featureIcon: {
    bgcolor: 'rgba(0, 255, 0, 0.1)',
    color: '#00ff00',
    borderRadius: '50%',
    p: 1,
    mr: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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
    },
    '&:active': {
      transform: 'translateY(0)'
    }
  },
  outlineButton: {
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
      boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)',
      transform: 'translateY(-2px)'
    }
  }
};

export default AboutPage;