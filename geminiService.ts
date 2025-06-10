
import { GoogleGenAI, Chat, GenerateContentResponse, Content } from "@google/genai";
import { AGI_SYSTEM_INSTRUCTION, API_REQUEST_TIMEOUT_MS, INITIAL_AGI_GREETING, FALLBACK_GEMINI_MODEL } from '../constants';

let ai: GoogleGenAI | null = null;
let loadedAgiModelName: string | null = null; // Cache for the loaded model name

const getAiClient = (): GoogleGenAI => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set.");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

async function getAgiModelName(): Promise<string> {
  if (loadedAgiModelName) {
    return loadedAgiModelName;
  }
  try {
    const response = await fetch('./aiya_schema.json'); // Fetch from root
    if (!response.ok) {
      throw new Error(`Failed to fetch Aiya's schema: ${response.status} ${response.statusText}`);
    }
    const schema = await response.json();
    const modelFromSchema = schema?.primary_orchestrator?.implementation_details?.quantum_core_status?.model;
    
    if (typeof modelFromSchema === 'string' && modelFromSchema.trim() !== '') {
      loadedAgiModelName = modelFromSchema;
      console.info(`Using AGI model from schema: ${loadedAgiModelName}`);
      return loadedAgiModelName;
    } else {
      console.warn("Model name not found or invalid in Aiya's schema. Using fallback.");
      loadedAgiModelName = FALLBACK_GEMINI_MODEL;
      return FALLBACK_GEMINI_MODEL;
    }
  } catch (error) {
    console.error("Error loading or parsing Aiya's schema:", error);
    console.warn("Using fallback AGI model due to schema loading error.");
    loadedAgiModelName = FALLBACK_GEMINI_MODEL; 
    return FALLBACK_GEMINI_MODEL;
  }
}

export const createChatSession = async (): Promise<Chat> => {
  const client = getAiClient();
  const modelName = await getAgiModelName();
  
  // The initial history was removed as it caused an API error.
  // The API requires history to start with a "user" turn.
  // Aiya's persona is set by systemInstruction.
  // The initial greeting is handled by App.tsx displaying it in the UI.

  return client.chats.create({
    model: modelName,
    config: {
      systemInstruction: AGI_SYSTEM_INSTRUCTION,
    },
    // history: initialHistory, // Removed this line
  });
};

export async function* streamMessageToAgi(
  chat: Chat,
  userMessage: string,
  history?: Content[] 
): AsyncGenerator<string, void, undefined> {
  try {
    const stream = await chat.sendMessageStream({ 
      message: userMessage,
      // The 'config' property containing 'requestOptions' was removed as it's not a valid
      // property for GenerateContentParameters or GenerateContentConfig.
      // Timeouts are typically handled by the SDK's underlying mechanisms or client-level settings.
    });

    for await (const chunk of stream) { 
      const text = chunk.text;
      if (text) {
        yield text;
      }
    }
  } catch (error) {
    console.error("Error streaming message to AGI:", error);
    if (error instanceof Error) {
        yield `[Error: ${error.message}]`;
    } else {
        yield "[Error: An unknown error occurred while communicating with Aiya.]";
    }
  }
}
