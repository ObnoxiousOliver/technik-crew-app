export interface EventDB {
  id: string,
  name: string,
  description: string,
  wholeDay: boolean,
  startDate: number,
  endDate: number | null
}
