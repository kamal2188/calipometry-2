import React, { useState } from 'react';
import { Card, Button, Label, MacroPill, NoClient, Spinner, colors, styles } from '../components/ui';
import { TESCO_FOODS } from '../data/foods';
import { generateBudgetPlan } from '../utils/api';

export default function BudgetPage({ activeClient, showToast }) {
  const [budget, setBudget] = useState('50');
  const [days, setDays] = useState('7');
  const [cheapFoods, setCheapFoods] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const macros = activeClient?.macros;
  const dailyAllowance = (parseFloat(budget || 0) / parseFloat(days || 1)).toFixed(2);

  if (!activeClient) return <NoClient onGoToClients={() => {}} />;

  const handleFindCheap = () => {
    const scored = TESCO_FOODS.map(f => {
      const costPer100g = (f.price / f.unitWeight) * 100;
      const proteinPerPenny = f.protein / costPer100g;
      return { ...f, costPer100g, proteinPerPenny };
    }).sort((a, b) => b.proteinPerPenny - a.proteinPerPenny);
    setCheapFoods(scored.slice(0, 8));
  };

  const handleGeneratePlan = async () => {
    if (!macros) { showToast('Set macros first'); return; }
    setLoading(true);
    setAiResult(null);
    try {
      const plan = await generateBudgetPlan(macros, dailyAllowance, activeClient.goal);
      setAiResult(plan);
    } catch (e) {
      showToast('Error generating plan — try again');
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: colors.text, marginBottom: 3, letterSpacing: '-0.5px' }}>Budget Planner</h1>
      <p style={{ fontSize: 13, color: colors.muted, marginBottom: 16 }}>
        {activeClient.name} {macros ? `· ${macros.calories} kcal target` : '· Set macros first'}
      </p>

      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <Label>Weekly budget (£)</Label>
            <input type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="50" style={styles.input} />
          </div>
          <div>
            <Label>Number of days</Label>
            <select value={days} onChange={e => setDays(e.target.value)} style={styles.input}>
              <option value="7">7 days</option>
              <option value="5">5 days</option>
              <option value="3">3 days</option>
              <option value="1">1 day</option>
            </select>
          </div>
        </div>

        <div style={{ background: colors.tealLight, border: `1px solid ${colors.tealBorder}`, borderRadius: 10, padding: '10px 14px', marginBottom: 14, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: colors.teal }}>Daily allowance</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 800, color: colors.teal, fontSize: 15 }}>£{dailyAllowance}/day</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Button variant="outline" onClick={handleFindCheap}>Best value foods</Button>
          <Button onClick={handleGeneratePlan} disabled={!macros || loading}>
            {loading ? 'Planning...' : 'AI Budget Plan'}
          </Button>
        </div>
      </Card>

      {cheapFoods && (
        <Card>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: colors.text }}>💰 Best value for protein</div>
          <p style={{ fontSize: 12, color: colors.muted, marginBottom: 12 }}>Ranked by protein per penny — Tesco prices</p>
          {cheapFoods.map((food, i) => (
            <div key={food.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < cheapFoods.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
              <div>
                <div style={{ fontSize: 14, color: colors.text }}>{food.emoji} {food.name}</div>
                <div style={{ fontSize: 12, color: colors.muted }}>{food.protein}g protein per 100g</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: colors.teal, fontFamily: "'DM Mono', monospace" }}>£{food.price.toFixed(2)}</div>
                <div style={{ fontSize: 11, color: colors.faint }}>{food.unitWeight}g unit</div>
              </div>
            </div>
          ))}
        </Card>
      )}

      {loading && <Spinner />}

      {aiResult && (
        <Card>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3, color: colors.text }}>🤖 AI Budget Meal Plan</div>
          <div style={{ fontSize: 13, color: colors.teal, fontWeight: 700, marginBottom: 14 }}>
            £{aiResult.dailyBudget}/day · Est. total: {aiResult.totalWeeklyCost}
          </div>

          {aiResult.meals?.map((meal, i) => (
            <div key={i} style={{ marginBottom: 13 }}>
              <div style={{ fontWeight: 700, fontSize: 14, display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: colors.text }}>
                <span>{meal.name}</span>
                <span style={{ color: colors.teal, fontFamily: "'DM Mono', monospace" }}>{meal.mealCost}</span>
              </div>
              {meal.foods.map((f, j) => (
                <div key={j} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 10px', background: '#F8FAFC', borderRadius: 8, marginBottom: 3, fontSize: 13 }}>
                  <span style={{ color: colors.text }}>{f.item} <span style={{ color: colors.faint }}>· {f.amount}</span></span>
                  <span style={{ color: colors.teal, fontFamily: "'DM Mono', monospace", fontSize: 12 }}>{f.cost}</span>
                </div>
              ))}
            </div>
          ))}

          {aiResult.weeklyShoppingList?.length > 0 && (
            <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 14, marginTop: 4 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, marginBottom: 10 }}>🛒 Tesco Shopping List</div>
              {aiResult.weeklyShoppingList.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < aiResult.weeklyShoppingList.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: colors.teal, textDecoration: 'none', fontWeight: 500 }}>
                    🔗 {item.item}
                  </a>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 700, color: colors.text }}>{item.cost}</span>
                </div>
              ))}
              {aiResult.tips && (
                <div style={{ marginTop: 10, padding: '10px 13px', background: colors.tealLight, borderRadius: 9, fontSize: 13, color: colors.teal }}>
                  💡 {aiResult.tips}
                </div>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
