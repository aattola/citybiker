import * as fs from 'node:fs'
import * as path from 'node:path'
import csv from 'csv-parser'
import { prisma } from './client'

const filePath = path.resolve(__dirname, '../data/')
const JourneyFiles = ['2021-05.csv', '2021-06.csv', '2021-07.csv']
const StationFiles = ['Pysakit.csv']

const journeyFiles = JourneyFiles.map((file) => filePath + '/' + file)
const stationFiles = StationFiles.map((file) => filePath + '/' + file)

// 754 does not exist in the station data, 997 and 999 are probably service and production
const badStations = [754, 997, 999]

interface Journey {
  duration: number
  returnStationId: number
  coveredDistance: number
  departureStationId: number
  departureStationName: string
  returnStationName: string
  departure: Date
  return: Date
}

interface Station {
  finCity: any
  sweCity: any
  sweAddress: any
  x: number
  y: number
  id: number
  finName: any
  sweName: any
  operator: any
  finAddress: any
  capacity: number
}

function parseStation(data: any): Station | false {
  const station = {
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

  if (!station.id) return false
  if (!station.finName) return false
  if (!station.sweName) return false
  if (!station.finAddress) return false
  if (!station.sweAddress) return false
  if (!station.finCity) return false
  if (!station.sweCity) return false
  if (!station.operator) return false
  if (!station.capacity) return false
  if (!station.x) return false
  if (!station.y) return false

  return station
}

function parseJourney(data: any): Journey | false {
  const newData: Journey = {
    departure: new Date(data['﻿Departure']),
    return: new Date(data.Return),
    departureStationId: +data['Departure station id'],
    departureStationName: data['Departure station name'],
    returnStationId: +data['Return station id'],
    returnStationName: data['Return station name'],
    coveredDistance: +data['Covered distance (m)'],
    duration: +data['Duration (sec.)']
  }

  // No journeys that lasted for less than ten seconds, No journeys that are shorter than 10 meters
  if (newData.duration < 10) return false
  if (newData.coveredDistance < 10) return false

  if (!newData.departureStationId) return false
  if (!newData.returnStationId) return false

  if (badStations.includes(newData.departureStationId)) return false
  if (badStations.includes(newData.returnStationId)) return false

  return newData
}

const journeys: Journey[] = []
const stations: Station[] = []

console.time('Read data')
console.log('Reading')

// fs.createReadStream(stationFiles[0])
//   .pipe(csv())
//   .on('data', (data) => {
//     const newData = parseStation(data)
//     if (newData === false) return
//
//     stations.push(newData)
//   })
//   .on('end', async () => {
//     console.timeEnd('Read data')
//     console.log(stations[0])
//
//     console.time('Write DB')
//
//     const chunkSize = 10000
//     const chunks = []
//     for (let i = 0; i < stations.length; i += chunkSize) {
//       chunks.push(stations.slice(i, i + chunkSize))
//     }
//
//     console.log('Chunks', chunks.length)
//
//     for (let index = 0; index < chunks.length; index++) {
//       const chunk = chunks[index]
//       console.log(`Chunk ${index} of ${chunks.length}`, chunk[0])
//       const ok = await prisma.station.createMany({
//         data: chunk
//       })
//       console.log('Chunk done', index, ok)
//     }
//
//     console.timeEnd('Write DB')
//   })

fs.createReadStream(journeyFiles[2])
  .pipe(csv())
  .on('data', (data) => {
    const newData = parseJourney(data)
    if (newData === false) return

    journeys.push(newData)
  })
  .on('end', async () => {
    console.timeEnd('Read data')
    console.log(journeys[0])

    console.time('Write DB')

    const chunkSize = 10000
    const chunks = []
    for (let i = 0; i < journeys.length; i += chunkSize) {
      chunks.push(journeys.slice(i, i + chunkSize))
    }

    console.log('Chunks', chunks.length)

    for (let index = 0; index < chunks.length; index++) {
      const chunk = chunks[index]
      console.log(`Chunk ${index} of ${chunks.length}`, chunk[0])
      const ok = await prisma.journey.createMany({
        data: chunk
      })
      console.log('Chunk done', index, ok)
    }

    console.timeEnd('Write DB')
  })
