export const TESCO_FOODS = [
  // Protein
  { id: 1,  name: 'Chicken Breast',    category: 'Protein', price: 3.50, unitWeight: 500,  kcal: 165, protein: 31,   carbs: 0,    fat: 3.6,  emoji: '🍗' },
  { id: 2,  name: 'Tuna (tinned)',      category: 'Protein', price: 0.89, unitWeight: 145,  kcal: 116, protein: 25.5, carbs: 0,    fat: 1.0,  emoji: '🐟' },
  { id: 3,  name: 'Eggs (6 pack)',      category: 'Protein', price: 1.89, unitWeight: 330,  kcal: 155, protein: 13,   carbs: 1.1,  fat: 11,   emoji: '🥚' },
  { id: 4,  name: 'Salmon Fillet',      category: 'Protein', price: 4.50, unitWeight: 300,  kcal: 208, protein: 20,   carbs: 0,    fat: 13,   emoji: '🐟' },
  { id: 5,  name: 'Greek Yogurt',       category: 'Protein', price: 1.50, unitWeight: 500,  kcal: 97,  protein: 10,   carbs: 4,    fat: 5,    emoji: '🥛' },
  { id: 6,  name: 'Cottage Cheese',     category: 'Protein', price: 1.20, unitWeight: 300,  kcal: 98,  protein: 11,   carbs: 4,    fat: 4,    emoji: '🧀' },
  { id: 7,  name: 'Turkey Mince',       category: 'Protein', price: 2.80, unitWeight: 500,  kcal: 170, protein: 22,   carbs: 0,    fat: 9,    emoji: '🦃' },
  { id: 8,  name: 'Quorn Mince',        category: 'Protein', price: 2.50, unitWeight: 500,  kcal: 92,  protein: 14,   carbs: 5,    fat: 2,    emoji: '🌿' },
  // Carbs
  { id: 9,  name: 'Basmati Rice',       category: 'Carbs',   price: 1.80, unitWeight: 1000, kcal: 130, protein: 2.7,  carbs: 28,   fat: 0.3,  emoji: '🍚' },
  { id: 10, name: 'Oats',               category: 'Carbs',   price: 1.10, unitWeight: 1000, kcal: 374, protein: 13,   carbs: 66,   fat: 7,    emoji: '🌾' },
  { id: 11, name: 'Sweet Potato',       category: 'Carbs',   price: 1.20, unitWeight: 1000, kcal: 86,  protein: 1.6,  carbs: 20,   fat: 0.1,  emoji: '🍠' },
  { id: 12, name: 'Brown Bread',        category: 'Carbs',   price: 1.10, unitWeight: 800,  kcal: 229, protein: 8,    carbs: 44,   fat: 3,    emoji: '🍞' },
  { id: 13, name: 'Pasta (Dried)',      category: 'Carbs',   price: 0.85, unitWeight: 500,  kcal: 355, protein: 12,   carbs: 71,   fat: 2,    emoji: '🍝' },
  { id: 14, name: 'New Potatoes',       category: 'Carbs',   price: 1.00, unitWeight: 750,  kcal: 70,  protein: 1.8,  carbs: 15,   fat: 0.1,  emoji: '🥔' },
  // Veg & Fruit
  { id: 15, name: 'Broccoli',           category: 'Veg',     price: 0.65, unitWeight: 400,  kcal: 34,  protein: 2.8,  carbs: 7,    fat: 0.4,  emoji: '🥦' },
  { id: 16, name: 'Spinach',            category: 'Veg',     price: 0.90, unitWeight: 200,  kcal: 23,  protein: 2.9,  carbs: 3.6,  fat: 0.4,  emoji: '🥬' },
  { id: 17, name: 'Mixed Salad',        category: 'Veg',     price: 0.85, unitWeight: 120,  kcal: 15,  protein: 1.2,  carbs: 2,    fat: 0.2,  emoji: '🥗' },
  { id: 18, name: 'Banana',             category: 'Fruit',   price: 0.15, unitWeight: 120,  kcal: 89,  protein: 1.1,  carbs: 23,   fat: 0.3,  emoji: '🍌' },
  { id: 19, name: 'Blueberries',        category: 'Fruit',   price: 2.00, unitWeight: 150,  kcal: 57,  protein: 0.7,  carbs: 14,   fat: 0.3,  emoji: '🫐' },
  // Fats & Dairy
  { id: 20, name: 'Avocado',            category: 'Fats',    price: 0.89, unitWeight: 150,  kcal: 160, protein: 2,    carbs: 9,    fat: 15,   emoji: '🥑' },
  { id: 21, name: 'Olive Oil',          category: 'Fats',    price: 3.50, unitWeight: 500,  kcal: 824, protein: 0,    carbs: 0,    fat: 91,   emoji: '🫙' },
  { id: 22, name: 'Peanut Butter',      category: 'Fats',    price: 2.20, unitWeight: 340,  kcal: 597, protein: 25,   carbs: 14,   fat: 50,   emoji: '🥜' },
  { id: 23, name: 'Whole Milk',         category: 'Dairy',   price: 1.35, unitWeight: 1000, kcal: 61,  protein: 3.3,  carbs: 4.7,  fat: 3.3,  emoji: '🥛' },
  { id: 24, name: 'Cheddar Cheese',     category: 'Dairy',   price: 2.50, unitWeight: 400,  kcal: 403, protein: 25,   carbs: 0.1,  fat: 34,   emoji: '🧀' },
];

export const FOOD_CATEGORIES = [...new Set(TESCO_FOODS.map(f => f.category))];
