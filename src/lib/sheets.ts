import { getProductImage } from '../data/productImages'
import type { Product } from '../data/products'

const C = {
  bold: '\x1b[1m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  yellow: '\x1b[33m',
}

function log(level: 'error' | 'info' | 'ok' | 'warn', msg: string, detail?: string): void {
  const icons = { error: '✗', info: '○', ok: '✓', warn: '⚠' }
  const colors = { error: C.red, info: C.cyan, ok: C.green, warn: C.yellow }
  const c = colors[level]
  const suffix = detail ? ` ${C.gray}${detail}${C.reset}` : ''
  console.log(`${c}${C.bold}[Sheets] ${icons[level]}${C.reset} ${msg}${suffix}`)
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (const ch of line) {
    if (ch === '"') {
      inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  result.push(current)
  return result
}

export async function fetchProductsFromSheets(sheetId: string): Promise<Product[]> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`
  log('info', `Fetching catalog`, `sheet ${sheetId.slice(0, 16)}…`)

  try {
    const res = await fetch(url)

    if (!res.ok) {
      log('error', `HTTP ${res.status} — sheet may not be publicly viewable`)
      return []
    }

    const csv = await res.text()
    const lines = csv.trim().split('\n')

    if (lines.length < 2) {
      log('warn', 'Sheet appears empty')
      return []
    }

    const headers = parseCSVLine(lines[0]).map((h) => h.trim())
    const products: Product[] = []

    for (const line of lines.slice(1)) {
      if (!line.trim()) continue
      const values = parseCSVLine(line)
      const row: Record<string, string> = {}
      headers.forEach((h, i) => {
        row[h] = (values[i] ?? '').trim()
      })

      if (row['active'].toLowerCase() !== 'true') continue

      products.push({
        category: row['category'] as Product['category'],
        description: row['description'],
        emoji: row['emoji'],
        featured: row['featured'].toLowerCase() === 'true',
        fromColor: row['from_color'],
        id: row['id'],
        imageUrl: row['image_url'] || getProductImage(row['id']),
        name: row['name'],
        price: Number(row['price']),
        toColor: row['to_color'],
      })
    }

    log('ok', `${products.length} products loaded`)
    return products
  } catch (err) {
    log('error', 'Fetch failed', String(err))
    return []
  }
}
