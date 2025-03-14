// server/analysis.js
import OpenAI from "openai";

// DeepSeek API配置
const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: "<Deepseek_API_Key_Here>", // 你自己的Key; Your own Deepseek API Key Here
});

/**
 * 调用LLM模型进行分析
 * @param {string} prompt 用户输入的完整prompt
 * @returns {Promise<string>} GPT返回的结果内容（可能是JSON或文字）
 */
export async function analyzeWithPrompt(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "你是一个专业的语言分析助手，请严格根据提示结构返回内容。" },
        { role: "user", content: prompt }
      ],
    });

    return completion.choices[0].message.content;
  } catch (err) {
    console.error("分析调用失败：", err);
    throw new Error("模型调用异常，请稍后重试。");
  }
}
