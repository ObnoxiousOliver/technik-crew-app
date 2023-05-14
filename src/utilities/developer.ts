// Custom developer console log
export function dev ([category, color]: string[]): string[] {
  return [`%c[${category}]`, `color: ${color}`]
}

// Developer log categories
export const logInfo = ['Info', 'blue']
export const logSuccess = ['Success', 'green']
export const logWarning = ['Warning', 'yellow']
export const logError = ['Error', 'red']

export const logDev = ['Developer', 'orange']
export const logNetwork = ['Network', 'purple']
export const logRouter = ['Router', 'pink']
export const logWiki = ['Wiki', 'brown']
