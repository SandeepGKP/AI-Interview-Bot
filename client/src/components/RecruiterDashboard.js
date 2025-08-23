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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

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
  const [openRow, setOpenRow] = useState(null);

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ToastContainer />
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{t('Dashboard')}</Typography>
        <Box>
          <Button variant="outlined" size="small" sx={{ mr: 1, borderRadius: 2 }} onClick={() => fetchCandidates(true)} disabled={loading}>
            {t('refresh')}
          </Button>
        </Box>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {t(error)}
        </Typography>
      )}

      <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label={t('search_by_name_or_role')}
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('candidate_name')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('role')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('interview_date')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('status')}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>{t('actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCandidates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        {t('no_interviews_found')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCandidates.map((candidate) => (
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
