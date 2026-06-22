import { useEffect, useRef } from 'react'

import { useStore } from '@nanostores/react'

import { WHATSAPP_NUMBER } from '../config'
import {
  buildWhatsAppUrl,
  cartItems,
  cartOpen,
  cartTotal,
  clearCart,
  removeFromCart,
  updateQuantity,
} from '../stores/cart'

export default function CartSidebar() {
  const items = useStore(cartItems)
  const open = useStore(cartOpen)
  const total = useStore(cartTotal)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<Element | null>(null)

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement
      closeButtonRef.current?.focus()
    } else {
      if (triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus()
      }
      triggerRef.current = null
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        cartOpen.set(false)
        return
      }
      if (e.key !== 'Tab') return

      const aside = closeButtonRef.current?.closest('aside')
      if (!aside) return
      const focusable = aside.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => { document.removeEventListener('keydown', handleKeyDown) }
  }, [open])

  function handleWhatsApp() {
    const url = buildWhatsAppUrl(items, total, WHATSAPP_NUMBER)
    window.open(url, '_blank')
  }

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-brownie-900/30 backdrop-blur-sm"
          onClick={() => { cartOpen.set(false) }}
        />
      )}

      {/* Sidebar */}
      <aside
        aria-label="Carrito de compras"
        aria-modal={open ? 'true' : undefined}
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-cream shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brownie-100 px-6 py-5">
          <div>
            <h2 className="font-display text-xl font-semibold text-brownie-900">Tu pedido</h2>
            {items.length > 0 && (
              <p className="text-xs text-brownie-700/60">{items.length} producto{items.length !== 1 ? 's' : ''}</p>
            )}
          </div>
          <button
            ref={closeButtonRef}
            aria-label="Cerrar carrito"
            className="flex h-8 w-8 items-center justify-center rounded-full text-brownie-700 transition-colors hover:bg-rose-100"
            onClick={() => { cartOpen.set(false) }}
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <span className="text-5xl">🍫</span>
              <p className="font-display text-lg font-medium text-brownie-900">Tu carrito está vacío</p>
              <p className="text-sm text-brownie-700/60">Agrega algunos postres y comienza tu pedido.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li className="flex gap-4 rounded-xl bg-white p-4 shadow-sm" key={item.id}>
                  <span className="text-3xl">{item.emoji}</span>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-brownie-900 leading-tight">{item.name}</p>
                      <button
                        aria-label={`Eliminar ${item.name}`}
                        className="text-brownie-700/40 transition-colors hover:text-rose-400"
                        onClick={() => { removeFromCart(item.id) }}
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full border border-brownie-100 px-1">
                        <button
                          aria-label="Quitar uno"
                          className="flex h-6 w-6 items-center justify-center rounded-full text-brownie-700 transition-colors hover:bg-rose-100"
                          onClick={() => { updateQuantity(item.id, -1) }}
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-sm font-semibold text-brownie-900">
                          {item.quantity}
                        </span>
                        <button
                          aria-label="Agregar uno"
                          className="flex h-6 w-6 items-center justify-center rounded-full text-brownie-700 transition-colors hover:bg-rose-100"
                          onClick={() => { updateQuantity(item.id, 1) }}
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-bold text-brownie-700">
                        ${(item.price * item.quantity).toLocaleString('es-MX')}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-brownie-100 px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-brownie-700/70">Total estimado</span>
              <span className="font-display text-2xl font-bold text-brownie-900">
                ${total.toLocaleString('es-MX')}
                <span className="ml-1 text-xs font-normal text-brownie-700/60">MXN</span>
              </span>
            </div>
            <button
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-6 py-4 font-semibold text-white shadow-sm transition-all hover:brightness-105 active:scale-[0.98]"
              onClick={handleWhatsApp}
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Pedir por WhatsApp
            </button>
            <button
              className="mt-2 w-full py-2 text-xs text-brownie-700/50 transition-colors hover:text-rose-400"
              onClick={clearCart}
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
