import { useStore } from '@nanostores/react'

import { cartCount, cartOpen } from '../stores/cart'

export default function CartButton() {
  const count = useStore(cartCount)
  const open = useStore(cartOpen)

  return (
    <button
      aria-label="Abrir carrito"
      className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-rose-100"
      onClick={() => { cartOpen.set(!open) }}
    >
      <svg
        className="h-5 w-5 text-brownie-700"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
      >
        <path
          d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line strokeLinecap="round" strokeLinejoin="round" x1="3" x2="21" y1="6" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brownie-700 text-[11px] font-semibold text-white">
          {count}
        </span>
      )}
    </button>
  )
}
