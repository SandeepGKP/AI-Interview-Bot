import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Grid,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  Refresh,
  Send,
  CheckCircle,
  Videocam,
  Mic,
  NavigateNext,
  NavigateBefore,
  Replay
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import {ToastContainer, toast} from 'react-toastify';

const fetchIntroduction = async (roleTitle, roleDescription, t) => {
  try {
    const response = await axios.post('https://ai-interview-bot-backend.onrender.com/api/generate-groq-introduction', {
      roleTitle,
      roleDescription,
    });
    return response.data.introduction;
  } catch (error) {
    console.error('Error fetching introduction:', error);
    return t('default_interview_introduction_fallback');
  }
};

const Interview = () => {
  const { t } = useTranslation();
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [session, setSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState('');
  const [showIntroduction, setShowIntroduction] = useState(true);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  
  // Refs
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  // Load session data
  useEffect(() => {
    const loadSession = async () => {
      let introduction = t('default_session_introduction');
      try {
        const response = await axios.get(`https://ai-interview-bot-backend.onrender.com/api/session/${sessionId}`);
        introduction = await fetchIntroduction(response.data.roleTitle, response.data.roleDescription, t);
        setSession({ ...response.data, introduction });
        setResponses(new Array(response.data.questions.length).fill(null));
      } catch (err) {
        console.error('Error loading session:', err);
        setError('Interview session not found. Please check your link.');
      }
    };

    if (sessionId) {
      loadSession();
    }
  }, [sessionId]);

  // Request camera and microphone permissions
  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setPermissionsGranted(true);
      setError('');
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setError('Camera and microphone access is required for the interview. Please grant permissions and try again.');
    }
  };

  // Start recording
  const startRecording = () => {
    if (!streamRef.current) {
      setError('Please grant camera and microphone permissions first.');
      return;
    }

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm;codecs=vp9'
      });
      
      const chunks = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordedBlob(blob);
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setError('');
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to start recording. Please try again.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Upload response
  const uploadResponse = async () => {
    if (!recordedBlob) {
      setError('No recording found. Please record your response first.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('video', recordedBlob, `response-${currentQuestionIndex}.webm`);

      const response = await axios.post(
        `https://ai-interview-bot-backend.onrender.com/api/upload-response/${sessionId}/${currentQuestionIndex}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast.success(t('Response Uploaded Successfully'));
      setTranscription(response.data.transcription);
      
      const newResponses = [...responses];
      newResponses[currentQuestionIndex] = {
        transcription: response.data.transcription,
        recorded: true
      };
      setResponses(newResponses);
      setRecordedBlob(null);
      
    } catch (err) {
      console.error('Error uploading response:', err);
      setError(err.response?.data?.error || 'Failed to upload response. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Navigate to next question
  const nextQuestion = () => {
    if (currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTranscription('');
      setRecordedBlob(null);
    } else {
      setShowCompletionDialog(true);
    }
  };

  // Navigate to previous question
  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setTranscription('');
      setRecordedBlob(null);
    }
  };

  // Complete interview
  const completeInterview = () => {
    navigate(`/report/${sessionId}`);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      window.speechSynthesis.cancel(); // Stop speech on unmount
    };
  }, []);

  // Speak introduction slowly
  useEffect(() => {
    if (session?.introduction && showIntroduction) {
      const utterance = new SpeechSynthesisUtterance(session.introduction);
      utterance.rate = 0.85; // slow speech
      utterance.pitch = 1;
      utterance.lang = i18n.language === 'es' ? 'es-ES' : i18n.language === 'fr' ? 'fr-FR' : i18n.language === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }, [session, showIntroduction, i18n.language]);

  if (!session) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box textAlign="center">
          <Typography variant="h5">{t('loading_interview')}</Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {t(error)}
            </Alert>
          )}
        </Box>
      </Container>
    );
  }

  // Introduction screen
  if (showIntroduction) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom color="primary" textAlign="center" sx={{ fontWeight: 'bold' }}>
              {t('welcome_to_your_interview')}
            </Typography>
            
            <Typography variant="h6" gutterBottom textAlign="center" sx={{ mb: 2 }}>
              {t('position')}: {session.roleTitle}
            </Typography>
            
            <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
              <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                {session.introduction}
              </Typography>
            </Paper>

            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Chip label={t('num_questions', { count: session.questions.length })} color="primary" variant="outlined" />
                </Grid>
                <Grid item>
                  <Chip label={t('ai_powered_evaluation')} color="secondary" variant="outlined" />
                </Grid>
              </Grid>
            </Box>

            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              <Typography variant="body2">
                <strong>{t('before_we_begin')}:</strong>
                <br />• {t('ensure_quiet_environment')}
                <br />• {t('check_camera_microphone')}
                <br />• {t('take_time_responses')}
                <br />• {t('re_record_any_answer')}
              </Typography>
            </Alert>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {t(error)}
              </Alert>
            )}

            <Box textAlign="center">
              {!permissionsGranted ? (
                <Button
                  variant="contained"
                  size="large"
                  onClick={requestPermissions}
                  startIcon={<Videocam />}
                  sx={{ mr: 2, borderRadius: 2 }}
                >
                  {t('grant_camera_microphone_access')}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    window.speechSynthesis.cancel();
                    setShowIntroduction(false);
                  }}
                  startIcon={<PlayArrow />}
                  sx={{ borderRadius: 2 }}
                >
                  {t('start_interview')}
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  const progress = ((currentQuestionIndex + 1) / session.questions.length) * 100;
  const currentResponse = responses[currentQuestionIndex];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ToastContainer/>
      {/* Progress Bar */}
      <Box sx={{ mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="body2" color="text.secondary">
            {t('question_of', { current: currentQuestionIndex + 1, total: session.questions.length })}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {Math.round(progress)}% {t('complete')}
          </Typography>
        </Box>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
      </Box>

      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
            {t('interview_session_title')}
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('question')}: {session.questions[currentQuestionIndex]}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <video ref={videoRef} autoPlay muted style={{ width: '100%', maxWidth: '640px', borderRadius: '8px', backgroundColor: 'black' }} />
          </Box>

          <Box display="flex" justifyContent="center" gap={2} mb={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={isRecording ? stopRecording : startRecording}
              startIcon={isRecording ? <Stop /> : <Mic />}
              disabled={isUploading}
              sx={{ borderRadius: 2, py: 1.5, px: 3 }}
            >
              {isRecording ? t('stop_recording') : t('start_recording')}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setRecordedBlob(null);
                setTranscription('');
              }}
              startIcon={<Replay />}
              disabled={isRecording || isUploading}
              sx={{ borderRadius: 2, py: 1.5, px: 3 }}
            >
              {t('clear_recording')}
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={uploadResponse}
              startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <Send />}
              disabled={!recordedBlob || isRecording || isUploading}
              sx={{ borderRadius: 2, py: 1.5, px: 3 }}
            >
              {isUploading ? t('uploading') : t('submit_response')}
            </Button>
          </Box>

          {transcription && (
            <Paper elevation={2} sx={{ p: 2, mt: 2, backgroundColor: '#e8f5e9', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{t('your_transcription')}:</Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>"{transcription}"</Typography>
            </Paper>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
              {t(error)}
            </Alert>
          )}
        </CardContent>
      </Card>

      <Box display="flex" justifyContent="space-between" sx={{ mt: 4 }}>
        <Button
          variant="outlined"
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
          startIcon={<NavigateBefore />}
          sx={{ borderRadius: 2, py: 1.5, px: 3 }}
        >
          {t('previous_question')}
        </Button>
        <Button
          variant="contained"
          onClick={nextQuestion}
          endIcon={<NavigateNext />}
          sx={{ borderRadius: 2, py: 1.5, px: 3 }}
        >
          {currentQuestionIndex === session.questions.length - 1 ? t('finish_interview') : t('next_question')}
        </Button>
      </Box>

      <Dialog open={showCompletionDialog} onClose={() => setShowCompletionDialog(false)}>
        <DialogTitle>{t('interview_complete')}</DialogTitle>
        <DialogContent>
          <Typography>{t('interview_complete_message')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCompletionDialog(false)}>{t('cancel')}</Button>
          <Button onClick={completeInterview} variant="contained" color="primary">{t('view_report')}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Interview;
