// client/src/components/CandidateDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const CandidateDetails = () => {
  const { t } = useTranslation();
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidateId]);

  const fetchSession = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`http://localhost:5000/api/session/${candidateId}`);
      setSession(res.data);
    } catch (err) {
      console.error('Error loading session:', err);
      setError('Failed to load session.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!session) return;
    setReportLoading(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/generate-report/${session.id}`, {});
      // backend returns report JSON — navigate to report page with session id
      navigate(`/report/${session.id}`, { state: { report: res.data } });
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err.response?.data?.error || 'Failed to generate report.');
    } finally {
      setReportLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 6 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">{t(error)}</Alert>
      </Container>
    );
  }

  if (!session) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="info">{t('no_session_found')}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center', mb: 4 }}>
        {t('candidate_details_title')}
      </Typography>

      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.dark' }}>{t('candidate_information')}</Typography>
          <Divider sx={{ mb: 2 }} />
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>{t('candidate_name_label')}:</TableCell>
                <TableCell>{session.candidateName || t('unknown_candidate')}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>{t('role_applied_for')}:</TableCell>
                <TableCell>{session.roleTitle}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
            {t('questions_responses')}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {session.questions && session.questions.length > 0 ? (
            <List>
              {session.questions.map((q, idx) => {
                const resp = session.responses.find(r => r.questionIndex === idx);
                return (
                  <Box key={idx} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor: '#f9f9f9' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Q{idx + 1}: {q}
                    </Typography>
                    {resp ? (
                      <Box sx={{ width: '100%', mt: 1 }}>
                        <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>
                          {t('answer')}: "{resp.transcription}"
                        </Typography>
                        {resp.videoFilename && (
                          <video
                            src={`http://localhost:5000/uploads/${resp.videoFilename}`}
                            controls
                            style={{ width: '100%', borderRadius: '8px', backgroundColor: 'black' }}
                          />
                        )}
                      </Box>
                    ) : (
                      <Typography component="span" variant="body2" color="text.secondary">
                        {t('no_response_yet')}
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </List>
          ) : (
            <Typography variant="body1" color="text.secondary">{t('no_questions_found')}</Typography>
          )}
        </CardContent>
      </Card>

      <Box display="flex" gap={2} justifyContent="center" sx={{ mt: 4 }}>
        <Button variant="contained" color="primary" onClick={handleGenerateReport} disabled={reportLoading} sx={{ borderRadius: 2, py: 1.5, px: 3 }}>
          {reportLoading ? t('generating_report') : t('generate_report')}
        </Button>
        <Button variant="outlined" onClick={() => navigate('/recruiter')} sx={{ borderRadius: 2, py: 1.5, px: 3 }}>
          {t('back_to_dashboard')}
        </Button>
      </Box>
    </Container>
  );
};

export default CandidateDetails;
