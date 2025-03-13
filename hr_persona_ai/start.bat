bat_content = """@echo off
echo 正在启动 AI个性化报告引擎 后端服务...
cd /d %~dp0
npm install
pause
start http://localhost:3000
npm start
"""

bat_path = "/mnt/data/hr_persona_ai_start.bat"

with open(bat_path, "w", encoding="utf-8") as f:
    f.write(bat_content)

bat_path
