// server/app.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { analyzeWithPrompt } from "./analysis.js";

const app = express();
const PORT = 3000;

// 中间件配置
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // 允许访问前端页面

// 分析接口 POST /analyze
app.post("/analyze", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ success: false, message: "输入内容不能为空" });
    }

    // 调用分析函数
    const resultRaw = await analyzeWithPrompt(text);

    // 判断是否为JSON格式（人格指数部分）
    let result = resultRaw;
    try {
      const parsed = JSON.parse(resultRaw);
      result = parsed; // 成功解析为JSON对象
    } catch (err) {
      // 非JSON返回（比如是综合评语），就直接返回文本
    }

    return res.json({ success: true, result });

  } catch (err) {
    console.error("接口处理错误:", err);
    return res.status(500).json({ success: false, message: "服务器内部错误", error: err.message });
  }
});

// 启动服务
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
