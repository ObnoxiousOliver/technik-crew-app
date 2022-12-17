export const characters = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'

export function createId (length = 8) {
  return Array(length)
    .fill(0)
    .map(() => characters[Math.round(Math.random() * characters.length)])
    .join('')
}
