// client/src/components/RecruiterDashboard.js
import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Box,
  TextField,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Collapse,
  TableSortLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleIcon from '@mui/icons-material/People';
import EventNoteIcon from '@mui/icons-material/EventNote';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { CSVLink } from 'react-csv';
import { blue } from '@mui/material/colors';

const POLL_INTERVAL_MS = 30000; // 30 seconds

const RecruiterDashboard = () => {
  const { t } = useTranslation();
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);
  const navigate = useNavigate();
  const mountedRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;
    fetchCandidates();
    startPolling();

    return () => {
      mountedRef.current = false;
      stopPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startPolling = () => {
    stopPolling();
    timerRef.current = setInterval(() => {
      fetchCandidates(false); // silent refresh
    }, POLL_INTERVAL_MS);
  };

  const stopPolling = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const fetchCandidates = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
      setError('');
    }

    try {
      const response = await axios.get('https://ai-interview-bot-backend.onrender.com/api/candidates');
      if (!mountedRef.current) return;

      const normalized = (response.data || []).map((c) => ({
        ...c,
        date: c.date ? new Date(c.date) : null,
        name: c.name,
      }));

      setCandidates(normalized);
      setError('');
    } catch (err) {
      console.error('Error fetching candidates:', err);
      if (!mountedRef.current) return;
      setError('Failed to load candidates. Please try again later.');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const viewDetails = (candidateId, round) => {
    navigate(`/report/${candidateId}?round=${round}`);
  };

  const handleDeleteClick = (candidate) => {
    setCandidateToDelete(candidate);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCandidateToDelete(null);
  };

  const confirmDelete = async () => {
    if (!candidateToDelete) return;

    setLoading(true);
    setError('');
    try {
      await axios.delete(`https://ai-interview-bot-backend.onrender.com/api/candidates/${candidateToDelete.id}`);
      if (mountedRef.current) {
        setCandidates(prev => prev.filter(c => c.id !== candidateToDelete.id));
        handleCloseDeleteDialog();
        setError('');
      }
      toast.success(t('Candidate Deleted Successfully'));
    } catch (err) {
      console.error('Error deleting candidate:', err);
      if (mountedRef.current) {
        setError('Failed to delete candidate. Please try again.');
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openRow, setOpenRow] = useState(null);

  const sortedCandidates = React.useMemo(() => {
    let sortableCandidates = [...candidates];
    if (sortConfig.key) {
      sortableCandidates.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableCandidates;
  }, [candidates, sortConfig]);

  const filteredCandidates = sortedCandidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          candidate.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || candidate.status === filterStatus;
    const matchesRole = filterRole === 'all' || candidate.role === filterRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const totalCandidates = candidates.length;
  const interviewsScheduled = candidates.filter(c => c.status === 'active').length;
  const pendingReviews = candidates.filter(c => c.status === 'pending').length; // Assuming 'pending' status for review
  const hiredCandidates = candidates.filter(c => c.status === 'hired').length; // Assuming 'hired' status

  const csvData = filteredCandidates.map(candidate => ({
    'Candidate Name': candidate.name,
    'Role': candidate.role,
    'Interview Date': candidate.date ? candidate.date.toLocaleString() : '—',
    'Status': candidate.status,
  }));

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ flex: 1, minWidth: 200, borderRadius: 2, boxShadow: 3, backgroundColor: color || '#e3f2fd' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" color="textSecondary" gutterBottom>{title}</Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>{value}</Typography>
        </Box>
        {icon}
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ToastContainer />
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{t('Dashboard')}</Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            sx={{ mr: 1, borderRadius: 2 }}
            onClick={() => navigate('/interview')} // Assuming a route for adding a new candidate
          >
            {t('add_new_candidate')}
          </Button>
          <Button variant="outlined" size="small" sx={{ mr: 1, borderRadius: 2 }} onClick={() => fetchCandidates(true)} disabled={loading}>
            {t('refresh')}
          </Button>
          <Button variant="outlined" size="small" sx={{ mr: 1, borderRadius: 2 ,backgroundColor:blue}} >
          <CSVLink data={csvData} filename={"candidates-dashboard.csv"} className="MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedSizeSmall MuiButton-sizeSmall MuiButton-root MuiButton-outlined MuiButton-outlinedSizeSmall MuiButton-sizeSmall css-1k0122-MuiButtonBase-root-MuiButton-root" target="_blank">
            {t('export_csv')}
          </CSVLink>
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <StatCard
          title={t('total_candidates')}
          value={totalCandidates}
          icon={<PeopleIcon sx={{ fontSize: 40, color: '#1976d2' }} />}
          color="#e3f2fd"
        />
        <StatCard
          title={t('interviews_scheduled')}
          value={interviewsScheduled}
          icon={<EventNoteIcon sx={{ fontSize: 40, color: '#ff9800' }} />}
          color="#fff3e0"
        />
        <StatCard
          title={t('pending_reviews')}
          value={pendingReviews}
          icon={<HourglassEmptyIcon sx={{ fontSize: 40, color: '#ba68c8' }} />}
          color="#f3e5f5"
        />
        <StatCard
          title={t('hired_candidates')}
          value={hiredCandidates}
          icon={<CheckCircleOutlineIcon sx={{ fontSize: 40, color: '#4caf50' }} />}
          color="#e8f5e9"
        />
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {t(error)}
        </Typography>
      )}

      <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              sx={{ flex: 1, minWidth: 200 }}
              label={t('search_by_name_or_role')}
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FormControl variant="outlined" sx={{ minWidth: 150 }}>
              <InputLabel>{t('filter_by_status')}</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label={t('filter_by_status')}
              >
                <MenuItem value="all">{t('all_statuses')}</MenuItem>
                <MenuItem value="active">{t('active')}</MenuItem>
                <MenuItem value="completed">{t('completed')}</MenuItem>
                {/* Add other statuses as needed */}
              </Select>
            </FormControl>
            <FormControl variant="outlined" sx={{ minWidth: 150 }}>
              <InputLabel>{t('filter_by_role')}</InputLabel>
              <Select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                label={t('filter_by_role')}
              >
                <MenuItem value="all">{t('all_roles')}</MenuItem>
                {/* Dynamically generate roles from candidates or a predefined list */}
                {[...new Set(candidates.map(c => c.role))].map(role => (
                  <MenuItem key={role} value={role}>{role}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={6}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell />
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      <TableSortLabel
                        active={sortConfig.key === 'name'}
                        direction={sortConfig.direction}
                        onClick={() => requestSort('name')}
                      >
                        {t('candidate_name')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      <TableSortLabel
                        active={sortConfig.key === 'role'}
                        direction={sortConfig.direction}
                        onClick={() => requestSort('role')}
                      >
                        {t('role')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      <TableSortLabel
                        active={sortConfig.key === 'date'}
                        direction={sortConfig.direction}
                        onClick={() => requestSort('date')}
                      >
                        {t('interview_date')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      <TableSortLabel
                        active={sortConfig.key === 'status'}
                        direction={sortConfig.direction}
                        onClick={() => requestSort('status')}
                      >
                        {t('status')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>{t('actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCandidates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        {t('no_interviews_found')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCandidates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((candidate) => (
                      <React.Fragment key={candidate.id}>
                        <TableRow sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                          <TableCell>
                            <IconButton size="small" onClick={() => setOpenRow(openRow === candidate.id ? null : candidate.id)}>
                              {openRow === candidate.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                          </TableCell>
                          <TableCell>{candidate.name === 'Unknown Candidate' ? '' : candidate.name}</TableCell>
                          <TableCell>{candidate.role}</TableCell>
                          <TableCell>{candidate.date ? candidate.date.toLocaleString() : '—'}</TableCell>
                          <TableCell>
                            <Chip label={t(candidate.status)} color={candidate.status === 'active' ? 'primary' : 'default'} size="small" />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton color="error" onClick={() => handleDeleteClick(candidate)} aria-label={t('delete_button_label')}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                            <Collapse in={openRow === candidate.id} timeout="auto" unmountOnExit>
                              <Box margin={2}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                  {t('Interview Rounds')}
                                </Typography>
                                <Table size="small">
                                  <TableBody>
                                    {candidate.codingRoundSubmitted && (
                                      <TableRow>
                                        <TableCell>{t('Coding Assessment')}</TableCell>
                                        <TableCell align="right">
                                          <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => viewDetails(candidate.id, 'coding')}
                                          >
                                            {t('view_details')}
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    )}
                                    {candidate.technicalRoundSubmitted && (
                                      <TableRow>
                                        <TableCell>{t('Technical Round')}</TableCell>
                                        <TableCell align="right">
                                          <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => viewDetails(candidate.id, 'technical')}
                                          >
                                            {t('view_details')}
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    )}
                                    {candidate.hrRoundSubmitted && (
                                      <TableRow>
                                        <TableCell>{t('HR Round')}</TableCell>
                                        <TableCell align="right">
                                          <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => viewDetails(candidate.id, 'hr')}
                                          >
                                            {t('view_details')}
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))
                  )}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredCandidates.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t('confirm_delete')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('delete_candidate_confirmation', { candidateName: candidateToDelete?.name })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            {t('cancel')}
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            {t('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RecruiterDashboard;
