#!/usr/bin/env node
/**
 * Film pipeline: chained clips -> one seamless scrub frame sequence.
 *
 * Run this once the Higgsfield clips are on disk in `film/`:
 *
 *   node scripts/build-frames.mjs film/c1.mp4 film/c2.mp4 film/c3.mp4
 *
 * It extracts every clip at 14fps / 1280w webp, concatenates them into one
 * continuously numbered sequence at public/frames/hero/, writes the manifest
 * the scrub engine fetches, and drops frame 1 as the poster jpg.
 *
 * Seam handling: because each clip was generated starting from the previous
 * clip's final frame, that final frame is duplicated at every join. The first
 * frame of clips 2..n is dropped so the seam does not stutter on a repeat.
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync, readdirSync, renameSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const ffmpeg = require('@ffmpeg-installer/ffmpeg').path

const FPS = 14
const WIDTH = 1280
const QUALITY = 62
const OUT = 'public/frames/hero'
const TMP = '.frames-tmp'

const clips = process.argv.slice(2)
if (!clips.length) {
  console.error('usage: node scripts/build-frames.mjs <clip1.mp4> [clip2.mp4 ...]')
  process.exit(1)
}
for (const c of clips) {
  if (!existsSync(c)) {
    console.error(`missing clip: ${c}`)
    process.exit(1)
  }
}

const run = (args) => execFileSync(ffmpeg, args, { stdio: ['ignore', 'ignore', 'pipe'] })

rmSync(TMP, { recursive: true, force: true })
rmSync(OUT, { recursive: true, force: true })
mkdirSync(TMP, { recursive: true })
mkdirSync(OUT, { recursive: true })

let index = 0
const manifest = []
const chapterStarts = []

clips.forEach((clip, ci) => {
  const dir = join(TMP, `c${ci}`)
  mkdirSync(dir, { recursive: true })

  run([
    '-hide_banner', '-loglevel', 'error', '-y',
    '-i', clip,
    '-vf', `fps=${FPS},scale=${WIDTH}:-2`,
    '-c:v', 'libwebp', '-q:v', String(QUALITY),
    join(dir, 'f-%04d.webp'),
  ])

  let files = readdirSync(dir).filter((f) => f.endsWith('.webp')).sort()
  // Drop the duplicated handoff frame at every join but the first.
  if (ci > 0) files = files.slice(1)

  chapterStarts.push(index)
  for (const f of files) {
    const name = `f-${String(++index).padStart(4, '0')}.webp`
    renameSync(join(dir, f), join(OUT, name))
    manifest.push(name)
  }
  console.log(`clip ${ci + 1}: ${files.length} frames`)
})

writeFileSync(
  join(OUT, 'manifest.json'),
  JSON.stringify({ fps: FPS, width: WIDTH, chapterStarts, frames: manifest }),
)

// Poster: frame 1 as a jpg so the hero paints before any webp is decoded.
mkdirSync('public/assets', { recursive: true })
run([
  '-hide_banner', '-loglevel', 'error', '-y',
  '-i', join(OUT, manifest[0]),
  '-q:v', '4',
  'public/assets/hero-poster.jpg',
])

rmSync(TMP, { recursive: true, force: true })

const bytes = readdirSync(OUT)
  .filter((f) => f.endsWith('.webp'))
  .reduce((n, f) => n + require('node:fs').statSync(join(OUT, f)).size, 0)

console.log(`\n${manifest.length} frames · ${(bytes / 1024 / 1024).toFixed(2)} MB`)
if (bytes > 8 * 1024 * 1024) {
  console.warn('over the 8 MB budget — raise QUALITY or drop FPS to 12')
}
