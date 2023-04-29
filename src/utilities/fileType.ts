import icons from '@/assets/bootstrap-icons-meta'

const filetypeIcons = icons.filter((icon) => icon.name.startsWith('filetype-')).map((icon) => icon.name)

export function fileIcon (filename: string, mimeType?: string) {
  switch (mimeType) {
    // Binary
    case 'application/octet-stream':
      return 'file-earmark-binary'
    // Audio
    case 'audio/mpeg':
    case 'audio/ogg':
    case 'audio/wav':
    case 'audio/webm':
      return 'file-earmark-music'
    // Image
    case 'image/gif':
    case 'image/jpeg':
    case 'image/png':
    case 'image/svg+xml':
    case 'image/webp':
      return 'file-earmark-image'
    // Video
    case 'video/mp4':
    case 'video/mpeg':
    case 'video/ogg':
    case 'video/webm':
      return 'file-earmark-play'
    // Text
    case 'text/plain':
      return 'file-earmark-text'
    // Archive
    case 'application/zip':
    case 'application/x-7z-compressed':
    case 'application/x-bzip':
    case 'application/x-bzip2':
    case 'application/x-rar-compressed':
    case 'application/x-tar':
    case 'application/x-xz':
    case 'application/x-zip-compressed':
      return 'file-earmark-zip'
    // PDF
    case 'application/pdf':
      return 'file-earmark-pdf'
  }

  const extention = filename.split('.').pop()
  if (filetypeIcons.includes(`filetype-${extention}`)) {
    return `filetype-${extention}`
  } else {
    return 'file-earmark'
  }
}
