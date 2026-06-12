// Jackson-Pollock 7-site body fat calculation
export function calcBodyFat(sites, age, sex) {
  const sum7 = Object.values(sites).reduce((a, b) => a + parseFloat(b || 0), 0);
  let density;
  if (sex === 'male') {
    density = 1.112 - (0.00043499 * sum7) + (0.00000055 * sum7 * sum7) - (0.00028826 * age);
  } else {
    density = 1.097 - (0.00046971 * sum7) + (0.00000056 * sum7 * sum7) - (0.00012828 * age);
  }
  return ((4.95 / density) - 4.5) * 100;
}

// Macro calculator using lean body mass method
export function calcMacros(weightKg, bodyFatPct, goal, activityLevel) {
  const leanMass = weightKg * (1 - bodyFatPct / 100);
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };
  const bmr = 370 + (21.6 * leanMass);
  const tdee = bmr * (multipliers[activityLevel] || 1.55);

  let calories = tdee;
  if (goal === 'cut') calories = tdee - 500;
  else if (goal === 'bulk') calories = tdee + 300;

  const protein = leanMass * 2.2;
  const fat = (calories * 0.25) / 9;
  const carbs = (calories - protein * 4 - fat * 9) / 4;

  return {
    calories: Math.round(calories),
    protein: Math.round(protein),
    fat: Math.round(fat),
    carbs: Math.round(carbs),
    tdee: Math.round(tdee),
  };
}

// Body fat category
export function bfCategory(sex, bf) {
  const maleCats = [
    { max: 6,   label: 'Essential Fat', color: '#0EA5E9' },
    { max: 14,  label: 'Athletic',      color: '#10B981' },
    { max: 18,  label: 'Fitness',       color: '#10B981' },
    { max: 25,  label: 'Average',       color: '#F59E0B' },
    { max: 999, label: 'Obese',         color: '#EF4444' },
  ];
  const femaleCats = [
    { max: 14,  label: 'Essential Fat', color: '#0EA5E9' },
    { max: 21,  label: 'Athletic',      color: '#10B981' },
    { max: 25,  label: 'Fitness',       color: '#10B981' },
    { max: 32,  label: 'Average',       color: '#F59E0B' },
    { max: 999, label: 'Obese',         color: '#EF4444' },
  ];
  const cats = sex === 'male' ? maleCats : femaleCats;
  return cats.find(c => bf < c.max) || cats[cats.length - 1];
}

export function toKg(weight, unit) {
  return unit === 'lbs' ? parseFloat(weight) * 0.453592 : parseFloat(weight);
}
