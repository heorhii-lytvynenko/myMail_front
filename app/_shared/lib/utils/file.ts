export const getFileHash = async (file: File): Promise<string> => {
  try {
    return await computeFNV1aStream(file)
  } catch {
    return getFileKey(file)
  }
}

export const computeFNV1aStream = async (file: File): Promise<string> => {
  const CHUNK_SIZE = 4 * 1024 * 1024

  let hashHi = 0xcbf29ce4 >>> 0
  let hashLo = 0x84222325 >>> 0

  let offset = 0

  while (offset < file.size) {
    const bytes = new Uint8Array(
      await file.slice(offset, offset + CHUNK_SIZE).arrayBuffer()
    )

    for (let i = 0; i < bytes.length; i++) {
      hashLo ^= bytes[i]
      hashLo =
        (Math.imul(hashLo, 0x01000193) + Math.imul(hashHi, 0x01000193) * 0) >>>
        0
      hashHi = Math.imul(hashHi, 0x01000193) >>> 0
    }

    offset += CHUNK_SIZE

    await new Promise((r) => setTimeout(r, 0))
  }

  return (
    hashHi.toString(16).padStart(8, '0') + hashLo.toString(16).padStart(8, '0')
  )
}

export const getFileKey = (file: File): string => {
  return `${file.name}_${file.size}_${file.lastModified}_${file.type}`
}
