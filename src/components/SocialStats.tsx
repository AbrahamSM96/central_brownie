import { useEffect, useState } from 'react'

import type { SocialStats } from '../lib/meta'
import { formatCount } from '../lib/meta'

function InstagramIcon() {
  return (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

interface StatCardProps {
  color: string
  followers: number
  icon: React.ReactNode
  label: string
  likes: number
  likesLabel: string
  name: string
  profileUrl: string
}

function StatCard({ color, followers, icon, label, likes, likesLabel, name, profileUrl }: StatCardProps) {
  return (
    <a
      className="group flex flex-col gap-5 rounded-2xl border border-brownie-100 bg-white p-7 transition-all hover:border-transparent hover:shadow-lg no-underline"
      href={profileUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className="flex items-center justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color} text-white`}>
          {icon}
        </div>
        <span className="rounded-full border border-brownie-100 px-3 py-1 text-xs font-medium text-brownie-700 transition-colors group-hover:border-brownie-700 group-hover:text-brownie-900">
          Seguir →
        </span>
      </div>

      <div>
        <p className="text-sm font-medium text-brownie-700/60">{label}</p>
        <p className="font-display text-sm font-semibold text-brownie-900">@{name}</p>
      </div>

      <div className="flex gap-6">
        <div>
          <p className="font-display text-3xl font-bold text-brownie-900">{formatCount(followers)}</p>
          <p className="text-xs text-brownie-700/60">seguidores</p>
        </div>
        <div>
          <p className="font-display text-3xl font-bold text-brownie-900">{formatCount(likes)}</p>
          <p className="text-xs text-brownie-700/60">{likesLabel}</p>
        </div>
      </div>
    </a>
  )
}

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-brownie-100 bg-white p-7 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-12 w-12 rounded-xl bg-brownie-100" />
        <div className="h-7 w-20 rounded-full bg-brownie-100" />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="h-3 w-24 rounded-full bg-brownie-100" />
        <div className="h-4 w-32 rounded-full bg-brownie-100" />
      </div>
      <div className="flex gap-6">
        <div className="flex flex-col gap-1">
          <div className="h-8 w-16 rounded-full bg-brownie-100" />
          <div className="h-3 w-14 rounded-full bg-brownie-100" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-8 w-16 rounded-full bg-brownie-100" />
          <div className="h-3 w-14 rounded-full bg-brownie-100" />
        </div>
      </div>
    </div>
  )
}

export default function SocialStats() {
  const [stats, setStats] = useState<SocialStats | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/social-stats')
      .then((r) => {
        if (!r.ok) throw new Error('Failed')
        return r.json() as Promise<SocialStats>
      })
      .then(setStats)
      .catch(() => { setError(true) })
  }, [])

  if (error) return null

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {stats ? (
        <>
          <StatCard
            color="bg-gradient-to-br from-purple-500 to-pink-500"
            followers={stats.instagram.followers}
            icon={<InstagramIcon />}
            label="Instagram"
            likes={stats.instagram.posts}
            likesLabel="publicaciones"
            name={stats.instagram.name}
            profileUrl={stats.instagram.profileUrl}
          />
          <StatCard
            color="bg-blue-600"
            followers={stats.facebook.followers}
            icon={<FacebookIcon />}
            label="Facebook"
            likes={stats.facebook.likes}
            likesLabel="me gusta"
            name={stats.facebook.name}
            profileUrl={stats.facebook.profileUrl}
          />
        </>
      ) : (
        <>
          <SkeletonCard />
          <SkeletonCard />
        </>
      )}
    </div>
  )
}
