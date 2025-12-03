import { GoogleGenAI } from "@google/genai";
import { BackendConfig } from "../types";

// This simulates the 'rembg' Python backend response for demo purposes
// In a real scenario, this helps the UI look good immediately without the Python server running.
const mockSeverSpirit = async (file: File): Promise<Blob> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Just return the original file as a blob for the mock
      // In a real mock we might apply a CSS filter, but here we just pass it through
      // to demonstrate the UI flow.
      resolve(file); 
    }, 3000);
  });
};

// The actual call to the Python Flask server
const realSeverSpirit = async (file: File, url: string): Promise<Blob> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`The spirits refused: ${response.statusText}`);
    }

    return await response.blob();
  } catch (error) {
    console.error("Connection to the other side failed:", error);
    throw error;
  }
};

export const severSpirit = async (file: File, config: BackendConfig): Promise<Blob> => {
  if (config.useMock) {
    return mockSeverSpirit(file);
  }
  return realSeverSpirit(file, config.serverUrl);
};

// Use Gemini to "Read the Spirit" (Analyze the image)
export const getSpiritReading = async (file: File): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "The spirits are silent (Missing API Key).";

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Convert file to base64
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data
            }
          },
          {
            text: "You are a Victorian medium communicating with a spirit. Analyze this image and describe the 'aura' or 'spirit' you see within the subject in a mysterious, spooky, yet poetic tone. Keep it under 50 words."
          }
        ]
      }
    });

    return response.text || "A mysterious presence is felt...";
  } catch (error) {
    console.error("Gemini Seance failed:", error);
    return "The connection to the ethereal plane is weak.";
  }
};