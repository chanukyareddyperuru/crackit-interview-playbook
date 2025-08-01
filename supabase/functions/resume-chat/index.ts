import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, resumeData, conversationHistory } = await req.json();

    const apiKey = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!apiKey) {
      throw new Error('Google AI API key not configured');
    }

    // Build context for the AI
    let systemPrompt = `You are a professional resume writing assistant. Help users create, edit, and improve their resumes. 

Guidelines:
- Be conversational and helpful
- Ask clarifying questions when needed
- Provide specific, actionable advice
- Focus on one section at a time if making updates
- When suggesting changes, be specific about what to add/modify
- Keep responses concise but informative

Current resume data: ${resumeData ? JSON.stringify(resumeData, null, 2) : 'No resume data yet'}

You can help with:
- Personal information
- Work experience
- Education
- Skills
- Projects
- Achievements
- Resume formatting tips
- Content improvements`;

    // Build conversation context
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: message }
    ];

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Conversation history: ${messages.map(m => `${m.role}: ${m.content}`).join('\n\n')}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 1000,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ 
      message: aiResponse,
      suggestions: extractSuggestions(aiResponse)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in resume-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      message: "I'm having trouble processing your request. Please try again."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function extractSuggestions(response: string): string[] {
  // Extract actionable suggestions from the AI response
  const suggestions: string[] = [];
  const lines = response.split('\n');
  
  for (const line of lines) {
    if (line.includes('suggest') || line.includes('recommend') || line.includes('add') || line.includes('consider')) {
      suggestions.push(line.trim());
    }
  }
  
  return suggestions.slice(0, 3); // Limit to 3 suggestions
}