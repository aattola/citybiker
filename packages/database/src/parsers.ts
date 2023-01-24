import { z } from 'zod'
import { Journey, Station } from './types'

const badStations = [754, 997, 999]

export const stationParser = z.object({
  id: z.number().int().positive(),
  finName: z.string().min(1),
  sweName: z.string().min(1),
  finAddress: z.string().min(1),
  sweAddress: z.string().min(1),
  finCity: z.string().min(1),
  sweCity: z.string().min(1),
  operator: z.string().min(1),
  capacity: z.number().int().positive(),
  x: z.number(),
  y: z.number()
})

export function parseStation(data: any): Station | false {
  const dataObj = {
    id: +data.ID,
    finName: data.Nimi,
    sweName: data.Namn,
    finAddress: data.Osoite,
    sweAddress: data.Adress,
    finCity: data.Kaupunki,
    sweCity: data.Stad,
    operator: data.Operaattor,
    capacity: +data.Kapasiteet,
    x: +data.x,
    y: +data.y
  }
  const parseData = stationParser.safeParse(dataObj)

  if (!parseData.success) return false

  return parseData.data
}

export const journeyParser = z.object({
  departure: z.date(),
  return: z.date(),
  departureStationId: z.number().int().positive(),
  departureStationName: z.string().min(1),
  returnStationId: z.number().int().positive(),
  returnStationName: z.string().min(1),
  coveredDistance: z.number().positive().min(10),
  duration: z.number().positive().min(10)
})

export function parseJourney(data: any): Journey | false {
  const _data: Journey = {
    departure: new Date(data['﻿Departure']),
    return: new Date(data.Return),
    departureStationId: +data['Departure station id'],
    departureStationName: data['Departure station name'],
    returnStationId: +data['Return station id'],
    returnStationName: data['Return station name'],
    coveredDistance: +data['Covered distance (m)'],
    duration: +data['Duration (sec.)']
  }

  const parseData = journeyParser.safeParse(_data)

  if (!parseData.success) return false

  const newData = parseData.data

  if (badStations.includes(newData.departureStationId)) return false
  if (badStations.includes(newData.returnStationId)) return false

  return newData
}
