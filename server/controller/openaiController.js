import dotenv from 'dotenv';
dotenv.config();

//import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
const client=new GoogleGenerativeAI(process.env.OPENAI_API_KEY);

export const getChatResponse=async(req,res)=>{
    try {
        const {message}=req.body;
        if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt=`You are a medical triage assistant for a hospital website.
Based on the patient's symptoms, respond ONLY with valid JSON, no markdown, no code fences, in this exact shape:
{
  "department": "string - the hospital department",
  "specialization": "string - the doctor specialization",
  "message": "string - a short friendly reply explaining why"
}

Patient symptoms: "${message}"
`;
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(text);

    res.json({ success: true, reply: {
      department: parsed.department,
        specialization: parsed.specialization,
        message: parsed.message,
    } });
     }
     catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI request failed' });
  }
}