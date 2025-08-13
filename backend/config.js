require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  groqApiKey: process.env.GROQ_API_KEY,
  nodeEnv: process.env.NODE_ENV || 'development',
  // Add other configuration variables here
};
