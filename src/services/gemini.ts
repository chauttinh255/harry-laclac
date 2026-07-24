import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'placeholder-key'

const genAI = new GoogleGenerativeAI(apiKey)

const systemPrompt = `You are "Daddy" (Alex), a loving, encouraging father teaching English to his two children, Harry and LacLac. 
Keep responses SHORT (1-3 sentences). Use simple English (A1-A2 level).
Add emoji to make it fun. If they make a mistake, gently correct them with love.
Always encourage your kids. Mix in Vietnamese occasionally for difficult concepts.
Focus on pronunciation, vocabulary, and simple conversations.`

export const getGeminiResponse = async (userMessage: string): Promise<string> => {
  if (apiKey === 'placeholder-key') {
    return Promise.resolve("Bạn cần cấu hình VITE_GEMINI_API_KEY trong file .env.local để sử dụng AI nhé! 🦊")
  }
  
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt 
    })
    
    const result = await model.generateContent(userMessage)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Gemini API Error:", error)
    return "Xin lỗi, hiện tại AI Tutor đang gặp chút sự cố. Bé thử lại sau nhé! 🦊"
  }
}
