import fallbackArtwork from '@/assets/profile.png'

function readText(view: DataView, offset: number, length: number): string {
  let text = ''
  for (let index = 0; index < length; index += 1) {
    text += String.fromCharCode(view.getUint8(offset + index))
  }
  return text
}

function readSyncsafeInt(view: DataView, offset: number): number {
  return (
    (view.getUint8(offset) << 21) |
    (view.getUint8(offset + 1) << 14) |
    (view.getUint8(offset + 2) << 7) |
    view.getUint8(offset + 3)
  )
}

function readFrameSize(view: DataView, offset: number, id3MajorVersion: number): number {
  if (id3MajorVersion === 4) {
    return readSyncsafeInt(view, offset)
  }

  return view.getUint32(offset)
}

function readNullTerminated(view: DataView, offset: number, maxLength: number): number {
  for (let index = 0; index < maxLength; index += 1) {
    if (view.getUint8(offset + index) === 0) {
      return index
    }
  }

  return maxLength
}

function parseApicFrame(view: DataView, offset: number, length: number): string | null {
  if (length < 4) return null

  const encoding = view.getUint8(offset)
  let cursor = offset + 1

  const mimeLength = readNullTerminated(view, cursor, length - 1)
  const mime = readText(view, cursor, mimeLength)
  cursor += mimeLength + 1

  if (cursor >= offset + length) return null

  cursor += 1 // picture type

  const descriptionLength = readNullTerminated(view, cursor, offset + length - cursor)
  cursor += descriptionLength + (encoding === 0x00 || encoding === 0x03 ? 1 : 2)

  if (cursor >= offset + length) return null

  const imageBytes = new Uint8Array(view.buffer, view.byteOffset + cursor, offset + length - cursor)
  if (!imageBytes.length) return null

  const blob = new Blob([imageBytes], { type: mime || 'image/jpeg' })
  return URL.createObjectURL(blob)
}

export async function extractMp3CoverArt(src: string): Promise<string> {
  try {
    const response = await fetch(src)
    if (!response.ok) return fallbackArtwork

    const buffer = await response.arrayBuffer()
    const view = new DataView(buffer)

    if (readText(view, 0, 3) !== 'ID3') return fallbackArtwork

    const id3MajorVersion = view.getUint8(3)
    const tagSize = readSyncsafeInt(view, 6)
    const tagEnd = Math.min(10 + tagSize, view.byteLength)

    let offset = 10

    while (offset + 10 <= tagEnd) {
      const frameId = readText(view, offset, 4)
      if (!frameId.trim() || frameId === '\0\0\0\0') break

      const frameSize = readFrameSize(view, offset + 4, id3MajorVersion)
      const frameStart = offset + 10
      const frameEnd = frameStart + frameSize

      if (frameEnd > tagEnd || frameSize <= 0) break

      if (frameId === 'APIC' || frameId === 'PIC') {
        const artwork = parseApicFrame(view, frameStart, frameSize)
        if (artwork) return artwork
      }

      offset = frameEnd
    }
  } catch {
    return fallbackArtwork
  }

  return fallbackArtwork
}

export function revokeArtworkUrl(url: string | null) {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

export { fallbackArtwork }
