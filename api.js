const API_URL = 'https://api.anthropic.com/v1/messages';
const API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY;

async function callClaude(prompt) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content.map(b => b.text || '').join('');
  return text.replace(/```json|```/g, '').trim();
}

export async function generateMealPlan(macros, goal) {
  const prompt = `Create a 1-day meal plan for someone with these targets: ${macros.calories} kcal, ${macros.protein}g protein, ${macros.carbs}g carbs, ${macros.fat}g fat. Goal: ${goal || 'maintain'}.
Use only foods commonly available at Tesco UK. Format your response as JSON only with this exact structure:
{"meals":[{"name":"Breakfast","foods":[{"item":"Food name","amount":"150g","kcal":200,"protein":20,"carbs":15,"fat":5}],"totalKcal":200}],"dailyTotals":{"kcal":0,"protein":0,"carbs":0,"fat":0}}
Return ONLY the JSON, no other text.`;

  const text = await callClaude(prompt);
  return JSON.parse(text);
}

export async function generateBudgetPlan(macros, dailyBudget, goal) {
  const prompt = `Create a budget meal plan for someone with £${dailyBudget}/day. Macro targets: ${macros.calories} kcal, ${macros.protein}g protein, ${macros.carbs}g carbs, ${macros.fat}g fat. Goal: ${goal || 'maintain'}.
Only use Tesco UK foods. Be very cost-conscious and realistic with prices.
Format as JSON only with this exact structure:
{"dailyBudget":"${dailyBudget}","meals":[{"name":"Breakfast","foods":[{"item":"Food","amount":"100g","cost":"£0.30"}],"mealCost":"£0.50"}],"weeklyShoppingList":[{"item":"Chicken Breast 500g","cost":"£3.50","url":"https://www.tesco.com/groceries/en-GB/search?query=chicken+breast"}],"totalWeeklyCost":"£XX.XX","tips":"One practical budget tip"}
Return ONLY the JSON.`;

  const text = await callClaude(prompt);
  return JSON.parse(text);
}
