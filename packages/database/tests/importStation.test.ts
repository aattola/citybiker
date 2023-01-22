import { parseStation } from '../src/parsers'

const badStationData = {
  ID: -1,
  Nimi: 1231,
  Namn: 33,
  Osoite: 123,
  Adress: 123,
  Kaupunki: 123,
  Stad: 123,
  Operaattor: 123,
  Kapasiteet: -1,
  x: 'X coordinate',
  y: 'Y coordinate'
}

const goodStationData = {
  ID: 1,
  Nimi: 'Tampere-talo',
  Namn: 'Tammpere',
  Osoite: 'Yliopistonkatu 55',
  Adress: 'Yliopistonkatu 55',
  Kaupunki: 'Tampere',
  Stad: 'Tampere',
  Operaattor: 'Nysse',
  Kapasiteet: 1123,
  x: 1123,
  y: 2333
}

describe('Journey importer', () => {
  it('should reject bad info', () => {
    // ...

    const station = { ...badStationData }

    const result = parseStation(station)

    expect(result).toBe(false)
  })

  it('should reject station with negative id', () => {
    // ...

    const station = { ...goodStationData, ID: -23 }

    const result = parseStation(station)

    expect(result).toBe(false)
  })

  it('should reject station with negative capacity', () => {
    const station = { ...goodStationData, Kapasiteet: -23 }

    const result = parseStation(station)

    expect(result).toBe(false)
  })

  it('should reject station without name', () => {
    const station = { ...goodStationData, Nimi: undefined }

    const result = parseStation(station)

    expect(result).toBe(false)
  })

  it('should reject station without address', () => {
    const station = { ...goodStationData, Osoite: undefined }

    const result = parseStation(station)

    expect(result).toBe(false)
  })

  it('should reject station without city', () => {
    const station = { ...goodStationData, Kaupunki: undefined }

    const result = parseStation(station)

    expect(result).toBe(false)
  })

  it('should reject station without operator', () => {
    const station = { ...goodStationData, Operaattor: undefined }

    const result = parseStation(station)

    expect(result).toBe(false)
  })

  // Why not {x: null} or '' because if you execute +null or +'' you get 0 ??????
  it('should reject station without x coordinate', () => {
    const station = { ...goodStationData, x: undefined }

    const result = parseStation(station)

    expect(result).toBe(false)
  })

  it('should reject station without y coordinate', () => {
    const station = { ...goodStationData, y: undefined }

    const result = parseStation(station)

    expect(result).toBe(false)
  })

  it('should accept good station', () => {
    // ...

    const station = { ...goodStationData }

    const result = parseStation(station)

    expect(result).not.toBe(false)
  })
})
