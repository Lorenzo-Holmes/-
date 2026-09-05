const fs = require('fs');
const path = require('path');

const root = __dirname;
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const formal = fs.readFileSync(path.join(root, 'formal-assets.js'), 'utf8');
const dish = fs.readFileSync(path.join(root, 'dish-render-hotfix.js'), 'utf8');

const day1Ingredients = new Set(['egg', 'tomato', 'luncheon_meat', 'milk', 'carrot', 'onion', 'rice']);
const day2Ingredients = new Set(['toast', 'banana', 'apple', 'yogurt', 'cheese', 'sausage', 'cucumber']);
const vectorIngredients = new Set([
  'corn', 'noodles', 'chicken_breast', 'mushroom', 'lettuce', 'potato',
  'cabbage', 'tofu', 'broccoli', 'shrimp', 'spinach'
]);

const day1Dishes = new Set(['te', 'fr', 'me', 'oe']);
const day2Dishes = new Set(['bm', 'ay', 'cst', 'ecs', 'ce']);
const vectorDishes = new Set(['lcr', 'ten', 'cmo', 'ccs', 'pc', 'ct', 'tt', 'cut', 'bs', 'cse', 'se']);

const ingredientIds = [...app.matchAll(/\b([a-z_]+):\['[^']+'\s*,\s*'[^']+'/g)].map(m => m[1]);
const recipeIds = [...app.matchAll(/\b([a-z]+):\['[^']+'\s*,\s*\{/g)].map(m => m[1]);

const knownIngredients = new Set([...day1Ingredients, ...day2Ingredients, ...vectorIngredients]);
const knownDishes = new Set([...day1Dishes, ...day2Dishes, ...vectorDishes]);

const missingIngredients = [...new Set(ingredientIds)].filter(id => !knownIngredients.has(id));
const missingDishes = [...new Set(recipeIds)].filter(id => !knownDishes.has(id));

const assertions = [
  ['formalIngredientVisual fallback order', /ingredientSprite\(id,qty\)\|\|day2IngredientSprite\(id\)\|\|vectorIngredient\(id\)/.test(formal)],
  ['DAY 2 ingredient atlas mapping', /DAY2_ING_SPRITES=\{toast:/.test(formal)],
  ['DAY 3-8 vector ingredient coverage', vectorIngredients.size === 11 && [...vectorIngredients].every(id => formal.includes(`${id}:`))],
  ['DAY 1 dish atlas mapping', /DAY1_DISH_CELLS=\{te:/.test(dish)],
  ['DAY 2 dish atlas mapping', /DAY2_DISH_CELLS=\{bm:/.test(dish)],
  ['DAY 3-8 vector dish coverage', vectorDishes.size === 11 && [...vectorDishes].every(id => dish.includes(`${id}:`))],
  ['No uncovered ingredient IDs', missingIngredients.length === 0],
  ['No uncovered recipe IDs', missingDishes.length === 0],
];

let failed = false;
for (const [name, ok] of assertions) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) failed = true;
}

if (missingIngredients.length) console.error('Missing ingredient art:', missingIngredients.join(', '));
if (missingDishes.length) console.error('Missing dish art:', missingDishes.join(', '));

if (failed) process.exit(1);
console.log('ASSET_COVERAGE_OK');
