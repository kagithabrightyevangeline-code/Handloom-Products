
import { GoogleGenAI } from "@google/genai";
import { Design } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generatePitchForDesign(design: Design): Promise<string> {
  const prompt = `
    You are a business development expert specializing in connecting artisanal creators with large e-commerce platforms like Amazon, Etsy, and Myntra.

    A handloom weaver has created the following design. Your task is to write a compelling and professional business pitch to a potential corporate buyer.

    The pitch should be concise, persuasive, and structured into the following sections with clear headings (using markdown for bolding):
    1.  **Subject Line:** An engaging subject for an email.
    2.  **Introduction:** Briefly introduce the unique handloom design.
    3.  **Key Selling Points:** Highlight what makes this design special (e.g., traditional techniques, unique patterns, cultural significance, high-quality materials).
    4.  **Market Opportunity:** Explain why this design would appeal to the target company's customer base.
    5.  **Call to Action:** A clear next step, like suggesting a meeting to discuss collaboration.

    Here are the details of the design:
    - **Design Name:** ${design.name}
    - **Description:** ${design.description}
    - **Materials Used:** ${design.materials}

    Analyze the provided image of the design to inform your description and selling points. Make the tone professional, respectful, and confident.
  `;

  try {
    const imagePart = {
      inlineData: {
        mimeType: design.imageMimeType,
        data: design.image,
      },
    };
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating pitch:", error);
    throw new Error("Failed to generate pitch from Gemini API. Please check the console for more details.");
  }
}
