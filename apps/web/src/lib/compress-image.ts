import imageCompression from 'browser-image-compression'

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

export async function compressImageIfNeeded(file: File): Promise<File> {
  if (!IMAGE_TYPES.includes(file.type) || file.size <= 1 * 1024 * 1024) return file

  const compressed = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 2560,
    useWebWorker: true,
    preserveExif: false,
  })
  return new File([compressed], file.name, { type: compressed.type })
}
