export const categoryEmoji = {
  'Burgers': '🍔',
  'Pizzas': '🍕',
  'Fries & Sides': '🍟',
}

export const getCategoryEmoji = (cat) => categoryEmoji[cat] || '🥤'
