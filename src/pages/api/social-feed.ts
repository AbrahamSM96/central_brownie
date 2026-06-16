import type { APIRoute } from 'astro'

import { getInstagramPosts } from '../../lib/meta'

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
  console.log(`\n${C.bold}${C.cyan}━━━ GET /api/social-feed ━━━${C.reset}`)

  const { INSTAGRAM_USER_ID, META_ACCESS_TOKEN } = import.meta.env

  if (!META_ACCESS_TOKEN || !INSTAGRAM_USER_ID) {
    console.log(`${C.red}${C.bold}[social-feed] ✗ Missing env variables${C.reset}`)
    return new Response(JSON.stringify({ error: 'Missing Meta API credentials' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 503,
    })
  }

  const posts = await getInstagramPosts(INSTAGRAM_USER_ID, META_ACCESS_TOKEN)

  console.log(
    `${C.green}${C.bold}[social-feed] ✓ Done${C.reset} ${C.gray}→ ${posts.length} IG posts${C.reset}\n`,
  )

  const isDev = import.meta.env.DEV
  return new Response(JSON.stringify(posts), {
    headers: {
      'Cache-Control': isDev ? 'no-store' : 'public, max-age=1800',
      'Content-Type': 'application/json',
    },
  })
}
