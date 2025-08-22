const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra');
const path = require('path');
const Groq = require('groq-sdk');
const config = require('../config');

// Initialize Groq client with your API key
const groq = new Groq({
  apiKey: config.groqApiKey,
});

// Ensure directories exist
const uploadsDir = path.join(__dirname, '../uploads');
fs.ensureDirSync(uploadsDir);

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}.webm`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// In-memory storage for interview sessions
let interviewSessions = {};

/*
 * POST /api/generate-groq-interview
 * Accepts candidateName
 */
router.post('/generate-groq-interview', (req, res) => {
  const { roleTitle, roleDescription, candidateName } = req.body;

  if (!roleTitle || !roleDescription) {
    return res.status(400).json({ error: 'Role title and description are required' });
  }

  const sessionId = uuidv4();
  interviewSessions[sessionId] = {
    id: sessionId,
    candidateName: (candidateName || '').trim() || 'Unknown Candidate',
    roleTitle,
    roleDescription,
    introduction: 'This is a placeholder introduction. Replace with AI-generated content.',
    questions: [
      'Placeholder Question 1',
      'Placeholder Question 2',
      'Placeholder Question 3'
    ],
    responses: [],
    createdAt: new Date().toISOString(),
    status: 'active'
  };

  res.json({
    sessionId,
    introduction: interviewSessions[sessionId].introduction,
    questions: interviewSessions[sessionId].questions,
    totalQuestions: interviewSessions[sessionId].questions.length
  });
});

/*
 * POST /api/generate-interview
 * Accepts candidateName
 */
router.post('/generate-interview', async (req, res, next) => {
  try {
    const { roleTitle, roleDescription, candidateName } = req.body;

    if (!roleTitle || !roleDescription) {
      return res.status(400).json({ error: 'Role title and description are required' });
    }

    // AI intro prompt
    const introPrompt = `Generate a warm, professional introduction for a video interview for the role of ${roleTitle}. 
Role Description: ${roleDescription}  for self introduction.
The introduction should:
1. Welcome the candidate
2. Briefly explain the interview process
3. Be encouraging and professional
4. Be around 2-3 sentences
Return only the introduction`;

    const introResponse = await groq.chat.completions.create({
      model: "qwen/qwen3-32b",  // <-- Updated model here
      messages: [{ role: "user", content: introPrompt }],
      max_tokens: 200,
      temperature: 0.7
    });

    const introduction = introResponse?.choices?.[0]?.message?.content?.trim() || "Welcome to the interview!";

    // AI questions prompt
    const questionsPrompt = `Please always generate 6 or more interview questions for the role of ${roleTitle} with question words (what,why ,how ,which,etc) and dont tag question word.
Role Description: ${roleDescription}
Questions should:
- Be relevant to the role and each question should be unique in one line atleast
- Progress from general to specific
- Include behavioral and technical aspects
- Be clear and concise
- Allow candidates to showcase their experience
Return as a numbered list.`;

    const questionsResponse = await groq.chat.completions.create({
      model: "qwen/qwen3-32b",  // <-- Updated model here
      messages: [{ role: "user", content: questionsPrompt }],
      max_tokens: 500,
      temperature: 0.8
    });

    const questionsText = questionsResponse?.choices?.[0]?.message?.content?.trim() || "";
    const questions = questionsText.split('\n')
      .filter(line => line.trim() && /^\d+\./.test(line.trim()))
      .map(line => line.replace(/^\d+\.\s*/, '').trim());

    const sessionId = uuidv4();
    interviewSessions[sessionId] = {
      id: sessionId,
      candidateName: (candidateName || '').trim() || 'Unknown Candidate',
      roleTitle,
      roleDescription,
      introduction,
      questions,
      responses: [],
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    res.json({
      sessionId,
      introduction,
      questions,
      totalQuestions: questions.length
    });

  } catch (error) {
    next(error);
  }
});

/*
 * Upload video response
 */
router.post('/upload-response/:sessionId/:questionIndex', upload.single('video'), async (req, res, next) => {
  try {
    const { sessionId, questionIndex } = req.params;
    const videoFile = req.file;

    if (!videoFile) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    if (!interviewSessions[sessionId]) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(videoFile.path),
      model: "whisper-large-v3",
    });

    if (!transcription?.text) {
      return res.status(500).json({ error: 'Transcription failed or empty result.' });
    }

    const response = {
      questionIndex: parseInt(questionIndex),
      question: interviewSessions[sessionId].questions[questionIndex],
      videoPath: videoFile.path,
      videoFilename: videoFile.filename,
      transcription: transcription.text,
      uploadedAt: new Date().toISOString()
    };

    interviewSessions[sessionId].responses.push(response);

    res.json({
      success: true,
      transcription: transcription.text,
      questionIndex: parseInt(questionIndex)
    });

  } catch (error) {
    next(error);
  }
});

/*
 * Get single session
 */
router.get('/session/:sessionId', (req, res) => {
  const session = interviewSessions[req.params.sessionId];
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(session);
});

/*
 * Get all sessions (basic info)
 */
router.get('/sessions', (req, res) => {
  const sessions = Object.values(interviewSessions).map(session => ({
    id: session.id,
    candidateName: session.candidateName || 'Unknown Candidate',
    roleTitle: session.roleTitle,
    createdAt: session.createdAt,
    status: session.status,
    responseCount: session.responses.length,
    totalQuestions: session.questions.length
  }));
  res.json(sessions);
});

/*
 * Dynamic candidates list for RecruiterDashboard
 */
router.get('/candidates', (req, res) => {
  const candidates = Object.values(interviewSessions).map(session => ({
    id: session.id,
    name: session.candidateName || 'Unknown Candidate',
    role: session.roleTitle,
    status: session.status,
    date: session.createdAt,
    responseCount: session.responses.length
  }));
  res.json(candidates);
});

/*
 * DELETE /api/candidates/:sessionId
 * Deletes a candidate session
 */
router.delete('/candidates/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  if (interviewSessions[sessionId]) {
    // Delete associated video files
    interviewSessions[sessionId].responses.forEach(response => {
      if (response.videoPath) {
        fs.remove(response.videoPath)
          .then(() => console.log(`Deleted video file: ${response.videoPath}`))
          .catch(err => console.error(`Error deleting video file ${response.videoPath}:`, err));
      }
    });
    delete interviewSessions[sessionId];
    return res.status(200).json({ message: 'Candidate session deleted successfully' });
  }
  res.status(404).json({ error: 'Candidate session not found' });
});

/*
 * Generate AI evaluation report
 */
router.post('/generate-report/:sessionId', async (req, res, next) => {
  const { sessionId } = req.params;

  try {
    const session = interviewSessions[sessionId];

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const prompt = `
Candidate Name: ${session.candidateName}
Role: ${session.roleTitle}
Interview Questions and Answers:
${session.questions.map((q, i) =>
      `Q${i + 1}: ${q}\nA: ${session.responses?.[i]?.transcription || 'No response'}`
    ).join('\n\n')}

Please evaluate this candidate’s performance based on the answers provided.
Include:
- Strengths
- Weaknesses
- Communication Skills
- Technical Competence
- Cultural Fit
- Suggested Next Steps

Provide a JSON object at the end of your evaluation containing a 'skills' key. The 'skills' key should contain two objects: 'technical_skills' and 'soft_skills'. Each of these should list relevant skills with a rating out of 10. Example:
{
  "skills": {
    "technical_skills": {
      "React": "8/10",
      "JavaScript": "9/10"
    },
    "soft_skills": {
      "Communication": "7/10",
      "Teamwork": "8/10"
    }
  }
}
`;

    const aiResponse = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",  // <-- Updated model here
      messages: [
        { role: "system", content: "You are an expert HR interviewer. Always include the JSON object at the end of your response." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    const evaluationContent = aiResponse?.choices?.[0]?.message?.content || "No evaluation generated.";
    let evaluation = evaluationContent;
    let skillsBreakdown = { technical_skills: {}, soft_skills: {} };

    // Attempt to extract JSON from the evaluation content
    const jsonMatch = evaluationContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsedJson = JSON.parse(jsonMatch[0]);
        if (parsedJson.skills) {
          skillsBreakdown = parsedJson.skills;
          // Remove the JSON part from the evaluation text
          evaluation = evaluationContent.replace(jsonMatch[0], '').trim();
        }
      } catch (e) {
        console.error("Error parsing skills JSON:", e);
      }
    }

    const report = {
      candidateInfo: {
        candidateName: session.candidateName,
        roleTitle: session.roleTitle,
        interviewDate: session.createdAt || new Date(),
        totalQuestions: session.questions.length,
        totalResponses: session.responses?.length || 0
      },
      evaluation,
      skillsBreakdown,
      responses: session.questions.map((q, i) => ({
        question: q,
        transcription: session.responses?.[i]?.transcription || 'No response'
      })),
      generatedAt: new Date()
    };

    res.json(report);
  } catch (err) {
    next(err);
  }
});

/*
 * POST /api/generate-coding-assessment-question
 * Generates a coding assessment question using Groq API
 */
/*
 * POST /api/generate-coding-assessment
 * Generates a coding assessment problem in full JSON (LeetCode-style, strict)
 */
router.post('/generate-coding-assessment', async (req, res, next) => {
  try {
    const { roleTitle, difficulty } = req.body;

    if (!roleTitle) {
      return res.status(400).json({ error: 'Role title is required' });
    }

    const prompt = `Generate a coding assessment problem for a ${roleTitle} role.
The style should mimic a LeetCode problem and MUST return ONLY valid JSON (no explanations, no text outside JSON).
Difficulty: ${difficulty || 'medium'}.

JSON Structure:
{
  "title": "Concise problem title",
  "description": "Detailed problem statement with markdown support if needed.",
  "input": "Description of input format with ranges and types.",
  "output": "Description of expected output format and type.",
  "constraints": [
    "Constraint 1",
    "Constraint 2",
    "Constraint 3"
  ],
  "examples": [
    {
      "input": "Example input",
      "output": "Example output",
      "explanation": "Why this is the result"
    },
    {
      "input": "Another example input",
      "output": "Another output",
      "explanation": "Explanation here"
    }
  ],
  "function_signature": {
    "language": "JavaScript",
    "signature": "function functionName(params) { /* ... */ }"
  },
  "test_cases": [
    { "input": "Test input 1", "expected_output": "Output 1" },
    { "input": "Test input 2", "expected_output": "Output 2" }
  ],
  "hints": [
    "Hint 1",
    "Hint 2"
  ],
  "evaluation_criteria": {
    "Correctness": "Must pass all test cases and edge cases.",
    "Time Complexity": "Aim for optimal complexity.",
    "Space Complexity": "Keep memory usage efficient."
  }
}`;

    const groqResponse = await groq.chat.completions.create({
      model: "qwen/qwen3-32b",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
      temperature: 0.7
    });

    let rawContent = groqResponse?.choices?.[0]?.message?.content?.trim() || "{}";

    // Strict check: response must start with { and end with }
    if (!rawContent.startsWith("{") || !rawContent.endsWith("}")) {
      return res.status(500).json({
        error: "Groq did not return valid JSON",
        raw: rawContent
      });
    }

    let parsedProblem;
    try {
      parsedProblem = JSON.parse(rawContent);
    } catch (e) {
      console.error("Error parsing Groq JSON:", e);
      return res.status(500).json({ error: "Invalid JSON response from AI", raw: rawContent });
    }

    res.json({ problem: parsedProblem });

  } catch (error) {
    console.error("Error in /generate-coding-assessment:", error);
    next(error);
  }
});


/*
 * POST /api/generate-hr-questions
 * Generates HR interview questions using Groq API
 */
router.post('/generate-hr-questions', async (req, res, next) => {
  try {
    const { roleTitle } = req.body;

    if (!roleTitle) {
      return res.status(400).json({ error: 'Role title is required' });
    }

    const prompt = `Generate 5-7 HR interview questions for a ${roleTitle} role in detail with Question words and dont tag question words.
    Questions should cover:
    - Communication skills
    - Teamwork
    - Problem-solving
    - Strengths and weaknesses
    - Career aspirations
    Return as a numbered list please `;

    const groqResponse = await groq.chat.completions.create({
      model: "qwen/qwen3-32b",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.7
    });

    const questionsText = groqResponse?.choices?.[0]?.message?.content?.trim() || "";
    const questions = questionsText.split('\n')
      .filter(line => line.trim() && /^\d+\./.test(line.trim()))
      .map(line => line.replace(/^\d+\.\s*/, '').trim());

    res.json({ questions });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
