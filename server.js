import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(express.json()); 
app.use(cors()); 

// تأكد إنك تحط مفتاح جيميناي بتاعك بين علامتين التنصيص هنا
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message; 

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userMessage,
            config: {
                systemInstruction: "أنت مساعد طبي وخدمي مخصص فقط لإرشاد المستخدمين لأقرب مستشفى، عيادة، أو صيدلية بناءً على عناوينهم. يمنع منعاً باتاً الإجابة على أي أسئلة خارج هذا التخصص (مثل البرمجة، الرياضة، الطبخ، التاريخ، إلخ). إذا سألك المستخدم عن أي شيء خارج تخصصك الطبي والمكاني، اعتذر بلطف وأخبره أنك مبرمج فقط للمساعدة في العثور على الخدمات الطبية."
            }
        });
        
        res.json({ reply: response.text }); 
 } catch (error) {
        // الخدعة: هنخلي السيرفر يبعت رسالة الخطأ كأنها رد من البوت عشان نقراها بسهولة!
        res.json({ reply: "سبب المشكلة من جوجل هو: " + error.message });
    }
});

// الجزء ده اللي بيخلي السيرفر يفضل شغال وميقفلش
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`السيرفر شغال على بورت ${PORT}...`);
});
