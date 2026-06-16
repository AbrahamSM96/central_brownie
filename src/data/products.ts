export interface Product {
  category: 'brownies' | 'cheesecakes' | 'cupcakes' | 'galletas' | 'pasteles'
  description: string
  emoji: string
  featured: boolean
  fromColor: string
  id: string
  imageUrl?: string
  name: string
  price: number
  toColor: string
}

export const categories = [
  { emoji: '🍫', id: 'brownies', label: 'Brownies' },
  { emoji: '🧁', id: 'cupcakes', label: 'Cupcakes y Donas' },
  { emoji: '🎂', id: 'pasteles', label: 'Pasteles' },
  { emoji: '🍰', id: 'cheesecakes', label: 'Cheesecakes' },
  { emoji: '🍪', id: 'galletas', label: 'Galletas' },
] as const

export type CategoryId = (typeof categories)[number]['id']

// Fallback products shown when the Google Sheet is unavailable
export const mockProducts: Product[] = [
  {
    category: 'brownies',
    description: 'Húmedo por dentro, crujiente por fuera. El clásico irresistible.',
    emoji: '🍫',
    featured: true,
    fromColor: '#3d1f0d',
    id: 'brownies-6',
    imageUrl: '/productos/caja-brownies.jpg',
    name: 'Caja Brownies 6 pzs',
    price: 210,
    toColor: '#78350f',
  },
  {
    category: 'brownies',
    description: '8 mini brownies con toppings a elegir.',
    emoji: '🍫',
    featured: true,
    fromColor: '#3d1f0d',
    id: 'mini-brownies-8',
    imageUrl: '/productos/mini-brownies.jpg',
    name: 'Caja Mini Brownies 8 pzs',
    price: 115,
    toColor: '#6b3a22',
  },
  {
    category: 'brownies',
    description: 'Pizza brownie con toppings — 6 rebanadas.',
    emoji: '🍕',
    featured: true,
    fromColor: '#78350f',
    id: 'pizza-brownie-6',
    imageUrl: '/productos/pizza-brownie.jpg',
    name: 'Pizza Brownie 6 rebanadas',
    price: 245,
    toColor: '#b45309',
  },
  {
    category: 'cheesecakes',
    description: '4 cheesecakes individuales a elegir sabor.',
    emoji: '🍰',
    featured: true,
    fromColor: '#fef3c7',
    id: 'cheesecake-4',
    imageUrl: '/productos/mini-cheesecake-individual.jpg',
    name: 'Caja Cheesecake 4 pzs',
    price: 175,
    toColor: '#fef9c3',
  },
  {
    category: 'cupcakes',
    description: '4 cupcakes con toppings en domo decorativo.',
    emoji: '🧁',
    featured: true,
    fromColor: '#fce7f3',
    id: 'cupcakes-toppings-4',
    imageUrl: '/productos/cupcakes-toppings.jpg',
    name: 'Domo Cupcakes 4 pzs',
    price: 240,
    toColor: '#fbcfe8',
  },
  {
    category: 'pasteles',
    description: 'Mini cake con bizcocho y relleno a elegir.',
    emoji: '🎂',
    featured: false,
    fromColor: '#fce7f3',
    id: 'mini-cake',
    imageUrl: '/productos/mini-cake.jpg',
    name: 'Mini Cake 1-2 personas',
    price: 140,
    toColor: '#fbcfe8',
  },
  {
    category: 'galletas',
    description: '4 galletas con foto personalizada tipo Polaroid.',
    emoji: '📸',
    featured: false,
    fromColor: '#fef9c3',
    id: 'galletas-polaroid-4',
    imageUrl: '/productos/galletas-foto.jpg',
    name: 'Caja Galletas Tipo Polaroid 4 pzs',
    price: 240,
    toColor: '#fffbeb',
  },
  {
    category: 'galletas',
    description: '16 mini big cookies con chispas y granillo.',
    emoji: '🍪',
    featured: false,
    fromColor: '#fcd34d',
    id: 'big-cookie-16',
    imageUrl: '/productos/caja-big-cookie.jpg',
    name: 'Caja Big Cookie 16 minis',
    price: 190,
    toColor: '#fef08a',
  },
]
