import { createId } from '@/utilities/id'

export type FieldTypes =
  'string' | // A string e.g. "Hello World"
  'number' | // A number e.g. 42
  'boolean' | // A boolean e.g. true
  'date' | // A date e.g. 2021-10-31
  'time' | // A time e.g. 12:00
  'datetime' | // A date and time e.g. 2021-10-31 12:00
  'enum' | // A single enum e.g. "Hello World"
  'list' // A list of FieldType e.g. ["Hello", "World"]

export type FieldTypeNumberUnits =
  // Base units
  'length' | // m, cm, mm, km
  'area' | // m², cm², mm², km²

  'volume' | // m³, cm³, mm³, km³
  'liquidVolume' | // l, ml, cl, dl, hl

  'mass' | // kg, g, mg, t
  'density' | // kg/m³, g/m³, mg/m³, t/m³

  'time' | // s, ms, min, h, d, y

  'speed' | // m/s, cm/s, mm/s, km/s, km/h
  'acceleration' | // m/s², cm/s², mm/s², km/s²

  'angle' | // °, rad, gon
  'rotationSpeed' | // rpm, rad/min, gon/min

  'temperature' | // °C, K
  'energy' | // J, kJ, MJ, GJ
  'amountOfSubstance' | // mol

  'force' | // N, kN
  'torque' | // Nm, kNm
  'pressure' | // Pa, kPa, MPa, GPa

  'luminousIntensity' | // cd, lm, lx
  'audioLevel' | // dB, dB(A), dB(C)

  // Electric units
  'electricCurrent' | // A, mA, kA
  'electricVoltage' | // V, mV, kV
  'electricResistance' | // Ω, mΩ, kΩ
  'electricPower' | // W, mW, kW

  // Computer units
  'data' | // B, kB, MB, GB, TB, PB, EB, ZB, YB
  'dataRate' | // B/s, kB/s, MB/s, GB/s, TB/s, PB/s, EB/s, ZB/s, YB/s
  'frequency' // Hz, kHz, MHz, GHz, THz, PHz, EHz, ZHz, YHz

export interface FieldTemplateBase<T extends FieldTypes> {
  type: T
  // eslint-disable-next-line no-use-before-define
  options?: Option<T>
}

export interface Option<T extends FieldTypes> {
  // Number
  number?: T extends 'number' ? {
    min?: number
    max?: number
    step?: number
    unit?: FieldTypeNumberUnits
  } : never

  // Enum
  enum?: T extends 'enum' ? string[] : never

  // List
  list?: T extends 'list' ? FieldTemplateBase<FieldTypes> : never
}

export interface FieldTemplateDB<T extends FieldTypes> extends FieldTemplateBase<T> {
  id: string
  name: string
}

export class FieldTemplate<T extends FieldTypes> {
  readonly id: string
  readonly name: string
  readonly type: T
  readonly options: Option<T>

  constructor (opt: {
    id?: string
    name?: string,
    type: T,
    options?: Option<T>
  }) {
    this.id = opt.id ?? createId()
    this.name = opt.name ?? ''
    this.type = opt.type
    this.options = opt.options ?? {}
  }

  toDB (): FieldTemplateDB<T> {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      options: this.options
    }
  }

  static fromDB <T extends FieldTypes> (db: Partial<FieldTemplateDB<T>>) {
    return new FieldTemplate({
      id: db.id,
      name: db.name,
      type: db.type ?? 'string',
      options: db.options
    })
  }
}
