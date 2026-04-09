import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

let ai: GoogleGenAI | null = null;

export function getGemini(): GoogleGenAI {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    ai = new GoogleGenAI({ apiKey: key });
  }
  return ai;
}

export async function generateProfile(answers: Record<string, string>) {
  const ai = getGemini();
  const prompt = `Analyze the following user answers to a personality and routine quiz. 
Build a comprehensive professional personality profile for them.
Answers:
${JSON.stringify(answers, null, 2)}
`;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          traits: { type: Type.ARRAY, items: { type: Type.STRING } },
          meetingStyle: { type: Type.STRING },
          energyPattern: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING }
        },
        required: ["traits", "meetingStyle", "energyPattern", "strengths", "weaknesses", "summary"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
}

export async function updateProfile(currentProfile: any, routine: string, meetings: any[], additionalContext?: string) {
  const ai = getGemini();
  const prompt = `You are an expert personality and productivity analyst.
Review the user's current profile, their daily routine, their upcoming meetings, and any new context they've provided.
Update their personality profile to reflect this new information. Keep the same structure.

Current Profile:
${JSON.stringify(currentProfile, null, 2)}

Current Routine:
${routine}

Upcoming Meetings:
${JSON.stringify(meetings, null, 2)}

${additionalContext ? `New Context / What's Changed:\n${additionalContext}` : 'Please refine and deepen the profile based on the routine and meetings.'}
`;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          traits: { type: Type.ARRAY, items: { type: Type.STRING } },
          meetingStyle: { type: Type.STRING },
          energyPattern: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING }
        },
        required: ["traits", "meetingStyle", "energyPattern", "strengths", "weaknesses", "summary"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
}

export async function generateSpeech(scenario: string, bulletPoints: string, profile: any) {
  const ai = getGemini();
  const prompt = `Write a speech for a meeting based on the following scenario and bullet points.
Tailor the tone and style to match the user's personality profile.
Scenario: ${scenario}
Bullet Points: ${bulletPoints}
User Profile: ${JSON.stringify(profile, null, 2)}
`;
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
    }
  });
  return response.text;
}

export async function generateMeetingResponse(history: {role: string, text: string}[], userProfile: any, attendeeContext: string) {
  const ai = getGemini();
  const prompt = `You are role-playing as an attendee in a meeting. 
Attendee Context: ${attendeeContext}
The user you are talking to has this personality profile: ${JSON.stringify(userProfile)}

Respond IN CHARACTER as the attendee. Keep responses concise, conversational, and natural for a voice companion. Challenge the user if appropriate for the roleplay. Do not break character.

Conversation history:
${history.map(m => `${m.role === 'user' ? 'User' : 'Attendee'}: ${m.text}`).join('\n')}

Attendee:`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  return response.text;
}

export async function analyzePersonalityMatch(attendees: string, profile: any) {
  const ai = getGemini();
  const prompt = `Analyze these attendees: ${attendees}. My profile: ${JSON.stringify(profile)}. Predict dynamics and suggest communication strategies.`;
  const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
  return response.text;
}

export async function optimizeRoutine(routine: string, profile: any) {
  const ai = getGemini();
  const prompt = `My routine: ${routine}. My profile: ${JSON.stringify(profile)}. Suggest optimal meeting slots and breaks based on my energy patterns.`;
  const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
  return response.text;
}

export async function analyzeTone(text: string, profile: any) {
  const ai = getGemini();
  const prompt = `Analyze the tone of this speech/text: "${text}". My profile: ${JSON.stringify(profile)}. Give feedback on confidence, clarity, and pacing.`;
  const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
  return response.text;
}

export async function predictConflict(agenda: string, profile: any) {
  const ai = getGemini();
  const prompt = `Meeting agenda/context: ${agenda}. My profile: ${JSON.stringify(profile)}. Predict potential friction points and suggest mitigation strategies.`;
  const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
  return response.text;
}

export async function generateDebrief(notes: string, profile: any) {
  const ai = getGemini();
  const prompt = `Meeting notes: ${notes}. My profile: ${JSON.stringify(profile)}. Extract key insights, action items, and suggest behavioral improvements.`;
  const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
  return response.text;
}

export async function analyzeEnergySync(routine: string, meetings: any[], profile: any) {
  const ai = getGemini();
  const prompt = `Analyze this user's routine, upcoming meetings, and energy pattern.
Routine: ${routine}
Meetings: ${JSON.stringify(meetings)}
Profile Energy Pattern: ${profile.energyPattern}

Provide a short, punchy "Energy Sync Alert" (max 2 sentences) proactively warning them about a schedule conflict with their energy, or praising a well-placed meeting. Make it sound like an elite executive assistant.`;
  const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
  return response.text;
}

export async function generateGodModeResponse(input: string, profile: any, opponentProfile: string) {
  const ai = getGemini();
  const prompt = `You are a real-time executive whisperer. The user is in a high-stakes meeting right now.
The opponent just said: "${input}"
Opponent Profile: ${opponentProfile || 'Unknown'}
User Profile: ${JSON.stringify(profile)}

Give the user the PERFECT 1-2 sentence comeback, pivot, or question to ask next. Be sharp, strategic, and match the user's strengths. Do not include pleasantries, just the exact words they should say or the immediate tactic they should use.`;
  const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
  return response.text;
}

export async function unlockVault(profile: any) {
  const ai = getGemini();
  const prompt = `Based on my profile: ${JSON.stringify(profile)}, surface 3 hidden strengths and 1 blind spot I might not be aware of. Format beautifully.`;
  const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
  return response.text;
}
