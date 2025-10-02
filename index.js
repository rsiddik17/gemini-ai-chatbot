import express from 'express';
import cors from  'cors';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

// initialization
const app = express();
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

// middleware
app.use(express.json());
app.use(cors());
// app.use(multer());

// endpoint

app.post('/chat', async (req, res) => {
    const { body } = req;
    const { prompt } = body;

    if(!prompt || typeof prompt !== 'string') {
        res.status(400).json({
            message: "prompt must be filled in and is a string",
            data: null,
            success: false
        });

        return;
    }

    try {
        const aiResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    parts: [
                        {text: prompt}
                    ]
                }
            ]
        })

        res.status(200).json({
            success: true,
            data: aiResponse.text,
            message: 'successfully responded to by Google Gemini'
        })
    } catch(e) {
        console.log(e);
        res.status(500).json({
            success: false,
            data: null,
            message: e.message || 'there is a problem on the server'
        })
    }
} )


app.listen(3000, () => {
    console.log(`server running on 3000`)
}) 