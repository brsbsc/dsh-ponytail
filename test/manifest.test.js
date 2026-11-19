import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const readJson = file => JSON.parse(read(file))
const manifest = readJson('package.json')

test('the bundle manifest keeps its runtime, patch, locale, docs and icon entries', () => {
  for (const entry of [
    'index.js', 'client.js', 'lib', 'skills', 'locale',
    'docs/DETAIL.md', 'docs/DETAIL.zh.md', 'docs/preview.svg',
    'icon.svg', 'cordis.patch.yml', 'LICENSE',
  ]) {
    assert.ok(manifest.files.includes(entry), `files is missing ${entry}`)
  }
  assert.equal(manifest.exports['.'], './index.js')
  assert.equal(manifest.exports['./client'], './client.js')
  assert.equal(manifest.exports['./icon'], './icon.svg')
  assert.equal(manifest.exports['./locale/*.json'], './locale/*.json')
  assert.equal(manifest.dsh.bundle.patch, './cordis.patch.yml')
  assert.equal(manifest.dsh.client.platform, 'web')
})

test('every client graph dependency this bundle lists is a DSH client package', () => {
  const inject = manifest.dsh.client.inject
  assert.ok(Array.isArray(inject) && inject.length > 0)
  for (const name of inject) assert.match(name, /^@deepseek-ai\/dsh-/u)
  for (const name of ['@deepseek-ai/dsh-api-remotes', '@deepseek-ai/dsh-client-connection', '@deepseek-ai/dsh-client-locale', '@deepseek-ai/dsh-client-ui-conversation', '@deepseek-ai/dsh-client-ui-renderer']) {
    assert.ok(inject.includes(name), `client injection is missing ${name}`)
  }
})

test('the patch inserts the entry the settings namespace addresses', () => {
  const patch = read('cordis.patch.yml')
  assert.match(patch, /^-\s+insert:/mu)
  assert.match(patch, /id:\s*ponytail\b/u)
  assert.match(patch, /name:\s*dsh-ponytail\b/u)
})

test('the plugin manager can read a title, description and detail document in every locale', () => {
  for (const locale of ['en', 'zh']) {
    const file = `locale/${locale}.json`
    const meta = readJson(file).meta
    assert.equal(typeof meta.title, 'string')
    assert.ok(meta.title.length > 0, `${file} has an empty title`)
    assert.equal(typeof meta.description, 'string')
    assert.ok(meta.description.length >= 80, `${file} needs a description that explains the plugin`)
    assert.match(meta.detail, /^docs\/DETAIL(?:\.[a-z]{2})?\.md$/u, `${file} declares ${meta.detail}`)
    const detail = read(meta.detail).trim()
    assert.match(detail, /^!\[[^\]]+\]\(preview\.svg\)$/u, `${meta.detail} must be exactly one image line`)
  }
})

test('the icon and preview are self-contained SVG that the panel can decode', () => {
  const icon = read('icon.svg')
  assert.ok(icon.trimStart().startsWith('<svg'))
  assert.match(icon, /viewBox="0 0 36 36"/u)
  assert.ok(Buffer.byteLength(icon) <= 256 * 1024, 'the icon must stay under the 256 KiB icon limit')

  const preview = read('docs/preview.svg')
  assert.ok(preview.trimStart().startsWith('<svg'))
  assert.match(preview, /viewBox="0 0 640 300"/u)

  for (const [name, svg] of [['icon.svg', icon], ['docs/preview.svg', preview]]) {
    assert.doesNotMatch(svg, /<script|<style|<text|<foreignObject/iu, `${name} must carry no scripts, styles, text or foreign objects`)
    assert.doesNotMatch(svg, /\shref=|\sxlink:href=/u, `${name} must not reference remote or embedded resources`)
  }
})
