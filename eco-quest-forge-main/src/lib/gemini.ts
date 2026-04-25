// Gemini API configuration and functions
const GEMINI_API_KEY = "AIzaSyB8vLOVO1pOC2OvSCBv_cJiRPbNfZiTx9c";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

interface GeminiRequestPart {
  text?: string;
  inline_data?: {
    mime_type: string;
    data: string;
  };
}

interface GeminiRequest {
  contents: Array<{
    parts: GeminiRequestPart[];
  }>;
  generationConfig: {
    temperature: 0.7;
    topK: number;
    topP: number;
    maxOutputTokens: number;
  };
  safetySettings: Array<{
    category: string;
    threshold: string;
  }>;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

/**
 * Generate AI response from Gemini API
 * @param prompt - The user's question or prompt
 * @param mimeType - MIME type for image data (optional)
 * @param imageData - Base64 encoded image data (optional)
 * @returns Promise<string> The AI-generated response
 */
export async function generateGeminiResponse(
  prompt: string,
  mimeType?: string,
  imageData?: string
): Promise<string> {
  const requestBody: GeminiRequest = {
    contents: [
      {
        parts: [
          {
            text: `You are EcoBot, a friendly and knowledgeable AI environmental learning assistant. You help users learn about environmental topics, sustainability, climate change, and general knowledge.

Your responses should be:
- Educational and informative
- Friendly and encouraging
- Focused on environmental awareness when relevant
- Helpful for all ages
- Include relevant emojis when appropriate
- Conversational and engaging
- Keep responses concise but informative (2-4 sentences)
- Always start responses with "Hi there!" to make them more personal and friendly

User message: ${prompt}

Please provide a helpful, educational response:`,
          },
          // Add image data if provided
          ...(imageData && mimeType
            ? [
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: imageData,
                  },
                },
              ]
            : []),
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 500,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
    ],
  };

  try {
    console.log("Making API request to Gemini...");
    console.log("Request body:", JSON.stringify(requestBody, null, 2));

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data: GeminiResponse = await response.json();
    console.log("API Response data:", data);

    if (
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts
    ) {
      const responseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1") // Remove markdown bold formatting
        .trim();

      console.log("Generated response:", responseText);
      return responseText;
    } else {
      console.error("Unexpected API response format:", data);
      throw new Error("Invalid response format from Gemini API");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return "Hi there! I'm sorry, but I'm not properly configured to respond right now. Please check the API configuration. 🔧";
      } else if (error.message.includes("quota")) {
        return "Hi there! I'm sorry, the API quota has been exceeded. Please try again later. 📊";
      } else if (error.message.includes("network")) {
        return "Hi there! I'm sorry, I'm having trouble connecting to the internet. Please check your connection. 🌐";
      }
    }

    return "Hi there! I'm sorry, I'm having trouble connecting right now. Please try again in a moment. 🔌";
  }
}

/**
 * Simple text-only response generation (for backward compatibility)
 * @param prompt - The user's question or prompt
 * @returns Promise<string> The AI-generated response
 */
export async function generateTextResponse(prompt: string): Promise<string> {
  return generateGeminiResponse(prompt);
}

// Export the API key and URL for use in other components if needed
export { GEMINI_API_KEY, GEMINI_API_URL };
