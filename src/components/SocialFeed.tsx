import { useEffect, useState } from 'react'

import type { SocialPost } from '../lib/meta'

function PostCard({ post }: { post: SocialPost }) {
  const [imgError, setImgError] = useState(false)
  const date = new Date(post.date).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <a
      className="group relative block aspect-square overflow-hidden rounded-2xl bg-brownie-100 no-underline"
      href={post.permalink}
      rel="noopener noreferrer"
      target="_blank"
    >
      {!imgError ? (
        <img
          alt={post.caption.slice(0, 60) || 'Publicación'}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={() => {
            setImgError(true)
          }}
          src={post.imageUrl}
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-brownie-100 to-rose-100">
          <span className="text-4xl">🍫</span>
        </div>
      )}

      <div className="absolute inset-0 flex flex-col justify-end bg-brownie-900/0 p-3 transition-all duration-300 group-hover:bg-brownie-900/70">
        <div className="translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {post.caption && (
            <p className="mb-1.5 line-clamp-2 text-xs leading-relaxed text-white/90">
              {post.caption}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/60">{date}</span>
            <div className="flex items-center gap-2 text-xs text-white/80">
              <span>❤️ {post.likesCount.toLocaleString('es-MX')}</span>
              <span>💬 {post.commentsCount.toLocaleString('es-MX')}</span>
            </div>
          </div>
        </div>
      </div>
    </a>
  )
}

function FeaturedPostCard({ post }: { post: SocialPost }) {
  const [imgError, setImgError] = useState(false)
  const date = new Date(post.date).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="relative mb-6">
      {/* Diffused aura behind the card */}
      <div className="featured-glow-ring absolute -inset-[6px] rounded-[30px] opacity-50 blur-xl" />
      {/* Sharp chasing ring */}
      <div className="featured-glow-ring absolute -inset-[3px] rounded-[27px]" />

      <a
        className="group relative block aspect-video w-full overflow-hidden rounded-3xl bg-brownie-100 no-underline"
        href={post.permalink}
        rel="noopener noreferrer"
        target="_blank"
      >
        {/* Latest badge */}
        <div className="absolute left-4 top-4 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            ✨ Última publicación
          </span>
        </div>

        {!imgError ? (
          <img
            alt={post.caption.slice(0, 80) || 'Última publicación'}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={post.imageUrl}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-brownie-100 to-rose-100">
            <span className="text-7xl">🍫</span>
          </div>
        )}

        <div className="absolute inset-0 flex flex-col justify-end bg-brownie-900/0 p-6 transition-all duration-300 group-hover:bg-brownie-900/70">
          <div className="translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            {post.caption && (
              <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-white/90">
                {post.caption}
              </p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">{date}</span>
              <div className="flex items-center gap-4 text-sm text-white/90">
                <span>❤️ {post.likesCount.toLocaleString('es-MX')}</span>
                <span>💬 {post.commentsCount.toLocaleString('es-MX')}</span>
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
  )
}

function Skeleton({ featured }: { featured?: boolean }) {
  return (
    <div
      className={`animate-pulse rounded-3xl bg-brownie-100 ${featured ? 'aspect-video w-full mb-6' : 'aspect-square'}`}
    />
  )
}

export default function SocialFeed() {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/social-feed')
      .then((r) => {
        if (!r.ok) throw new Error('Failed')
        return r.json() as Promise<SocialPost[]>
      })
      .then((data) => {
        setPosts(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  if (error || (!loading && posts.length === 0)) return null

  const [featured, ...rest] = posts
  const grid = rest.slice(0, 6)

  return (
    <div>
      {loading ? (
        <>
          <Skeleton featured />
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} />
            ))}
          </div>
        </>
      ) : (
        <>
          {featured && <FeaturedPostCard post={featured} />}
          {grid.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {grid.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
