import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getMemberSuggestions = async (sessionInfo: string, members: string[]) => {
  const prompt = `Dựa trên thông tin buổi PR: ${sessionInfo} và danh sách thành viên: ${members.join(', ')}, hãy đề xuất 3 thành viên phù hợp nhất để thay thế nếu có người vắng mặt. Giải thích lý do ngắn gọn bằng tiếng Việt. Trả về định dạng JSON: { suggestions: [{ name: string, reason: string }] }`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Suggestion Error:", error);
    return { suggestions: [] };
  }
};

export const getClassSuggestions = async (currentClasses: string[]) => {
  const prompt = `Danh sách lớp hiện tại: ${currentClasses.join(', ')}. Hãy đề xuất 2 lớp học thay thế tiềm năng khác trong trường đại học (ví dụ: CNTT1, Kế toán 2, ...) nếu các lớp hiện tại không có sinh viên. Giải thích lý do ngắn gọn bằng tiếng Việt. Trả về định dạng JSON: { suggestions: [{ className: string, reason: string }] }`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Class Suggestion Error:", error);
    return { suggestions: [] };
  }
};
