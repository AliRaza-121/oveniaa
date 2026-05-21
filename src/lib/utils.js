export const categoryEmoji = {
  'Specials Pizza': '🍕',
  'Traditionals Pizza': '🍕',
  "Creamy Pizza's": '🍕',
  'Squares': '🍕',
  'Crust': '🧀',
  'Sandwiches': '🥪',
  "Pasta's": '🍝',
  'Starters': '🥟',
  'Fries': '🍟',
  'Fried': '🍗',
  'Wings': '🍗',
  'Burger Zone': '🍔',
  'Grill Burgers': '🍔',
  'Platters': '🍱',
  'Cheese Rolls': '🌯',
  'Shawarma': '🌯',
  'Paratha Rolls': '🌯',
  'Wrap': '🌯',
  'Sweets': '🍰',
  'Drinks': '🥤',
  'Deals': '🎉'
}

export const getCategoryEmoji = (cat) => categoryEmoji[cat] || '📦'
