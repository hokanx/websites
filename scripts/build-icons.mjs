#!/usr/bin/env node
/**
 * Favicon set, derived from the client's REAL logo artwork.
 *
 * Source: logo/stamp-logo.png — the cream mark lifted off the supplied
 * screenshot onto transparency. The favicon crops the "S", because the full
 * three-line lockup is unreadable at 32px.
 *
 * Writes: icon.svg, favicon.ico (32px PNG payload), apple-touch-icon.png (180),
 * icon-192.png, icon-512.png, site.webmanifest.
 */
import sharp from 'sharp'
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs'

const INK = '#17110F'
const SRC = 'logo/stamp-logo.png'
// Measured crop of the "S" in the source artwork.
const S_CROP = { left: 0, top: 445, width: 265, height: 367 }

if (!existsSync(SRC)) {
  console.error(`missing ${SRC} — the real logo artwork is required`)
  process.exit(1)
}

mkdirSync('public', { recursive: true })

const mark = await sharp(SRC).extract(S_CROP).png().toBuffer()

/** The mark centred on the brand ground, at `size`. */
async function icon(size) {
  const inner = Math.round(size * 0.62)
  const glyph = await sharp(mark).resize({ height: inner, fit: 'inside' }).toBuffer()
  return sharp({
    create: { width: size, height: size, channels: 4, background: INK },
  })
    .composite([{ input: glyph, gravity: 'center' }])
    .png({ compressionLevel: 9 })
}

await (await icon(180)).toFile('public/apple-touch-icon.png')
await (await icon(192)).toFile('public/icon-192.png')
await (await icon(512)).toFile('public/icon-512.png')

// Scalable icon: the real mark embedded, so it stays sharp at any size.
const markB64 = (await sharp(mark).resize({ width: 256 }).png().toBuffer()).toString('base64')
writeFileSync(
  'public/icon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="${INK}"/>
  <image x="17" y="12" width="30" height="40" href="data:image/png;base64,${markB64}"/>
</svg>`,
)

// ICO with a single 32x32 PNG payload.
const buf = await (await icon(32)).toBuffer()
const header = Buffer.alloc(22)
header.writeUInt16LE(0, 0)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(1, 4)
header.writeUInt8(32, 6)
header.writeUInt8(32, 7)
header.writeUInt16LE(1, 10)
header.writeUInt16LE(32, 12)
header.writeUInt32LE(buf.length, 14)
header.writeUInt32LE(22, 18)
writeFileSync('public/favicon.ico', Buffer.concat([header, buf]))

writeFileSync(
  'public/site.webmanifest',
  JSON.stringify(
    {
      name: 'STAMP BURGER',
      short_name: 'STAMP',
      description: 'STAMP BURGER — Al Qadisiyah, Al Yasmeen, Riyadh',
      start_url: '/',
      display: 'standalone',
      background_color: INK,
      theme_color: INK,
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    null,
    2,
  ),
)

console.log('icons written from the real logo artwork')
