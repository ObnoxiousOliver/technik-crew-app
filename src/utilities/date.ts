export interface DateStringOptions {
  daysAgoThreshold?: boolean | number
  weekday?: 'long' | 'short' | 'narrow'
  year?: 'numeric' | '2-digit' | 'auto'
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow'
  day?: 'numeric' | '2-digit'
  hour?: 'numeric' | '2-digit'
  minute?: 'numeric' | '2-digit'
  second?: 'numeric' | '2-digit'
}

export function toDateString (date: Date, options: DateStringOptions = {}) {
  const opt: DateStringOptions = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    ...options
  }

  const now = new Date()

  const diff = new Date(now.getTime() - date.getTime())
  const diffMs = diff.getTime()
  const diffDays = Math.floor(diffMs / 86400000)
  if (opt.daysAgoThreshold) {
    if (opt.daysAgoThreshold === true || opt.daysAgoThreshold >= diffDays) {
      const diffMins = Math.floor(diffMs / 60000)
      const diffHrs = Math.floor(diffMs / 3600000)
      const diffWeeks = Math.floor(diffDays / 7)
      const diffMonths = Math.floor(diffDays / 31)
      const diffYears = Math.floor(diffDays / 365)

      if (diffMins < 1) {
        return 'gerade eben'
      } else if (diffHrs < 1) {
        return `vor ${diffMins} Minute${diffMins > 1 ? 'n' : ''}`
      } else if (diffDays < 1) {
        return `vor ${diffHrs} Stunde${diffHrs > 1 ? 'n' : ''}`
      } else if (diffWeeks < 1) {
        return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`
      } else if (diffMonths < 1) {
        return `vor ${diffWeeks} Woche${diffWeeks > 1 ? 'n' : ''}`
      } else if (diffYears < 1) {
        return `vor ${diffMonths} Monat${diffMonths > 1 ? 'en' : ''}`
      } else {
        return `vor ${diffYears} Jahr${diffYears > 1 ? 'en' : ''}`
      }
    }
  }
  let str = ''

  if (diffDays === 0 && opt.daysAgoThreshold !== false) {
    str += 'heute'
  } else if (diffDays === 1 && opt.daysAgoThreshold !== false) {
    str += 'gestern'
  } else if (diffDays === 2 && opt.daysAgoThreshold !== false) {
    str += 'vorgestern'
  } else {
    if (opt.weekday) {
      str += date.toLocaleDateString('de-DE', {
        weekday: opt.weekday
      })

      if (opt.weekday !== 'long') {
        str += '.'
      }
    }
    if (opt.day || opt.month || opt.year) {
      if (opt.weekday) {
        str += ' den '
      }

      str += date.toLocaleDateString('de-DE', {
        day: opt.day,
        month: opt.month,
        year: opt.year === 'auto'
          ? date.getFullYear() !== now.getFullYear()
            ? 'numeric'
            : undefined
          : opt.year
      })
    }
  }

  if (opt.hour || opt.minute || opt.second) {
    if (str) {
      str += ' um '
    }
    str += date.toLocaleTimeString('de-DE', {
      hour: opt.hour,
      minute: opt.minute,
      second: opt.second
    })
  }

  return str
}
