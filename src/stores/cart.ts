import { atom, computed } from 'nanostores'

export interface CartItem {
  description: string
  emoji: string
  id: string
  name: string
  price: number
  quantity: number
}

export const cartItems = atom<CartItem[]>([])
export const cartOpen = atom(false)

export const cartCount = computed(cartItems, (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0),
)

export const cartTotal = computed(cartItems, (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0),
)

export function addToCart(product: Omit<CartItem, 'quantity'>): void {
  const current = cartItems.get()
  const existing = current.find((item) => item.id === product.id)
  if (existing) {
    cartItems.set(
      current.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    )
  } else {
    cartItems.set([...current, { ...product, quantity: 1 }])
  }
  cartOpen.set(true)
}

export function removeFromCart(id: string): void {
  cartItems.set(cartItems.get().filter((item) => item.id !== id))
}

export function updateQuantity(id: string, delta: number): void {
  const current = cartItems.get()
  const item = current.find((i) => i.id === id)
  if (!item) return
  const next = item.quantity + delta
  if (next <= 0) {
    removeFromCart(id)
  } else {
    cartItems.set(current.map((i) => (i.id === id ? { ...i, quantity: next } : i)))
  }
}

export function clearCart(): void {
  cartItems.set([])
  cartOpen.set(false)
}

export function buildWhatsAppUrl(items: CartItem[], total: number, phone: string): string {
  const lines = items
    .map(
      (item) =>
        `• ${item.name} ×${item.quantity} — $${(item.price * item.quantity).toLocaleString('es-MX')}`,
    )
    .join('\n')

  const message = [
    '¡Hola! Me gustaría hacer el siguiente pedido 🍫',
    '',
    lines,
    '',
    `*Total: $${total.toLocaleString('es-MX')} MXN*`,
    '',
    '¿Cuándo podría estar listo? 😊',
  ].join('\n')

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
