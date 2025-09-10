import dotenv from 'dotenv';
dotenv.config();

import OpenAI from 'openai';

const client=new OpenAI({
    apiKey:process.env.OPENAI_API_KEY
})

export const getChatResponse=async(req,res)=>{
    try {
        const {message}=req.body;
        const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            `You are a medical assistant. Based on the user's symptoms:

1. Suggest the hospital department (e.g., Cardiology, Neurology, Dermatology).
2. Suggest the specialization (e.g., Cardiologist, Neurologist, Dermatologist).
3. Provide a short message to display to the user.

Respond ONLY in JSON format like this:
{
  "department": "Cardiology",
  "specialization": "Cardiologist",
  "message": "Based on your symptoms, you should consult a cardiologist."
}`,
        },
        { role: "user", content: message },
      ],
     });
    let aiReply;
    try {
      aiReply = JSON.parse(completion.choices[0].message.content);
    } catch {
      aiReply = {
        department: null,
        specialization: null,
        message: completion.choices[0].message.content
      };
    }  
    res.json({success:true, reply: aiReply });
    } catch (error) {
        res.json({ success:false,error: error.message })
    }
}