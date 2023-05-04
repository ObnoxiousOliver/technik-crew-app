export function search <T> (query: string, items: T[], f: (x: T) => string = (x) => x as string): T[] {
  const q = query.toLowerCase().split(' ')
  const results = []

  for (let i = 0; i < items.length; i++) {
    const str = f(items[i]).toLowerCase()

    if (q.every(x => str.split(' ').some(y => y.includes(x)))) {
      results.push(items[i])
    }
  }

  return results
}
