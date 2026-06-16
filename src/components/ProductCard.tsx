import type { Product } from '../data/products'
import { addToCart } from '../stores/cart'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { description, emoji, fromColor, id, imageUrl, name, price, toColor } = product

  function handleAdd() {
    addToCart({ description, emoji, id, name, price })
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div
        className="relative flex h-44 items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(to bottom right, ${fromColor}, ${toColor})` }}
      >
        {imageUrl ? (
          <img
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            src={imageUrl}
          />
        ) : (
          <span className="text-6xl drop-shadow-sm transition-transform duration-300 group-hover:scale-110">
            {emoji}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex-1">
          <h3 className="font-display text-lg font-semibold text-brownie-900 leading-tight">
            {name}
          </h3>
          <p className="mt-1 text-sm text-brownie-700/70 leading-relaxed">{description}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-display text-xl font-bold text-brownie-700">
            ${price.toLocaleString('es-MX')}
            <span className="ml-1 text-xs font-normal text-brownie-700/60">MXN</span>
          </span>
          <button
            className="flex items-center gap-1.5 rounded-full bg-brownie-700 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-brownie-900 active:scale-95"
            onClick={handleAdd}
          >
            <span>+</span> Agregar
          </button>
        </div>
      </div>
    </article>
  )
}
