export function splitFirstEmojiFromString (str: string): string[] | null {
  const emoji = str.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}\u200d]+/gu)?.[0]
  if (!emoji) return null
  return [emoji, str.replace(emoji, '')]
}

// Tests

// console.log(splitFirstEmojiFromString('🤏🏽123'))
// console.log(splitFirstEmojiFromString('🤏🏽🤏🏽 123'))
// console.log(splitFirstEmojiFromString('👨🏽‍🏭 123'))
// console.log(splitFirstEmojiFromString('👩🏽‍👩‍🧒🏾‍👦 123'))
// console.log(splitFirstEmojiFromString('123'))
