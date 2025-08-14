// client/src/components/Report.js
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Divider,
  CircularProgress,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Grid,
  Paper,
} from '@mui/material';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTranslation } from 'react-i18next';

ChartJS.register(ArcElement, Tooltip, Legend);

const Report = () => {
  const { t } = useTranslation();
  const { sessionId } = useParams();
  const location = useLocation();
  const [report, setReport] = useState(location.state?.report || null);
  const [loading, setLoading] = useState(!report);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!report) {
      generateOrFetchReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const generateOrFetchReport = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`https://ai-interview-bot-backend.onrender.com/api/generate-report/${sessionId}`, {});
      setReport(res.data);
    } catch (err) {
      console.error('Error fetching/generating report:', err);
      setError(err.response?.data?.error || 'Failed to get report.');
    } finally {
      setLoading(false);
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
        <Typography color="error" align="center" variant="h6">
          {t(error)}
        </Typography>
      </Container>
    );
  }

  if (!report) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography align="center" variant="h6">
          {t('no_report_available')}
        </Typography>
      </Container>
    );
  }

  const technicalSkillsData = {
    labels: Object.keys(report.skillsBreakdown.technical_skills || {}),
    datasets: [
      {
        label: 'Technical Skills',
        data: Object.values(report.skillsBreakdown.technical_skills || {}).map((value) =>
          parseInt(value.split('/')[0])
        ),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const softSkillsData = {
    labels: Object.keys(report.skillsBreakdown.soft_skills || {}),
    datasets: [
      {
        label: 'Soft Skills',
        data: Object.values(report.skillsBreakdown.soft_skills || {}).map((value) =>
          parseInt(value.split('/')[0])
        ),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const getSummary = (evaluation) => {
    const summary = evaluation.split('Strengths:')[0];
    return summary;
  };

  const removeJsonFromString = (text) => {
    const lastBraceIndex = text.lastIndexOf('{');
    const lastBracketIndex = text.lastIndexOf('[');

    let jsonStartIndex = -1;
    if (lastBraceIndex > lastBracketIndex) {
      jsonStartIndex = lastBraceIndex;
    } else {
      jsonStartIndex = lastBracketIndex;
    }

    if (jsonStartIndex !== -1) {
      const potentialJson = text.substring(jsonStartIndex);
      try {
        JSON.parse(potentialJson);
        // If parsing is successful, it's JSON, so return the text before it
        return text.substring(0, jsonStartIndex).trim();
      } catch (e) {
        // Not valid JSON, so keep the text
      }
    }
    return text;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center', mb: 5 }}
      >
        {t('candidate_evaluation_report')}
      </Typography>

      {/* Candidate Information */}
      <Paper elevation={4} sx={{ mb: 5, borderRadius: 3, p: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'primary.dark', mb: 2, textAlign: 'center' }}
        >
          {t('candidate_information')}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Table size="medium" sx={{ minWidth: 320 }}>
          <TableBody>
            <TableRow hover>
              <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>{t('candidate_name')}</TableCell>
              <TableCell>{report.candidateInfo?.candidateName || t('not_available_abbreviation')}</TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('role_applied_for')}</TableCell>
              <TableCell>{report.candidateInfo?.roleTitle || t('not_available_abbreviation')}</TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('interview_date')}</TableCell>
              <TableCell>
                {report.candidateInfo?.interviewDate
                  ? new Date(report.candidateInfo.interviewDate).toLocaleString()
                  : t('not_available_abbreviation')}
              </TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('total_questions_answered')}</TableCell>
              <TableCell>
                {report.candidateInfo?.totalResponses || t('zero')} /{' '}
                {report.candidateInfo?.totalQuestions || t('zero')}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>

      {/* Executive Summary */}
      <Paper elevation={4} sx={{ mb: 5, borderRadius: 3, p: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'primary.dark', mb: 2, textAlign: 'center' }}
        >
          {t('executive_summary')}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ whiteSpace: 'pre-line', lineHeight: 1.7, px: 2, fontSize: '1rem' }}>
          {getSummary(report.evaluation)}
        </Box>
      </Paper>

      {/* Skills Breakdown with Visuals */}
      <Paper elevation={4} sx={{ mb: 5, borderRadius: 3, p: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'primary.dark', mb: 3, textAlign: 'center' }}
        >
          {t('skills_breakdown')}
        </Typography>
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          {Object.keys(report.skillsBreakdown.technical_skills || {}).length > 0 && (
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                align="center"
                sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}
              >
                {t('technical_skills')}
              </Typography>
              <Box sx={{ maxWidth: 350, mx: 'auto' }}>
                <Pie data={technicalSkillsData} />
              </Box>
            </Grid>
          )}
          {Object.keys(report.skillsBreakdown.soft_skills || {}).length > 0 && (
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                align="center"
                sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}
              >
                {t('soft_skills')}
              </Typography>
              <Box sx={{ maxWidth: 350, mx: 'auto' }}>
                <Pie data={softSkillsData} />
              </Box>
            </Grid>
          )}

          {/* No skills available */}
          {Object.keys(report.skillsBreakdown.technical_skills || {}).length === 0 &&
            Object.keys(report.skillsBreakdown.soft_skills || {}).length === 0 && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" align="center">
                  {t('no_specific_skill_breakdown')}
                </Typography>
              </Grid>
            )}
        </Grid>

        {/* Skill Ratings Table */}
        {(Object.keys(report.skillsBreakdown.technical_skills || {}).length > 0 ||
          Object.keys(report.skillsBreakdown.soft_skills || {}).length > 0) && (
          <Box sx={{ mt: 5 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 'bold', color: 'primary.dark', textAlign: 'center' }}
            >
              {t('skill_ratings_out_of_10')}
            </Typography>
            <Table
              size="small"
              sx={{ maxWidth: 600, mx: 'auto', border: '1px solid', borderColor: 'divider' }}
            >
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.light' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>{t('skill')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{t('rating')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(report.skillsBreakdown.technical_skills || {}).map(
                  ([skill, rating]) => (
                    <TableRow key={skill} hover>
                      <TableCell>{skill}</TableCell>
                      <TableCell>{rating}</TableCell>
                    </TableRow>
                  )
                )}
                {Object.entries(report.skillsBreakdown.soft_skills || {}).map(([skill, rating]) => (
                  <TableRow key={skill} hover>
                    <TableCell>{skill}</TableCell>
                    <TableCell>{rating}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>

      {/* Detailed Evaluation */}
      <Paper elevation={4} sx={{ borderRadius: 3, p: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'primary.dark', mb: 3, textAlign: 'center' }}
        >
          {t('detailed_evaluation')}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box
          sx={{
            whiteSpace: 'pre-line',
            lineHeight: 1.7,
            fontSize: '1rem',
            maxHeight: 300,
            overflowY: 'auto',
            px: 2,
          }}
        >
          {removeJsonFromString(report.evaluation)}
        </Box>
      </Paper>
    </Container>
  );
};

export default Report;
