import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(express.json()); // عشان السيرفر يفهم البيانات اللي جاية من الموقع
app.use(cors()); // عشان نسمح للموقع بتاعك يكلم السيرفر

// حط مفتاح الـ API بتاعك هنا
const ai = new GoogleGenAI({ apiKey: 'AIzaSyCuRL2fckWvLbzzUKOCA9HMrC3tqf35YtY' });

// هنا بنعمل الرابط اللي الموقع هيكلمه
app.post('/api/chat', async (req, res) => {
    // 1. بناخد الرسالة اللي اليوزر كتبها في الموقع
    const userMessage = req.body.message; 

    try {
        // 2. بنبعتها لجيميناي
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userMessage,
        });
        
        // 3. بنرجع رد جيميناي للموقع بتاعك
        res.json({ reply: response.text }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

// تشغيل السيرفر
app.listen(3000, () => {
    console.log('السيرفر شغال على بورت 3000...');
});