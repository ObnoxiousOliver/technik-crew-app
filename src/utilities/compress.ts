import blobReduce from 'image-blob-reduce'
import { toByteString } from './bytes'

export interface CompressOptions {
  quality: number
  maxSize: number
}

export const compressableFileTypes = [
  'image/jpeg',
  'image/png',
  'image/webp'
]

export async function compress (file: File, options?: Partial<CompressOptions>) {
  // Settings and defaults
  const settings: CompressOptions = {
    quality: 0.8,
    maxSize: 1024,
    ...options
  }

  // If the file is not an image, return the original file
  if (compressableFileTypes.includes(file.type)) {
    const reduce = blobReduce()
    const blob = await reduce.toBlob(file, {
      max: settings.maxSize,
      unsharpAmount: 80,
      unsharpRadius: 0.6,
      unsharpThreshold: 2
    })
    console.log(
      'Original file size:', toByteString(file.size), '\n' +
      'Compressed file size:', toByteString(blob.size), '\n' +
      'Compression percentage:', ((1 - blob.size / file.size) * 100).toFixed(2) + '%'
    )
    if (blob.size > file.size) {
      console.log('Compressed file is larger than original file, returning original file')
      return file
    }
    return new File([blob], file.name, { type: blob.type })
  } else {
    console.log('File is not an image, returning original file')
    return file
  }
}
