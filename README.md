# AI-Powered Video Interview Bot (MVP)

This project is an AI-powered video interview bot designed to streamline the recruitment process by automating initial candidate screenings.

## Documentation
This section provides detailed insights into the project's architecture, technologies, and implementation specifics.

### Tech Stack Used

The project is divided into a backend (server) and a frontend (client).

**Backend:**
*   **Node.js**: Runtime environment.
*   **Express.js**: Web application framework for building APIs.
*   **Groq SDK**: For interacting with Large Language Models (LLMs) for generating interview content and reports, and for audio transcription.
*   **Multer**: Middleware for handling `multipart/form-data`, primarily for video uploads.
*   **uuid**: For generating unique session IDs.
*   **fs-extra**: For file system operations (e.g., ensuring directories exist).
*   **dotenv**: For loading environment variables.
*   **cors**: Middleware for enabling Cross-Origin Resource Sharing.
*   **nodemon**: (Development) For automatically restarting the server during development.
*   **concurrently**: (Development) For running both client and server concurrently.

**Frontend:**
*   **React**: JavaScript library for building user interfaces.
*   **Material-UI (MUI)**: React component library for a consistent and modern UI.
*   **Axios**: Promise-based HTTP client for making API requests.
*   **React Router DOM**: For declarative routing in the React application.
*   **i18next & react-i18next**: For internationalization (i18n) to support multiple languages.
*   **Chart.js & react-chartjs-2**: For creating charts and data visualizations in reports.
*   **Tailwind CSS**: (Development) A utility-first CSS framework for styling.
*   **Autoprefixer & PostCSS**: (Development) For processing CSS.

### Data Structure and Algorithm Visualizations is also embedded to get more clear idea how to searching, sorting, graph, tree, stack and queue work

The frontend includes a dedicated section for visualizing various data structures and algorithms. This feature allows users to interactively understand the step-by-step execution of algorithms like sorting, searching, and operations on data structures such as stacks, queues, and trees. It serves as an educational tool to enhance comprehension of complex computational concepts.

### Prompt Design Approach for LLM Usage

The application leverages Groq's LLMs for various tasks, with specific prompt engineering strategies for each:

1.  **Interview Introduction Generation**:
    *   **Model**: `qwen/qwen3-32b`
    *   **Prompt Goal**: To generate a warm, professional, and concise introduction for the candidate.
    *   **Approach**: The prompt explicitly defines the desired tone ("warm, professional"), content requirements (welcome, brief explanation of process, encouraging), and length constraints (2-3 sentences). It also instructs the LLM to return *only* the introduction, avoiding additional commentary.

2.  **Interview Question Generation**:
    *   **Model**: `qwen/qwen3-32b`
    *   **Prompt Goal**: To generate a set of relevant and structured interview questions.
    *   **Approach**: The prompt specifies the minimum number of questions (6 or more), relevance to the role, progression (general to specific), inclusion of behavioral and technical aspects, clarity, and conciseness. It also mandates the output format as a numbered list.

3.  **Video Response Transcription**:
    *   **Model**: `whisper-large-v3`
    *   **Approach**: The Groq SDK's audio transcription API is used. The audio file (video response) is streamed directly to the `whisper-large-v3` model for accurate speech-to-text conversion.

4.  **AI Evaluation Report Generation**:
    *   **Model**: `meta-llama/llama-4-scout-17b-16e-instruct`
    *   **Prompt Goal**: To provide a comprehensive evaluation of a candidate's performance based on their interview responses.
    *   **Approach**:
        *   **System Message**: A `system` role message ("You are an expert HR interviewer. Always include the JSON object at the end of your response.") is used to set the persona and enforce the required output structure.
        *   **User Prompt**: The `user` prompt includes all relevant context: candidate name, role, and a detailed list of questions and their transcribed answers.
        *   **Evaluation Criteria**: The prompt explicitly asks for specific evaluation categories: Strengths, Weaknesses, Communication Skills, Technical Competence, Cultural Fit, and Suggested Next Steps.
        *   **Structured Output (JSON)**: A critical part of the prompt is the instruction to include a JSON object at the end, containing a `skills` breakdown with `technical_skills` and `soft_skills`, each listing relevant skills with a rating out of 10. This ensures a machine-readable and consistent data structure for skill assessment.

### Setup Instructions for Running Locally

To set up and run the AI-Powered Video Interview Bot locally, follow these steps:

**Prerequisites:**
*   Node.js (v18 or higher recommended)
*   npm (Node Package Manager)

**1. Clone the Repository:**
If you haven't already, clone the project repository from GitHub:
```bash
git clone https://github.com/SandeepGKP/AI-Interview-Bot.git
cd AI-Interview-Bot
```

**2. Install Dependencies:**
The project has dependencies for both the backend and the frontend.
```bash
npm install # Installs backend dependencies
cd client
npm install # Installs frontend dependencies
cd .. # Go back to the root directory
```
Alternatively, you can use the combined script:
```bash
npm run install-all
```

**3. Configure Environment Variables:**
Create a `.env` file in the `backend/` directory. This file will store your API keys and other sensitive information.
```
# backend/.env
GROQ_API_KEY=your_groq_api_key_here
```
Replace `your_groq_api_key_here` with your actual API key obtained from Groq.

**4. Run the Application:**
You can start both the backend and frontend concurrently using a single command from the root directory:
```bash
npm run dev
```
This command will:
*   Start the backend server using `nodemon` (for automatic restarts on file changes).
*   Navigate into the `client` directory and start the React development server.

**5. Access the Application:**
*   The backend API will typically run on `http://localhost:5000`.
*   The frontend application will typically be accessible at `http://localhost:3000` in your web browser.

You should now be able to use the AI-Powered Video Interview Bot locally.
