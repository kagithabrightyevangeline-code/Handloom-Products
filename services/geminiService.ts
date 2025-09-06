import { GoogleGenAI, Type } from "@google/genai";
import { Design, MatchResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generatePitchForDesign(design: Design, weaverEmail: string | null): Promise<string> {
  const prompt = `
    You are a business development expert specializing in connecting artisanal creators with large e-commerce platforms like Amazon, Etsy, and Myntra.

    A handloom weaver has created the following design. Your task is to write a compelling and professional business pitch to a potential corporate buyer.

    The pitch should be concise, persuasive, and structured into the following sections with clear headings (using markdown for bolding):
    1.  **Subject Line:** An engaging subject for an email.
    2.  **Introduction:** Briefly introduce the unique handloom design.
    3.  **Key Selling Points:** Highlight what makes this design special (e.g., traditional techniques, unique patterns, cultural significance, high-quality materials).
    4.  **Market Opportunity:** Explain why this design would appeal to the target company's customer base.
    5.  **Call to Action:** A clear next step, like suggesting a meeting to discuss collaboration. If a contact email is provided below, include it in the call to action as the primary contact method.

    Here are the details of the design:
    - **Design Name:** ${design.name}
    - **Description:** ${design.description}
    - **Materials Used:** ${design.materials}
    - **Weaver's Contact Email:** ${weaverEmail || 'Not Provided'}

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

export async function analyzeCustomerRequest(
  customerRequest: string,
  designs: Design[]
): Promise<MatchResult> {
  const designSummaries = designs.map(d => ({
    id: d.id,
    name: d.name,
    description: d.description,
    materials: d.materials,
  }));

  const prompt = `
    You are an AI expert in the handloom and artisan textile industry. Your task is to act as a matchmaker between a potential buyer's request and a weaver's collection of designs.

    Here is the buyer's request:
    "${customerRequest}"

    Here is the weaver's collection of available designs:
    ${JSON.stringify(designSummaries, null, 2)}

    Please analyze the buyer's request and the weaver's designs. Your goal is to identify the single best match from the collection.

    After identifying the best match, provide:
    1.  A brief justification for why it's the best match.
    2.  Recommend 2-3 suitable online e-commerce platforms (like Etsy, Amazon Handmade, Novica, The India Craft House, etc.) where this specific design could sell well, and explain why each platform is a good fit.

    Your response must be in JSON format.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      matchedDesignId: {
        type: Type.STRING,
        description: 'The ID of the best matching design from the provided list.',
      },
      justification: {
        type: Type.STRING,
        description: "A brief explanation of why this design is the best match for the customer's request.",
      },
      platformRecommendations: {
        type: Type.ARRAY,
        description: 'A list of recommended e-commerce platforms.',
        items: {
          type: Type.OBJECT,
          properties: {
            platformName: {
              type: Type.STRING,
              description: 'The name of the e-commerce platform.',
            },
            reason: {
              type: Type.STRING,
              description: 'A brief reason why this platform is suitable for the matched design.',
            },
          },
        },
      },
    },
    required: ['matchedDesignId', 'justification', 'platformRecommendations'],
  };
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as MatchResult;
  } catch (error) {
    console.error("Error analyzing customer request:", error);
    throw new Error("Failed to analyze request with Gemini API. Please check the console for more details.");
  }
}