import { useState } from 'react'

import { categories } from '../data/products'
import type { CategoryId, Product } from '../data/products'
import { addToCart } from '../stores/cart'

function ProductCard({ product }: { product: Product }) {
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
          <h3 className="font-display text-lg font-semibold leading-tight text-brownie-900">
            {name}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-brownie-700/70">{description}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-display text-xl font-bold text-brownie-700">
            ${price.toLocaleString('es-MX')}
            <span className="ml-1 text-xs font-normal text-brownie-700/60">MXN</span>
          </span>
          <button
            aria-label={`Agregar ${name} al carrito`}
            className="flex items-center gap-1.5 rounded-full bg-brownie-700 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-brownie-900 active:scale-95"
            onClick={handleAdd}
          >
            <span aria-hidden="true">+</span> Agregar
          </button>
        </div>
      </div>
    </article>
  )
}

interface Props {
  products: Product[]
}

const validCategoryIds = categories.map((c) => c.id) as readonly string[]

function getCategoryFromUrl(): CategoryId | null {
  if (typeof window === 'undefined') return null
  const param = new URLSearchParams(window.location.search).get('category')
  return validCategoryIds.includes(param ?? '') ? (param as CategoryId) : null
}

export default function ProductCatalog({ products }: Props) {
  const [active, setActive] = useState<CategoryId | null>(getCategoryFromUrl)

  const filtered = active ? products.filter((p) => p.category === active) : products

  return (
    <div>
      {/* Category filter */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        <button
          className={`rounded-full border px-5 py-2 text-sm font-medium transition-all ${
            active === null
              ? 'border-brownie-700 bg-brownie-700 text-white'
              : 'border-brownie-100 bg-white text-brownie-700 hover:border-brownie-700/40 hover:bg-brownie-100/50'
          }`}
          onClick={() => { setActive(null) }}
        >
          Todos
        </button>
        {categories.map(({ emoji, id, label }) => (
          <button
            className={`rounded-full border px-5 py-2 text-sm font-medium transition-all ${
              active === id
                ? 'border-brownie-700 bg-brownie-700 text-white'
                : 'border-brownie-100 bg-white text-brownie-700 hover:border-brownie-700/40 hover:bg-brownie-100/50'
            }`}
            key={id}
            onClick={() => { setActive(id) }}
          >
            {emoji} {label}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="mb-6 text-center text-sm text-brownie-700/50">
        {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
      </p>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
