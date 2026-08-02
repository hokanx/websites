#!/usr/bin/env node
/**
 * Favicon set, derived from the same stamp mark used for the film landing.
 * Writes: icon.svg, favicon.ico (32px PNG payload), apple-touch-icon.png (180),
 * icon-192.png, icon-512.png, site.webmanifest.
 *
 * Re-run after swapping in the client's real logo artwork.
 */
import sharp from 'sharp'
import { writeFileSync, mkdirSync } from 'node:fs'

const INK = '#17110F'
const BUN = '#F2E7D5'
const STAMP = '#C4392B'

// Square stamp mark: cut-corner frame with a heavy S.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="${INK}"/>
  <path d="M8 8h40l8 8v40H16L8 48V8Z" fill="none" stroke="${STAMP}" stroke-width="3"/>
  <text x="32" y="44" text-anchor="middle" font-family="Archivo Black, Arial Black, sans-serif"
        font-size="30" font-weight="900" fill="${BUN}">S</text>
</svg>`

mkdirSync('public', { recursive: true })
writeFileSync('public/icon.svg', svg)

const png = (size) => sharp(Buffer.from(svg)).resize(size, size).png()

await png(180).toFile('public/apple-touch-icon.png')
await png(192).toFile('public/icon-192.png')
await png(512).toFile('public/icon-512.png')

// ICO with a single 32x32 PNG payload (supported since Vista).
const buf = await png(32).toBuffer()
const header = Buffer.alloc(22)
header.writeUInt16LE(0, 0) // reserved
header.writeUInt16LE(1, 2) // type: icon
header.writeUInt16LE(1, 4) // count
header.writeUInt8(32, 6) // width
header.writeUInt8(32, 7) // height
header.writeUInt8(0, 8) // palette
header.writeUInt8(0, 9) // reserved
header.writeUInt16LE(1, 10) // colour planes
header.writeUInt16LE(32, 12) // bits per pixel
header.writeUInt32LE(buf.length, 14)
header.writeUInt32LE(22, 18) // offset
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

console.log('icons written to public/')
