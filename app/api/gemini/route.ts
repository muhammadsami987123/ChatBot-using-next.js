import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the Google Generative AI with your API key
const API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    // Check if API key is available
    if (!API_KEY) {
      console.error('GEMINI_API_KEY is not defined in environment variables');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const { messages } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request format. Expected an array of messages.' },
        { status: 400 }
      );
    }
    
    // Get the model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    
    try {
      // Use simple content generation
      const result = await model.generateContent(lastMessage.content);
      
      // Safely extract text from the response
      let responseText = '';
      try {
        responseText = result.response.text();
      } catch (textError) {
        console.error('Error extracting text from response:', textError);
        
        // Try alternative method to get text
        if (result.response.candidates && 
            result.response.candidates.length > 0 && 
            result.response.candidates[0].content && 
            result.response.candidates[0].content.parts && 
            result.response.candidates[0].content.parts.length > 0) {
          responseText = result.response.candidates[0].content.parts[0].text || 'No response text available';
        } else {
          responseText = 'Sorry, I couldn\'t generate a proper response.';
        }
      }
      
      return NextResponse.json({
        role: 'assistant',
        content: responseText,
      });
    } catch (error) {
      console.error('Error generating content:', error);
      
      // Try a simpler prompt as fallback
      try {
        const simpleResult = await model.generateContent("Hello, how can I help you?");
        const simpleResponse = simpleResult.response.text();
        
        return NextResponse.json({
          role: 'assistant',
          content: 'I had trouble processing your specific request, but I\'m here to help. ' + simpleResponse,
        });
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        throw fallbackError;
      }
    }
  } catch (error) {
    console.error('Error in Gemini API:', error);
    return NextResponse.json({
      role: 'assistant',
      content: 'Sorry, I encountered an error processing your request. Please try again later.',
    });
  }
} 