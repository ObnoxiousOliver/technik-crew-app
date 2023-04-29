export function toByteString (bytes: number, format = '%.1f%unit') {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))

  const decimals = format.match(/%\.\d+f/)
  const precision = decimals ? parseInt(decimals[1]) : 1
  const value = (bytes / Math.pow(1024, i)).toFixed(precision)
  const unit = sizes[i]

  return format.replace('%unit', unit).replace(/%\.\d+f/, value)
}
