import { createId } from '@/utilities/id'

export interface EventDB {
  id: string,
  name: string,
  description: string,
  wholeDay: boolean,
  startDate: number,
  endDate: number | null,
  color: 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'cyan' | 'blue' | 'purple' | 'pink'
}

export default class Event implements EventDB {
  id: string
  name: string
  description: string
  wholeDay: boolean
  startDate: number
  endDate: number | null
  color: 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'cyan' | 'blue' | 'purple' | 'pink'

  constructor (options: Partial<EventDB> = {}) {
    this.id = options.id ?? createId()
    this.name = options.name ?? 'Unbenannter Termin'
    this.description = options.description ?? ''
    this.wholeDay = options.wholeDay ?? true
    this.startDate = options.startDate ?? new Date().getTime()
    this.endDate = options.endDate ?? null
    this.color = options.color ?? 'gray'
  }

  toDB (): EventDB {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      wholeDay: this.wholeDay,
      startDate: this.startDate,
      endDate: this.endDate,
      color: this.color
    }
  }
}
