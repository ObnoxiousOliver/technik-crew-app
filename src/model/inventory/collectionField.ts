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
  'none' | // No unit

  'percentage' | // %, ‰, ‱

  // Base units
  'length' | // m, cm, mm, km
  'area' | // m², cm², mm², km²

  'volume' | // m³, cm³, mm³, km³
  'liquidVolume' | // l, ml, cl, dl, hl

  'mass' | // kg, g, mg, t
  'density' | // kg/m³, g/m³, mg/m³, t/m³

  'time' | // s, ms, min, h, d, y

  'currency' | // $, €, £, ¥, ₽, ₺, ₩, ₹, ₴, ₿, ฿, ₡, ₫, ₭, ₦, ₱, ₲

  'speed' | // m/s, cm/s, mm/s, km/s, km/h
  'acceleration' | // m/s², cm/s², mm/s², km/s²

  'angle' | // °, rad, gon
  'rotationSpeed' | // rpm, rad/min, gon/min

  'temperature' | // °C, K, °F, °R
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

export const fieldTypeNumberUnits: {
  [key in FieldTypeNumberUnits]: {
    name: string
    units: {
      [key: string]: string
    }
  }
} = {
  none: {
    name: 'Keine Einheit',
    units: {}
  },
  percentage: {
    name: 'Prozent',
    units: {
      '%': 'Prozent',
      '‰': 'Promille',
      '‱': 'Basispunkt'
    }
  },
  length: {
    name: 'Länge',
    units: {
      m: 'Meter',
      cm: 'Zentimeter',
      mm: 'Millimeter',
      km: 'Kilometer'
    }
  },
  area: {
    name: 'Fläche',
    units: {
      'm²': 'Quadratmeter',
      'cm²': 'Quadratzentimeter',
      'mm²': 'Quadratmillimeter',
      'km²': 'Quadratkilometer'
    }
  },
  volume: {
    name: 'Volumen',
    units: {
      'm³': 'Kubikmeter',
      'cm³': 'Kubikzentimeter',
      'mm³': 'Kubikmillimeter',
      'km³': 'Kubikkilometer'
    }
  },
  liquidVolume: {
    name: 'Flüssigkeitsvolumen',
    units: {
      l: 'Liter',
      ml: 'Milliliter',
      cl: 'Zentiliter',
      dl: 'Deziliter',
      hl: 'Hektoliter'
    }
  },
  mass: {
    name: 'Masse',
    units: {
      kg: 'Kilogramm',
      g: 'Gramm',
      mg: 'Milligramm',
      t: 'Tonne'
    }
  },
  density: {
    name: 'Dichte',
    units: {
      'kg/m³': 'Kilogramm pro Kubikmeter',
      'g/m³': 'Gramm pro Kubikmeter',
      'mg/m³': 'Milligramm pro Kubikmeter',
      't/m³': 'Tonne pro Kubikmeter'
    }
  },
  time: {
    name: 'Zeit',
    units: {
      s: 'Sekunden',
      ms: 'Millisekunden',
      min: 'Minuten',
      h: 'Stunden',
      d: 'Tage',
      y: 'Jahre'
    }
  },
  currency: {
    name: 'Währung',
    units: {
      '€': 'Euro',
      $: 'US-Dollar',
      '£': 'Britisches Pfund',
      '¥': 'Japanischer Yen',
      '₽': 'Russischer Rubel',
      '₺': 'Türkische Lira',
      '₩': 'Südkoreanischer Won',
      '₹': 'Indische Rupie',
      '₴': 'Ukrainische Griwna',
      '₿': 'Bitcoin',
      '฿': 'Thailändischer Baht',
      '₡': 'Costa-Ricanischer Colón',
      '₫': 'Vietnamesischer Đồng',
      '₭': 'Laotischer Kip',
      '₦': 'Nigerianischer Naira',
      '₱': 'Philippinischer Peso',
      '₲': 'Paraguayischer Guaraní'
    }
  },
  speed: {
    name: 'Geschwindigkeit',
    units: {
      'm/s': 'Meter pro Sekunde',
      'cm/s': 'Zentimeter pro Sekunde',
      'mm/s': 'Millimeter pro Sekunde',
      'km/s': 'Kilometer pro Sekunde',
      'km/h': 'Kilometer pro Stunde'
    }
  },
  acceleration: {
    name: 'Beschleunigung',
    units: {
      'm/s²': 'Meter pro Quadratsekunde',
      'cm/s²': 'Zentimeter pro Quadratsekunde',
      'mm/s²': 'Millimeter pro Quadratsekunde',
      'km/s²': 'Kilometer pro Quadratsekunde'
    }
  },
  angle: {
    name: 'Winkel',
    units: {
      '°': 'Grad',
      rad: 'Radiant',
      gon: 'Gon'
    }
  },
  rotationSpeed: {
    name: 'Rotationsgeschwindigkeit',
    units: {
      rpm: 'Umdrehungen pro Minute',
      'rad/min': 'Radiant pro Minute',
      'gon/min': 'Gon pro Minute'
    }
  },
  temperature: {
    name: 'Temperatur',
    units: {
      '°C': 'Grad Celsius',
      K: 'Kelvin',
      '°F': 'Grad Fahrenheit',
      '°R': 'Grad Rankine'
    }
  },
  energy: {
    name: 'Energie',
    units: {
      J: 'Joule',
      kJ: 'Kilojoule',
      MJ: 'Megajoule',
      GJ: 'Gigajoule'
    }
  },
  amountOfSubstance: {
    name: 'Stoffmenge',
    units: {
      mol: 'Mol'
    }
  },
  force: {
    name: 'Kraft',
    units: {
      N: 'Newton',
      kN: 'Kilonewton'
    }
  },
  torque: {
    name: 'Drehmoment',
    units: {
      Nm: 'Newtonmeter',
      kNm: 'Kilonewtonmeter'
    }
  },
  pressure: {
    name: 'Druck',
    units: {
      Pa: 'Pascal',
      kPa: 'Kilopascal',
      MPa: 'Megapascal',
      GPa: 'Gigapascal'
    }
  },
  luminousIntensity: {
    name: 'Lichtstärke',
    units: {
      cd: 'Candela',
      lm: 'Lumen',
      lx: 'Lux'
    }
  },
  audioLevel: {
    name: 'Lautstärke',
    units: {
      dB: 'Dezibel',
      'dB(A)': 'Dezibel (A)',
      'dB(C)': 'Dezibel (C)'
    }
  },
  electricCurrent: {
    name: 'Elektrischer Strom',
    units: {
      A: 'Ampere',
      mA: 'Milliampere',
      kA: 'Kiloampere'
    }
  },
  electricVoltage: {
    name: 'Elektrische Spannung',
    units: {
      V: 'Volt',
      mV: 'Millivolt',
      kV: 'Kilovolt'
    }
  },
  electricResistance: {
    name: 'Elektrischer Widerstand',
    units: {
      Ω: 'Ohm',
      mΩ: 'Milliohm',
      kΩ: 'Kiloohm'
    }
  },
  electricPower: {
    name: 'Elektrische Leistung',
    units: {
      W: 'Watt',
      mW: 'Milliwatt',
      kW: 'Kilowatt'
    }
  },
  data: {
    name: 'Datenmenge',
    units: {
      B: 'Byte',
      kB: 'Kilobyte',
      MB: 'Megabyte',
      GB: 'Gigabyte',
      TB: 'Terabyte',
      PB: 'Petabyte',
      EB: 'Exabyte',
      ZB: 'Zettabyte',
      YB: 'Yottabyte'
    }
  },
  dataRate: {
    name: 'Datenrate',
    units: {
      'B/s': 'Byte pro Sekunde',
      'kB/s': 'Kilobyte pro Sekunde',
      'MB/s': 'Megabyte pro Sekunde',
      'GB/s': 'Gigabyte pro Sekunde',
      'TB/s': 'Terabyte pro Sekunde',
      'PB/s': 'Petabyte pro Sekunde',
      'EB/s': 'Exabyte pro Sekunde',
      'ZB/s': 'Zettabyte pro Sekunde',
      'YB/s': 'Yottabyte pro Sekunde'
    }
  },
  frequency: {
    name: 'Frequenz',
    units: {
      Hz: 'Hertz',
      kHz: 'Kilohertz',
      MHz: 'Megahertz',
      GHz: 'Gigahertz',
      THz: 'Terahertz',
      PHz: 'Petahertz',
      EHz: 'Exahertz',
      ZHz: 'Zettahertz',
      YHz: 'Yottahertz'
    }
  }
}

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
    symbol?: string
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

  constructor (opt?: {
    id?: string
    name?: string,
    type: T,
    options?: Option<T>
  }) {
    this.id = opt?.id ?? createId()
    this.name = opt?.name ?? ''
    this.type = opt?.type ?? 'string' as T
    this.options = opt?.options ?? {}
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

export class FieldValue<T extends FieldTypes> {
  readonly id: string
  readonly value: T

  constructor (id: string, value: T) {
    this.id = id
    this.value = value
  }
}
