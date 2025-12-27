import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Box, Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination,
  Chip, LinearProgress, IconButton, Tooltip, TextField,
  FormControl, InputLabel, Select, MenuItem, Button
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

const API_BASE = 'http://localhost:8000/api';

const TrafficTable = () => {
  const [trafficLogs, setTrafficLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterProtocol, setFilterProtocol] = useState('');
  const [searchIp, setSearchIp] = useState('');

  const fetchTrafficLogs = useCallback(async () => {
    try {
      setLoading(true);
      let url = `${API_BASE}/traffic/?limit=${rowsPerPage * 2}`;
      
      if (filterStatus) {
        url += `&status=${filterStatus}`;
      }
      
      const response = await axios.get(url);
      setTrafficLogs(response.data);
    } catch (error) {
      console.error('Error fetching traffic logs:', error);
    } finally {
      setLoading(false);
    }
  }, [rowsPerPage, filterStatus]);

  useEffect(() => {
    fetchTrafficLogs();
  }, [fetchTrafficLogs, page, filterProtocol]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const clearFilters = () => {
    setFilterStatus('');
    setFilterProtocol('');
    setSearchIp('');
  };

  const downloadCSV = () => {
    window.open(`${API_BASE}/report/`, '_blank');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Attack': return <ErrorIcon sx={{ color: '#ff0000' }} />;
      case 'Suspicious': return <WarningIcon sx={{ color: '#ffa500' }} />;
      case 'Normal': return <CheckCircleIcon sx={{ color: '#00ff00' }} />;
      default: return <CheckCircleIcon />;
    }
  };

  // Filter logs based on search
  const filteredLogs = trafficLogs.filter(log => {
    if (searchIp) {
      return log.src_ip?.includes(searchIp) || log.dst_ip?.includes(searchIp);
    }
    if (filterProtocol && log.protocol !== filterProtocol) {
      return false;
    }
    return true;
  });

  // Paginate filtered logs
  const paginatedLogs = filteredLogs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: '#000', minHeight: '100vh' }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#001100', border: '1px solid #004400' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" gutterBottom sx={{ color: '#00ff00', fontFamily: 'Orbitron' }}>
              Network Traffic Logs
            </Typography>
            <Typography variant="body2" sx={{ color: '#99ff99' }}>
              Real-time monitoring of all network traffic with ML-based intrusion detection
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Refresh">
              <IconButton onClick={fetchTrafficLogs} sx={{ color: '#00ff00' }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Download CSV">
              <IconButton onClick={downloadCSV} sx={{ color: '#00ff00' }}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            label="Search IP Address"
            variant="outlined"
            size="small"
            value={searchIp}
            onChange={(e) => setSearchIp(e.target.value)}
            sx={{ 
              width: 200,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#00ff00' },
                '&:hover fieldset': { borderColor: '#00ff00' },
                '&.Mui-focused fieldset': { borderColor: '#00ff00' }
              },
              '& .MuiInputLabel-root': { color: '#99ff99' },
              '& .MuiInputBase-input': { color: '#99ff99' }
            }}
          />
          
          <FormControl size="small" sx={{ width: 150 }}>
            <InputLabel sx={{ color: '#99ff99' }}>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{
                color: '#99ff99',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#00ff00' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00ff00' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00ff00' }
              }}
            >
              <MenuItem value="" sx={{ color: '#000' }}>All Status</MenuItem>
              <MenuItem value="Normal" sx={{ color: '#000' }}>Normal</MenuItem>
              <MenuItem value="Suspicious" sx={{ color: '#000' }}>Suspicious</MenuItem>
              <MenuItem value="Attack" sx={{ color: '#000' }}>Attack</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ width: 150 }}>
            <InputLabel sx={{ color: '#99ff99' }}>Protocol</InputLabel>
            <Select
              value={filterProtocol}
              label="Protocol"
              onChange={(e) => setFilterProtocol(e.target.value)}
              sx={{
                color: '#99ff99',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#00ff00' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00ff00' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00ff00' }
              }}
            >
              <MenuItem value="" sx={{ color: '#000' }}>All Protocols</MenuItem>
              <MenuItem value="TCP" sx={{ color: '#000' }}>TCP</MenuItem>
              <MenuItem value="UDP" sx={{ color: '#000' }}>UDP</MenuItem>
              <MenuItem value="ICMP" sx={{ color: '#000' }}>ICMP</MenuItem>
              <MenuItem value="OTHER" sx={{ color: '#000' }}>Other</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={clearFilters}
            sx={{
              color: '#00ff00',
              borderColor: '#00ff00',
              '&:hover': {
                borderColor: '#00ff00',
                bgcolor: 'rgba(0, 255, 0, 0.1)'
              }
            }}
          >
            Clear Filters
          </Button>
        </Box>

        {loading ? (
          <LinearProgress 
            sx={{ 
              bgcolor: 'rgba(0, 255, 0, 0.2)',
              '& .MuiLinearProgress-bar': { bgcolor: '#00ff00' }
            }}
          />
        ) : (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#99ff99' }}>Timestamp</TableCell>
                    <TableCell sx={{ color: '#99ff99' }}>Source IP</TableCell>
                    <TableCell sx={{ color: '#99ff99' }}>Destination IP</TableCell>
                    <TableCell sx={{ color: '#99ff99' }}>Dst Port</TableCell>
                    <TableCell sx={{ color: '#99ff99' }}>Protocol</TableCell>
                    <TableCell sx={{ color: '#99ff99' }}>Status</TableCell>
                    <TableCell sx={{ color: '#99ff99' }}>Prediction</TableCell>
                    <TableCell sx={{ color: '#99ff99' }}>Confidence</TableCell>
                    <TableCell align="right" sx={{ color: '#99ff99' }}>Length</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedLogs.map((log, index) => (
                    <TableRow 
                      key={index}
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        bgcolor: log.status === 'Attack' ? 'rgba(255, 0, 0, 0.08)' : 
                               log.status === 'Suspicious' ? 'rgba(255, 165, 0, 0.08)' : 
                               'transparent',
                        '&:hover': {
                          bgcolor: log.status === 'Attack' ? 'rgba(255, 0, 0, 0.15)' : 
                                   log.status === 'Suspicious' ? 'rgba(255, 165, 0, 0.15)' : 
                                   'rgba(0, 255, 0, 0.05)'
                        }
                      }}
                    >
                      <TableCell sx={{ color: '#99ff99' }}>
                        <Typography variant="caption">
                          {log.timestamp ? log.timestamp.split(' ')[1] : '--:--:--'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={log.src_ip || 'Unknown'} 
                          size="small" 
                          sx={{ 
                            color: '#00ff00',
                            borderColor: '#00ff00',
                            bgcolor: 'transparent'
                          }}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={log.dst_ip || 'Unknown'} 
                          size="small" 
                          sx={{ 
                            color: '#00ff00',
                            borderColor: '#00ff00',
                            bgcolor: 'transparent'
                          }}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#99ff99' }}>
                        <Typography variant="body2">
                          {/* Fix: Check if undefined, otherwise show port (even if 0) */}
                          {log.dst_port !== undefined && log.dst_port !== null ? log.dst_port : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={log.protocol || 'Unknown'} 
                          size="small"
                          sx={{ 
                            bgcolor: log.protocol === 'TCP' ? 'rgba(0, 150, 255, 0.2)' : 
                                     log.protocol === 'UDP' ? 'rgba(255, 0, 255, 0.2)' : 
                                     'rgba(0, 255, 0, 0.2)',
                            color: log.protocol === 'TCP' ? '#0096ff' : 
                                   log.protocol === 'UDP' ? '#ff00ff' : '#00ff00',
                            borderColor: log.protocol === 'TCP' ? '#0096ff' : 
                                         log.protocol === 'UDP' ? '#ff00ff' : '#00ff00'
                          }}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getStatusIcon(log.status)}
                          <Chip 
                            label={log.status || 'Unknown'} 
                            size="small"
                            sx={{ 
                              bgcolor: log.status === 'Attack' ? 'rgba(255, 0, 0, 0.2)' : 
                                       log.status === 'Suspicious' ? 'rgba(255, 165, 0, 0.2)' : 
                                       'rgba(0, 255, 0, 0.2)',
                              color: log.status === 'Attack' ? '#ff0000' : 
                                     log.status === 'Suspicious' ? '#ffa500' : '#00ff00',
                              borderColor: log.status === 'Attack' ? '#ff0000' : 
                                           log.status === 'Suspicious' ? '#ffa500' : '#00ff00'
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#99ff99' }}>
                        <Typography variant="body2">
                          {log.prediction || 'Unknown'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={(log.confidence || 0) * 100} 
                            sx={{ 
                              flexGrow: 1,
                              height: 6,
                              borderRadius: 3,
                              bgcolor: 'rgba(0, 255, 0, 0.2)',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: (log.confidence || 0) > 0.6 ? '#ff0000' : 
                                         (log.confidence || 0) > 0.4 ? '#ffa500' : '#00ff00'
                              }
                            }}
                          />
                          <Typography variant="caption" sx={{ minWidth: 40, color: '#99ff99' }}>
                            {((log.confidence || 0) * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ color: '#99ff99' }}>
                        <Typography variant="body2">
                          {(log.length || 0).toLocaleString()} B
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredLogs.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ 
                color: '#99ff99',
                '& .MuiTablePagination-selectIcon': { color: '#00ff00' },
                '& .MuiSvgIcon-root': { color: '#00ff00' }
              }}
            />
          </>
        )}
      </Paper>
    </Box>
  );
};

export default TrafficTable;