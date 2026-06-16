const API_VERSION = 'v21.0'
const BASE = `https://graph.facebook.com/${API_VERSION}`

// ─── ANSI color logger ────────────────────────────────────────────────────────

const C = {
  bold: '\x1b[1m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  yellow: '\x1b[33m',
}

type LogLevel = 'error' | 'info' | 'ok' | 'warn'

function log(level: LogLevel, scope: string, msg: string, detail?: string): void {
  const icons: Record<LogLevel, string> = { error: '✗', info: '○', ok: '✓', warn: '⚠' }
  const colors: Record<LogLevel, string> = {
    error: C.red,
    info: C.cyan,
    ok: C.green,
    warn: C.yellow,
  }
  const c = colors[level]
  const prefix = `${c}${C.bold}[Meta/${scope}] ${icons[level]}${C.reset}`
  const suffix = detail ? ` ${C.gray}${detail}${C.reset}` : ''
  console.log(`${prefix} ${msg}${suffix}`)
}

// ─── Raw API shapes ──────────────────────────────────────────────────────────

interface FacebookPageRaw {
  fan_count: number
  followers_count: number
  name: string
}

interface FacebookPhotoRaw {
  comments?: { summary: { total_count: number } }
  created_time: string
  id: string
  images: { height: number; source: string; width: number }[]
  likes?: { summary: { total_count: number } }
  name?: string
  permalink_url: string
}

interface InstagramMediaRaw {
  caption?: string
  comments_count: number
  id: string
  like_count: number
  media_type: 'CAROUSEL_ALBUM' | 'IMAGE' | 'VIDEO'
  media_url: string
  permalink: string
  thumbnail_url?: string
  timestamp: string
}

interface InstagramProfileRaw {
  followers_count: number
  media_count: number
  name: string
}

// ─── Public types ─────────────────────────────────────────────────────────────

export interface SocialPost {
  caption: string
  commentsCount: number
  date: string
  id: string
  imageUrl: string
  likesCount: number
  permalink: string
  platform: 'facebook' | 'instagram'
}

export interface SocialStats {
  facebook: {
    followers: number
    likes: number
    name: string
    profileUrl: string
  }
  instagram: {
    followers: number
    name: string
    posts: number
    profileUrl: string
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function get<T>(path: string, token: string, scope: string): Promise<T | null> {
  const endpoint = path.split('?')[0]
  const params = path.split('?')[1]?.slice(0, 60)
  log('info', scope, `GET ${endpoint}`, params)

  try {
    const url = `${BASE}${path}${path.includes('?') ? '&' : '?'}access_token=${token}`
    const res = await fetch(url)

    if (!res.ok) {
      const body = await res.text()
      log('error', scope, `HTTP ${res.status} ${res.statusText}`, body.slice(0, 120))
      return null
    }

    const data = (await res.json()) as T

    if (data && typeof data === 'object' && 'error' in data) {
      const err = (data as { error: { code: number; message: string } }).error
      log('error', scope, `API error (code ${err.code})`, err.message)
      return null
    }

    log('ok', scope, 'Request successful')
    return data
  } catch (err) {
    log('error', scope, 'Fetch failed', String(err))
    return null
  }
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return n.toLocaleString('es-MX')
}

// ─── Data fetchers ────────────────────────────────────────────────────────────

export async function getInstagramPosts(userId: string, token: string): Promise<SocialPost[]> {
  log('info', 'Instagram', `Fetching last 5 posts for user ${userId}`)

  const data = await get<{ data: InstagramMediaRaw[] }>(
    `/${userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count,permalink&limit=7`,
    token,
    'Instagram',
  )

  if (!data?.data) {
    log('warn', 'Instagram', 'Empty response or no posts found')
    return []
  }

  log('info', 'Instagram', `${data.data.length} raw posts received`)

  const posts = data.data.map((p) => ({
    caption: p.caption ?? '',
    commentsCount: p.comments_count,
    date: p.timestamp,
    id: p.id,
    imageUrl: p.thumbnail_url ?? p.media_url,
    likesCount: p.like_count,
    permalink: p.permalink,
    platform: 'instagram' as const,
  }))

  log('ok', 'Instagram', `${posts.length} posts ready`)
  return posts
}

export async function getFacebookPosts(pageId: string, token: string): Promise<SocialPost[]> {
  log('info', 'Facebook', `Fetching last 5 photos for page ${pageId}`)

  const data = await get<{ data: FacebookPhotoRaw[] }>(
    `/${pageId}/photos?type=uploaded&fields=id,name,images,created_time,likes.summary(true),comments.summary(true),permalink_url&limit=5`,
    token,
    'Facebook',
  )

  if (!data?.data) {
    log('warn', 'Facebook', 'Empty response or no photos found')
    return []
  }

  log('info', 'Facebook', `${data.data.length} raw photos received`)

  const posts = data.data.map((p) => {
    // Use highest resolution image available
    const best = p.images.reduce((a, b) => (a.width > b.width ? a : b))
    return {
      caption: p.name ?? '',
      commentsCount: p.comments?.summary.total_count ?? 0,
      date: p.created_time,
      id: p.id,
      imageUrl: best.source,
      likesCount: p.likes?.summary.total_count ?? 0,
      permalink: p.permalink_url,
      platform: 'facebook' as const,
    }
  })

  log('ok', 'Facebook', `${posts.length} photos ready`)
  return posts
}

export async function getSocialStats(
  igUserId: string,
  fbPageId: string,
  token: string,
  igProfileUrl: string,
  fbProfileUrl: string,
): Promise<SocialStats> {
  log('info', 'Stats', 'Fetching Instagram and Facebook stats in parallel')

  const [ig, fb] = await Promise.all([
    get<InstagramProfileRaw>(
      `/${igUserId}?fields=followers_count,media_count,name`,
      token,
      'Instagram/Stats',
    ),
    get<FacebookPageRaw>(
      `/${fbPageId}?fields=fan_count,followers_count,name`,
      token,
      'Facebook/Stats',
    ),
  ])

  if (ig) {
    log('ok', 'Instagram/Stats', `${ig.name} · ${ig.followers_count} followers · ${ig.media_count} posts`)
  } else {
    log('warn', 'Instagram/Stats', 'Could not fetch Instagram stats')
  }

  if (fb) {
    log('ok', 'Facebook/Stats', `${fb.name} · ${fb.followers_count} followers · ${fb.fan_count} likes`)
  } else {
    log('warn', 'Facebook/Stats', 'Could not fetch Facebook stats')
  }

  return {
    facebook: {
      followers: fb?.followers_count ?? 0,
      likes: fb?.fan_count ?? 0,
      name: fb?.name ?? 'Central Brownie',
      profileUrl: 'https://www.facebook.com/centrallbrownies',
    },
    instagram: {
      followers: ig?.followers_count ?? 0,
      name: ig?.name ?? 'centralbrownie',
      posts: ig?.media_count ?? 0,
      profileUrl: igProfileUrl,
    },
  }
}
