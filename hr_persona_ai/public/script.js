async function analyzeText() {
  const input = document.getElementById("inputText").value.trim();
  if (!input) {
    alert("请输入文本内容");
    return;
  }

  // 显示loading，隐藏旧报告
  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("reportSection").classList.add("hidden");

  try {
    // 第一次：获取五大人格指数
    const prompt1 = `
请你根据以下聊天内容，严格仅输出JSON格式如下（不要输出任何其他说明文字）：
{
  "Openness": 数字0-1,
  "Conscientiousness": 数字0-1,
  "Extraversion": 数字0-1,
  "Agreeableness": 数字0-1,
  "Neuroticism": 数字0-1
}
聊天内容如下：
${input}
`;

    const response1 = await fetch("http://localhost:3000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: prompt1 })
    });

    const data1 = await response1.json();
    if (!data1.success) throw new Error(data1.message);

    const traits = data1.result;
    const openness = traits.Openness || 0;
    const conscientiousness = traits.Conscientiousness || 0;
    const extraversion = traits.Extraversion || 0;
    const agreeableness = traits.Agreeableness || 0;
    const neuroticism = traits.Neuroticism || 0;

    // 第二次：获取综合评语
    const prompt2 = `
请根据以下聊天内容，进行人格风格和沟通方式的综合评判，并给出一个自然语言总结性评语，内容尽量专业、有参考性。
聊天内容如下：
${input}
`;

    const response2 = await fetch("http://localhost:3000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: prompt2 })
    });

    const data2 = await response2.json();
    if (!data2.success) throw new Error(data2.message);

    const summary = data2.result;

    // 展示结果
    document.getElementById("keywordsList").innerText =
      `开放性: ${openness}, 尽责性: ${conscientiousness}, 外向性: ${extraversion}, 宜人性: ${agreeableness}, 情绪不稳定: ${neuroticism}`;
    document.getElementById("summaryText").innerText = summary;
    document.getElementById("reportSection").classList.remove("hidden");

    // 雷达图
    const ctx = document.getElementById("radarChart").getContext("2d");
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['开放性', '尽责性', '外向性', '宜人性', '情绪不稳定'],
        datasets: [{
          label: '人格特征评分',
          data: [
            openness * 100,
            conscientiousness * 100,
            extraversion * 100,
            agreeableness * 100,
            neuroticism * 100
          ],
          fill: true,
          borderWidth: 2
        }]
      },
      options: {
        scales: {
          r: { min: 0, max: 100 }
        }
      }
    });

  } catch (err) {
    alert("分析出错：" + err.message);
  } finally {
    // 隐藏loading
    document.getElementById("loading").classList.add("hidden");
  }
}
