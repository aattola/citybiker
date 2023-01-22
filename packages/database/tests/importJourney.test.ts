import { parseJourney } from '../src/parsers'

const badJourneyData = {
  '﻿Departure': 12312,
  Return: 12,
  'Departure station id': 'Number',
  'Departure station name': '-1',
  'Return station id': 'Number',
  'Return station name': 114,
  'Covered distance (m)': 'This is distance 2123 but very wrong',
  'Duration (sec.)': 'Duration of the trip was NIL'
}

const goodJourneyData = {
  '﻿Departure': '2021-06-30T22:59:46',
  Return: '2021-06-30T23:59:55',
  'Departure station id': 41,
  'Departure station name': 'Muumimaailma',
  'Return station id': 113,
  'Return station name': 'Tampere-talo',
  'Covered distance (m)': 173000,
  'Duration (sec.)': 7620
}

describe('Journey importer', () => {
  it('should reject bad info', () => {
    // ...

    const journey = { ...badJourneyData }

    const result = parseJourney(journey)

    expect(result).toBe(false)
  })

  it('should reject journey that lasted for less than ten seconds', () => {
    const journey = { ...goodJourneyData, 'Duration (sec.)': 9 }

    const result = parseJourney(journey)

    expect(result).toBe(false)
  })

  it('should reject journey that is shorter than 10 meters', () => {
    const journey = { ...goodJourneyData, 'Covered distance (m)': 9 }

    const result = parseJourney(journey)

    expect(result).toBe(false)
  })

  it('should reject negative numbers', () => {
    const distance = { ...goodJourneyData, 'Covered distance (m)': -12 }
    const duration = { ...goodJourneyData, 'Duration (sec.)': -12 }
    const badReturn = { ...goodJourneyData, 'Return station id': -123 }
    const badDeparture = { ...goodJourneyData, 'Departure station id': -92 }

    const distanceR = parseJourney(distance)
    const durationR = parseJourney(duration)
    const returnR = parseJourney(badReturn)
    const departureR = parseJourney(badDeparture)

    expect(distanceR).toBe(false)
    expect(durationR).toBe(false)
    expect(returnR).toBe(false)
    expect(departureR).toBe(false)
  })

  it('should reject bad stations', () => {
    const journey = { ...goodJourneyData, 'Departure station id': 754 }
    const journey2 = { ...goodJourneyData, 'Departure station id': 997 }
    const journey3 = { ...goodJourneyData, 'Departure station id': 999 }
    const result = parseJourney(journey)
    const result2 = parseJourney(journey2)
    const result3 = parseJourney(journey3)

    expect(result).toBe(false)
    expect(result2).toBe(false)
    expect(result3).toBe(false)
  })

  it('should reject null stations', () => {
    const journey = {
      ...goodJourneyData,
      'Departure station id': null,
      'Return station id': null
    }
    const result = parseJourney(journey)
    expect(result).toBe(false)
  })

  it('should accept correct info', () => {
    const journey = { ...goodJourneyData }

    const result = parseJourney(journey)

    expect(result).not.toBe(false)
  })
})

export {}
