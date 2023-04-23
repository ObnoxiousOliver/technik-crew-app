// Base 64 characters
export const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+_'

export function createId (length = 8) {
  return Array(length)
    .fill(0)
    .map(() => characters[Math.round(Math.random() * characters.length)])
    .join('')
}
