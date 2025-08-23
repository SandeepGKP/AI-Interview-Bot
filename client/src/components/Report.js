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
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { useTranslation } from 'react-i18next';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Report = () => {
  const { t } = useTranslation();
  const { sessionId } = useParams();
  const location = useLocation();
  const [report, setReport] = useState(location.state?.report || null);
  const [loading, setLoading] = useState(!report);
  const [error, setError] = useState('');

  // Get video URLs from location state
  const { codingVideo, technicalVideo, hrVideo } = location.state || {};

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
      if (res.data) {
        setReport(res.data);
        console.log('Report fetched/generated successfully:', res.data.evaluation);
      } else {
        setError('Failed to get report: No data received.');
      }
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

  // Prepare data for Technical Skills Pie Chart
  const technicalSkillsData = {
    labels: Object.keys(report.skillsBreakdown.technical_skills || {}),
    datasets: [
      {
        label: t('technical_skills'),
        data: Object.values(report.skillsBreakdown.technical_skills || {}).map((value) =>
          parseInt(String(value).split('/')[0])
        ),
        backgroundColor: [
          '#63b3ed',
          '#90cdf4',
          '#4299e1',
          '#3182ce',
          '#2b6cb0',
        ],
      },
    ],
  };

  // Prepare data for Soft Skills Pie Chart
  const softSkillsData = {
    labels: Object.keys(report.skillsBreakdown.soft_skills || {}),
    datasets: [
      {
        label: t('soft_skills'),
        data: Object.values(report.skillsBreakdown.soft_skills || {}).map((value) =>
          parseInt(String(value).split('/')[0])
        ),
        backgroundColor: [
          '#f6ad55',
          '#ed8936',
          '#dd6b20',
          '#c05621',
          '#9c4221',
        ],
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

  // Prepare data for Bar Chart
  const allSkills = {
    ...(report.skillsBreakdown.technical_skills || {}),
    ...(report.skillsBreakdown.soft_skills || {}),
  };

  const barChartData = {
    labels: Object.keys(allSkills),
    datasets: [
      {
        label: t('skill_rating'),
        data: Object.values(allSkills).map((value) => parseInt(String(value).split('/')[0])),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: t('skill_ratings_overview'),
        color: '#fff', // White title for dark background
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          color: '#ccc', // Light grey ticks
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Light grid lines
        },
      },
      x: {
        ticks: {
          color: '#ccc', // Light grey ticks
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Light grid lines
        },
      },
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)', // Dark gradient background
        py: 4,
        color: '#e2e8f0', // Light text color for contrast
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#63b3ed', textAlign: 'center', mb: 5 }} // Blue heading
        >
          {t('candidate_evaluation_report')}
        </Typography>

        {/* Candidate Information */}
        <Paper elevation={6} sx={{ mb: 5, borderRadius: 4, p: 4, bgcolor: '#2d3748', color: '#e2e8f0' }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: 'bold', color: '#90cdf4', mb: 2, textAlign: 'center' }} // Lighter blue heading
          >
            {t('candidate_information')}
          </Typography>
          <Divider sx={{ mb: 3, bgcolor: '#4a5568' }} />
          <Table size="medium" sx={{ minWidth: 320 }}>
            <TableBody>
              <TableRow hover sx={{ '&:hover': { bgcolor: '#4a5568' } }}>
                <TableCell sx={{ fontWeight: 'bold', width: '40%', color: '#cbd5e0' }}>{t('candidate_name')}</TableCell>
                <TableCell sx={{ color: '#e2e8f0' }}>{report.candidateInfo?.candidateName || t('not_available_abbreviation')}</TableCell>
              </TableRow>
              <TableRow hover sx={{ '&:hover': { bgcolor: '#4a5568' } }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#cbd5e0' }}>{t('role_applied_for')}</TableCell>
                <TableCell sx={{ color: '#e2e8f0' }}>{report.candidateInfo?.roleTitle || t('not_available_abbreviation')}</TableCell>
              </TableRow>
              <TableRow hover sx={{ '&:hover': { bgcolor: '#4a5568' } }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#cbd5e0' }}>{t('interview_date')}</TableCell>
                <TableCell sx={{ color: '#e2e8f0' }}>
                  {report.candidateInfo?.interviewDate
                    ? new Date(report.candidateInfo.interviewDate).toLocaleString()
                    : t('not_available_abbreviation')}
                </TableCell>
              </TableRow>
              <TableRow hover sx={{ '&:hover': { bgcolor: '#4a5568' } }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#cbd5e0' }}>{t('total_questions_answered')}</TableCell>
                <TableCell sx={{ color: '#e2e8f0' }}>
                  {report.candidateInfo?.totalResponses || t('zero')} /{' '}
                  {report.candidateInfo?.totalQuestions || t('zero')}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>

        {/* Executive Summary */}
        <Paper elevation={6} sx={{ mb: 5, borderRadius: 4, p: 4, bgcolor: '#2d3748', color: '#e2e8f0' }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: 'bold', color: '#90cdf4', mb: 2, textAlign: 'center' }}
          >
            {t('executive_summary')}
          </Typography>
          <Divider sx={{ mb: 2, bgcolor: '#4a5568' }} />
          <Box sx={{ whiteSpace: 'pre-line', lineHeight: 1.7, px: 2, fontSize: '1rem' }}>
            {getSummary(report.evaluation)}
          </Box>
        </Paper>

        {/* Skills Breakdown with Visuals */}
        <Paper elevation={6} sx={{ mb: 5, borderRadius: 4, p: 4, bgcolor: '#2d3748', color: '#e2e8f0' }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: 'bold', color: '#90cdf4', mb: 3, textAlign: 'center' }}
          >
            {t('skills_breakdown')}
          </Typography>
          <Grid container spacing={4} justifyContent="center" alignItems="center">
            {/* Pie Charts */}
            {Object.keys(report.skillsBreakdown.technical_skills || {}).length > 0 && (
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h6"
                  align="center"
                  sx={{ mb: 2, fontWeight: 'bold', color: '#63b3ed' }}
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
                  sx={{ mb: 2, fontWeight: 'bold', color: '#63b3ed' }}
                >
                  {t('soft_skills')}
                </Typography>
                <Box sx={{ maxWidth: 350, mx: 'auto' }}>
                  <Pie data={softSkillsData} />
                </Box>
              </Grid>
            )}

            {/* Bar Graph for all skills */}
            {(Object.keys(report.skillsBreakdown.technical_skills || {}).length > 0 ||
              Object.keys(report.skillsBreakdown.soft_skills || {}).length > 0) && (
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    align="center"
                    sx={{ mt: 4, mb: 2, fontWeight: 'bold', color: '#63b3ed' }}
                  >
                    {t('overall_skill_ratings')}
                  </Typography>
                  <Box sx={{ maxWidth: 700, mx: 'auto', height: 400 }}>
                    <Bar data={barChartData} options={barChartOptions} />
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
                  sx={{ fontWeight: 'bold', color: '#90cdf4', textAlign: 'center' }}
                >
                  {t('skill_ratings_out_of_10')}
                </Typography>
                <Table
                  size="small"
                  sx={{ maxWidth: 600, mx: 'auto', border: '1px solid', borderColor: '#4a5568' }}
                >
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#4a5568' }}>
                      <TableCell sx={{ fontWeight: 'bold', color: '#e2e8f0' }}>{t('skill')}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#e2e8f0' }}>{t('rating')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(report.skillsBreakdown.technical_skills || {}).map(
                      ([skill, rating]) => (
                        <TableRow key={skill} hover sx={{ '&:hover': { bgcolor: '#4a5568' } }}>
                          <TableCell sx={{ color: '#e2e8f0' }}>{skill}</TableCell>
                          <TableCell sx={{ color: '#e2e8f0' }}>{rating}</TableCell>
                        </TableRow>
                      )
                    )}
                    {Object.entries(report.skillsBreakdown.soft_skills || {}).map(([skill, rating]) => (
                      <TableRow key={skill} hover sx={{ '&:hover': { bgcolor: '#4a5568' } }}>
                        <TableCell sx={{ color: '#e2e8f0' }}>{skill}</TableCell>
                        <TableCell sx={{ color: '#e2e8f0' }}>{rating}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
        </Paper>

        {/* Video Recordings */}
        {(codingVideo || technicalVideo || hrVideo) && (
          <Paper elevation={6} sx={{ mb: 5, borderRadius: 4, p: 4, bgcolor: '#2d3748', color: '#e2e8f0' }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: 'bold', color: '#90cdf4', mb: 3, textAlign: 'center' }}
            >
              {t('video_recordings')}
            </Typography>
            <Grid container spacing={3}>
              {codingVideo && (
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: '#4a5568', color: '#e2e8f0' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>{t('coding_round_video')}</Typography>
                      <video src={codingVideo} controls style={{ width: '100%', maxHeight: '200px' }} />
                    </CardContent>
                  </Card>
                </Grid>
              )}
              {technicalVideo && (
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: '#4a5568', color: '#e2e8f0' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>{t('technical_round_video')}</Typography>
                      <video src={technicalVideo} controls style={{ width: '100%', maxHeight: '200px' }} />
                    </CardContent>
                  </Card>
                </Grid>
              )}
              {hrVideo && (
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: '#4a5568', color: '#e2e8f0' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>{t('hr_round_video')}</Typography>
                      <video src={hrVideo} controls style={{ width: '100%', maxHeight: '200px' }} />
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Paper>
        )}

        {/* Detailed Evaluation */}
        <Paper elevation={6} sx={{ borderRadius: 4, p: 4, bgcolor: '#2d3748', color: '#e2e8f0' }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: 'bold', color: '#90cdf4', mb: 3, textAlign: 'center' }}
          >
            {t('detailed_evaluation')}
          </Typography>
          <Divider sx={{ mb: 2, bgcolor: '#4a5568' }} />
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
    </Box>
  );
};

export default Report;
