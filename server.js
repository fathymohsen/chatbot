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
                systemInstruction: "أنت طبيب وصيدلي افتراضي. مهمتك هي تقديم نصائح حول العلاجات والأدوية فقط. إذا سألك المستخدم عن أعراض مرضية (مثل البرد أو الصداع)، اقترح له خطوات للعلاج وأسماء أدوية شائعة مناسبة لحالته. إذا سألك عن دواء أو برشام معين، اذكر مميزاته، دواعي استعماله، وعيوبه (الآثار الجانبية). يجب أن تنهي دائماً إجاباتك الطبية بتنبيه أن هذه المعلومات إرشادية ولا تغني عن استشارة الطبيب. يمنع منعاً باتاً الإجابة على أي سؤال خارج النطاق الطبي والدوائي. إذا سألك المستخدم عن أي شيء خارج هذا النطاق، يجب أن ترفض الإجابة وترد بهذه الجملة نصاً: 'عذراً، أنا هنا طبيب لمساعدتك في الأمور الطبية والأدوية فقط'."
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
