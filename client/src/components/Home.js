import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Paper
} from '@mui/material';
import { PlayArrow, Work, Psychology, Assessment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const fetchIntroduction = async (roleTitle, roleDescription) => {
  try {
    const response = await axios.post('https://ai-interview-bot-backend.onrender.com/api/generate-groq-introduction', {
      roleTitle,
      roleDescription,
    });
    return response.data.introduction;
  } catch (error) {
    console.error('Error fetching introduction:', error);
    return '- Thank you for joining us.\n- 5-7 questions on communication skills, agile experience, customer focus.\n- Excited to learn about your qualifications.';
  }
};

const Home = () => {
  const { t } = useTranslation();
  const [candidateName, setCandidateName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showIntro, setShowIntro] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const navigate = useNavigate();

  const handleStartInterview = async () => {
    if (!candidateName.trim() || !roleTitle.trim() || !roleDescription.trim()) {
      setError('Please fill in candidate name, role title, and description');
      return;
    }

    setLoading(true);
    setError('');
    setIntroduction('');
    setTotalQuestions(0);
    setShowIntro(false);
    setSessionId(null);

    try {
      const response = await axios.post('https://ai-interview-bot-backend.onrender.com/api/generate-interview', {
        candidateName: candidateName.trim(),
        roleTitle: roleTitle.trim(),
        roleDescription: roleDescription.trim()
      });

      const { sessionId, introduction, questions } = response.data;

      setIntroduction(introduction);
      setTotalQuestions(questions.length);
      setSessionId(sessionId);
      setShowIntro(true);
    } catch (err) {
      console.error('Error creating interview:', err);
      setError(err.response?.data?.error || 'Failed to create interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const proceedToInterview = () => {
    if (sessionId) {
      navigate(`/interview/${sessionId}`);
    }
  };

  const sampleRoles = [
    {
      title: 'Frontend Developer',
      description:
        'We are looking for a skilled Frontend Developer with experience in React, JavaScript, and modern web technologies. The candidate should have strong problem-solving skills and experience with responsive design.'
    },
    {
      title: 'Data Scientist',
      description:
        'Seeking a Data Scientist with expertise in Python, machine learning, and statistical analysis. Experience with TensorFlow, pandas, and data visualization tools is preferred.'
    },
    {
      title: 'Product Manager',
      description:
        'Looking for an experienced Product Manager to lead product strategy and development. Strong communication skills, experience with agile methodologies, and customer-focused mindset required.'
    }
  ];

  const fillSampleRole = (role) => {
    setRoleTitle(role.title);
    setRoleDescription(role.description);
  };

  const features = [
    {
      icon: <Work color="primary" sx={{ fontSize: 48, mb: 1 }} />,
      title: '1. Define Role',
      desc: 'Enter candidate name, job title and detailed description'
    },
    {
      icon: <Psychology color="primary" sx={{ fontSize: 48, mb: 1 }} />,
      title: '2. AI Questions',
      desc: 'AI generates personalized interview questions'
    },
    {
      icon: <PlayArrow color="primary" sx={{ fontSize: 48, mb: 1 }} />,
      title: '3. Video Interview',
      desc: 'Candidates record video responses'
    },
    {
      icon: <Assessment color="primary" sx={{ fontSize: 48, mb: 1 }} />,
      title: '4. AI Evaluation',
      desc: 'Get detailed performance analysis'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" gutterBottom color="primary.dark" sx={{ fontWeight: 'bold' }}>
          {t('welcome')}
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: 700, mx: 'auto' }}>
          {t('home_description')}
        </Typography>
      </Box>

      {/* Features Overview */}
      <Card sx={{ mb: 5, width: '100%', backgroundColor: '#f5f5f5', p: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom color="primary" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
            {t('how_it_works')}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              justifyContent: 'center',
              mt: 2
            }}
          >
            {features.map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  flex: '1 1 220px',
                  minWidth: 220,
                  maxWidth: 250,
                  px: 2,
                  py: 4,
                  borderRadius: 3,
                  bgcolor: 'white',
                  boxShadow: 3,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 6
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}
              >
                {item.icon}
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                  {t(item.title)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t(item.desc)}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Create New Interview */}
      <Card sx={{ width: '100%', mb: 5, bgcolor: '#f5f5f5', p: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom color="primary" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
            {t('create_new_interview')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {t(error)}
            </Alert>
          )}

          <Box component="form" sx={{ mt: 2 ,display: 'flex' ,justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <TextField
              fullWidth
              label={t('candidate_name_label')}
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder={t('candidate_name_placeholder')}
              sx={{ mb: 3, bgcolor: 'white', borderRadius: 1 }}
              disabled={loading || showIntro}
            />

            <TextField
              fullWidth
              label={t('job_title_label')}
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder={t('job_title_placeholder')}
              sx={{ mb: 3, bgcolor: 'white', borderRadius: 1 }}
              disabled={loading || showIntro}
            />

            <TextField
              fullWidth
              multiline
              rows={6}
              label={t('role_description_label')}
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              placeholder={t('role_description_placeholder')}
              sx={{ mb: 3, bgcolor: 'white', borderRadius: 1 }}
              disabled={loading || showIntro}
            />

            <Button
              variant="contained"
              size="large"
              onClick={handleStartInterview}
              disabled={
                loading ||
                !candidateName.trim() ||
                !roleTitle.trim() ||
                !roleDescription.trim() ||
                showIntro
              }
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PlayArrow />}
              // fullWidth

              sx={{ py: 1.5, fontWeight: 'bold' }}
            >
              {loading ? t('generating_interview') : t('start_ai_interview')}
            </Button>
          </Box>

          {showIntro && (
            <Paper
              elevation={5}
              sx={{
                mt: 4,
                p: 3,
                bgcolor: '#bbdefb',
                borderRadius: 2,
                border: 1,
                borderColor: 'primary.main',
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {t('welcome_ai_interview')}
              </Typography>
              <Typography variant="body2" color="text.primary" gutterBottom>
                {t('best_of_luck', { candidateName: candidateName })}
              </Typography>
              <Button variant="contained" size="small" onClick={proceedToInterview} sx={{ mt: 2, fontWeight: 'bold' }}>
                {t('proceed_to_interview')}
              </Button>
            </Paper>
          )}
        </CardContent>
      </Card>

      {/* Quick Start Examples */}
      <Card sx={{ width: '100%', mb: 5, bgcolor: 'white', p: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            {t('quick_start')}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {t('try_sample_roles')}
          </Typography>

          {sampleRoles.map((role, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Chip
                label={t(role.title.toLowerCase().replace(/\s/g, '_'))}
                onClick={() => fillSampleRole(role)}
                color="primary"
                variant="outlined"
                sx={{
                  fontWeight: 700,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'blue'
                  }
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {t(role.description.substring(0, 100).toLowerCase().replace(/\s/g, ' '))}...
              </Typography>
              {index < sampleRoles.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </CardContent>
      </Card>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {t('ai_questions_note')}
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;
