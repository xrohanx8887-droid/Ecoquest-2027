# EcoBot Gemini API Setup Guide

## Overview

The EcoBot chatbot has been upgraded to use Google's Gemini 2.5 AI model for conversational responses. This allows users to ask any questions about the environment, sustainability, or general topics and receive intelligent, contextual responses.

## Setup Instructions

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment Variables

Create a `.env` file in your project root directory and add:

```bash
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

**Important Notes:**

- Replace `your_actual_api_key_here` with your actual Gemini API key
- The `VITE_` prefix is required for Vite to expose the variable to the client
- Never commit your `.env` file to version control
- Add `.env` to your `.gitignore` file

### 3. Restart Your Development Server

After adding the environment variable, restart your development server for the changes to take effect.

## Features

### AI-Powered Responses

- **Conversational AI**: Uses Gemini 2.5 Flash model for natural conversations
- **Environmental Focus**: Primarily designed for environmental and sustainability topics
- **General Knowledge**: Can also handle general questions and topics
- **Contextual Understanding**: Provides relevant and educational responses

### Safety Features

- Built-in content filtering
- Harmful content blocking
- Age-appropriate responses
- Educational focus

### User Experience

- Real-time typing indicators
- Quick topic buttons for common environmental subjects
- Responsive design that works on all devices
- Floating chat interface accessible from any page

## API Configuration Details

The chatbot uses the following Gemini API settings:

- **Model**: `gemini-1.5-flash` (fast and efficient)
- **Temperature**: 0.7 (balanced creativity and accuracy)
- **Max Tokens**: 800 (sufficient for detailed responses)
- **Safety Settings**: Medium and above blocking for harmful content

## Troubleshooting

### Common Issues

1. **"Please add VITE_GEMINI_API_KEY to your .env file"**

   - Ensure your `.env` file exists in the project root
   - Check that the variable name starts with `VITE_`
   - Restart your development server

2. **"I'm having trouble connecting right now"**

   - Verify your API key is correct
   - Check your internet connection
   - Ensure you have sufficient API quota

3. **Slow responses**
   - This is normal for AI model responses
   - Responses typically take 1-3 seconds
   - The typing indicator shows the system is working

### API Quota and Limits

- Check your [Google AI Studio dashboard](https://makersuite.google.com/app/apikey) for usage limits
- Free tier includes generous quotas for development and testing
- Monitor usage to avoid unexpected charges

## Security Best Practices

1. **Never expose API keys in client-side code**

   - The current implementation is for development/demo purposes
   - For production, consider using a backend proxy

2. **Environment variable management**

   - Use `.env.local` for local development
   - Use proper secret management in production
   - Rotate API keys regularly

3. **Rate limiting**
   - Consider implementing rate limiting for production use
   - Monitor API usage patterns

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your API key configuration
3. Test with a simple question first
4. Ensure your development environment is properly set up

## Future Enhancements

Potential improvements for the chatbot:

- Conversation memory and context
- Multi-language support
- Voice input/output
- Integration with learning progress tracking
- Personalized environmental recommendations
