import type { APIRoute } from 'astro'

import { getSocialStats } from '../../lib/meta'

export const prerender = false

const C = {
  bold: '\x1b[1m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
}

export const GET: APIRoute = async () => {
  console.log(`\n${C.bold}${C.cyan}━━━ GET /api/social-stats ━━━${C.reset}`)

  const {
    FACEBOOK_PAGE_ID,
    FACEBOOK_PROFILE_URL,
    INSTAGRAM_PROFILE_URL,
    INSTAGRAM_USER_ID,
    META_ACCESS_TOKEN,
  } = import.meta.env

  if (!META_ACCESS_TOKEN || !INSTAGRAM_USER_ID || !FACEBOOK_PAGE_ID) {
    console.log(`${C.red}${C.bold}[social-stats] ✗ Missing env variables${C.reset}`)
    return new Response(JSON.stringify({ error: 'Missing Meta API credentials' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 503,
    })
  }

  const stats = await getSocialStats(
    INSTAGRAM_USER_ID,
    FACEBOOK_PAGE_ID,
    META_ACCESS_TOKEN,
    INSTAGRAM_PROFILE_URL ?? 'https://instagram.com',
    FACEBOOK_PROFILE_URL ?? 'https://facebook.com',
  )

  console.log(
    `${C.green}${C.bold}[social-stats] ✓ Done${C.reset}\n`,
  )

  const isDev = import.meta.env.DEV
  return new Response(JSON.stringify(stats), {
    headers: {
      'Cache-Control': isDev ? 'no-store' : 'public, max-age=3600',
      'Content-Type': 'application/json',
    },
  })
}
