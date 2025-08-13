# AI-Powered Video Interview Bot (MVP)

A comprehensive browser-based AI interview bot that streamlines the recruitment process by conducting automated video interviews with AI-generated questions, real-time transcription, and intelligent candidate evaluation.

## 🚀 Features

### Core Functionality
- **AI-Generated Introductions**: Personalized, role-specific welcome messages
- **Dynamic Question Generation**: 5-7 tailored interview questions based on job descriptions
- **Browser-Based Video Recording**: Seamless video capture using WebRTC/MediaRecorder API
- **Real-Time Transcription**: AI-powered speech-to-text using OpenAI Whisper
- **Intelligent Evaluation**: Comprehensive candidate assessment with skill ratings
- **Recruiter Dashboard**: Overview of all interview sessions and reports

### Advanced Features
- **Multi-Role Support**: Customizable for any job position
- **Structured Reporting**: Detailed evaluation reports with strengths, weaknesses, and recommendations
- **Skills Assessment**: Technical and soft skills rating (1-5 scale)
- **Session Management**: Track interview progress and completion status
- **Export Capabilities**: JSON-based reports for easy integration

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **OpenAI GPT-3.5/4** for question generation and evaluation
- **OpenAI Whisper** for speech-to-text transcription
- **Multer** for video file handling
- **UUID** for session management

### Frontend
- **React.js** with modern hooks
- **Material-UI** for professional UI components
- **WebRTC/MediaRecorder API** for video recording
- **Axios** for API communication
- **React Router** for navigation

### Storage
- **In-memory storage** for MVP (easily extensible to databases)
- **Local file system** for video storage and reports
- **JSON-based** configuration and reports

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key
- Modern web browser with WebRTC support

## 🔧 Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd ai-video-interview-bot

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env file and add your OpenAI API key
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Run the Application

```bash
# Development mode (runs both backend and frontend)
npm run dev

# Or run separately:
# Backend only
npm run server

# Frontend only (in another terminal)
npm run client
```

### 4. Access the Application

- **Candidate Interface**: http://localhost:3000
- **Recruiter Dashboard**: http://localhost:3000/recruiter
- **API Health Check**: http://localhost:5000/api/health

## 🎯 Usage Guide

### For Recruiters

1. **Create Interview Session**:
   - Navigate to the recruiter dashboard
   - Enter job title and detailed role description
   - System generates personalized introduction and questions

2. **Share with Candidates**:
   - Copy the generated session link
   - Send to candidates via email or recruitment platform

3. **Review Results**:
   - Monitor interview progress in real-time
   - Access detailed evaluation reports
   - Export data for further analysis

### For Candidates

1. **Start Interview**:
   - Click on the provided interview link
   - Read the AI-generated introduction
   - Ensure camera and microphone permissions

2. **Record Responses**:
   - Answer questions one at a time
   - Record video responses (recommended 1-3 minutes each)
   - Review and re-record if needed

3. **Submit Interview**:
   - Complete all questions
   - Submit for AI evaluation
   - Receive confirmation of successful submission

## 🏗️ Architecture Overview

### Interview Flow
```
Role Input → AI Question Generation → Video Recording → 
Speech Transcription → AI Evaluation → Report Generation
```

### API Endpoints
- `POST /api/generate-interview` - Create new interview session
- `POST /api/upload-response/:sessionId/:questionIndex` - Upload video response
- `GET /api/session/:sessionId` - Get session details
- `POST /api/generate-report/:sessionId` - Generate evaluation report
- `GET /api/sessions` - List all sessions (recruiter dashboard)

### Prompt Engineering Strategy

#### Question Generation
- Role-specific context analysis
- Progressive difficulty (general → specific)
- Behavioral and technical balance
- Clear, actionable questions

#### Evaluation Criteria
- Comprehensive skill assessment
- Structured feedback format
- Quantitative ratings (1-5, 1-10 scales)
- Actionable recommendations

## 🔒 Security Considerations

- **API Key Protection**: Environment variables for sensitive data
- **File Upload Limits**: 50MB maximum video file size
- **Session Management**: UUID-based session identification
- **CORS Configuration**: Controlled cross-origin requests

## 📊 Evaluation Metrics

### Technical Skills Assessment
- Programming proficiency
- Problem-solving approach
- System design understanding
- Technology-specific knowledge

### Soft Skills Assessment
- Communication clarity
- Leadership potential
- Teamwork collaboration
- Adaptability and learning

### Overall Scoring
- 1-10 scale with detailed justification
- Hire/Consider/Pass recommendations
- Cultural fit assessment
- Specific improvement areas

## 🚀 Deployment Options

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment (Optional)
```dockerfile
# Dockerfile example for containerization
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔄 Extensibility

### Adding New Features
- **Multi-language Support**: Extend prompts for different languages
- **Custom Scoring Rubrics**: Configurable evaluation criteria
- **Integration APIs**: Connect with ATS systems
- **Advanced Analytics**: Candidate comparison and trends

### Database Integration
- Replace in-memory storage with MongoDB/PostgreSQL
- Add user authentication and authorization
- Implement data persistence and backup

### AI Model Customization
- Fine-tune prompts for specific industries
- Integrate additional AI services
- Implement custom evaluation algorithms

## 🐛 Troubleshooting

### Common Issues

1. **OpenAI API Errors**:
   - Verify API key is correctly set
   - Check API usage limits and billing
   - Ensure proper network connectivity

2. **Video Recording Issues**:
   - Confirm browser WebRTC support
   - Check camera/microphone permissions
   - Test with different browsers

3. **File Upload Problems**:
   - Verify file size limits
   - Check disk space availability
   - Ensure proper directory permissions

### Debug Mode
```bash
# Enable detailed logging
DEBUG=* npm run server
```

## 📈 Performance Optimization

- **Video Compression**: Optimize recording settings
- **Async Processing**: Background transcription and evaluation
- **Caching Strategy**: Store frequently accessed data
- **CDN Integration**: Serve static assets efficiently

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT and Whisper APIs
- React team for the excellent framework
- Material-UI for beautiful components
- WebRTC community for browser APIs

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review API documentation

---

**Built with ❤️ for streamlined recruitment processes**
