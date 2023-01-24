import * as fs from 'node:fs'
import * as path from 'node:path'
import csv from 'csv-parser'
import { prisma } from './client'
import { Journey, Station } from './types'
import { parseJourney, parseStation } from './parsers'

const filePath = path.resolve(__dirname, '../data/')
const JourneyFiles = ['2021-05.csv', '2021-06.csv', '2021-07.csv']
const StationFiles = ['Pysakit.csv']

const journeyFiles = JourneyFiles.map((file) => filePath + '/' + file)
const stationFiles = StationFiles.map((file) => filePath + '/' + file)

// 754 does not exist in the station data, 997 and 999 are probably service and production

console.time('Read data')
console.log('Reading')

stationFiles.forEach((file) => {
  console.log('READING file', file)
  const stations: Station[] = []

  fs.createReadStream(file)
    .pipe(csv())
    .on('data', (data) => {
      const newData = parseStation(data)
      if (newData === false) return

      stations.push(newData)
    })
    .on('end', async () => {
      console.timeEnd('Read data')
      console.time('Write DB')

      const chunkSize = 10000
      const chunks = []
      for (let i = 0; i < stations.length; i += chunkSize) {
        chunks.push(stations.slice(i, i + chunkSize))
      }

      console.log('Chunks', chunks.length)

      for (let index = 0; index < chunks.length; index++) {
        const chunk = chunks[index]
        console.log(`Chunk ${index} of ${chunks.length}`)
        const ok = await prisma.station.createMany({
          data: chunk
        })
        console.log('Chunk done', index, ok)
      }

      console.timeEnd('Write DB')
    })
})

journeyFiles.forEach((file) => {
  console.log('READING', file)
  const journeys: Journey[] = []

  fs.createReadStream(file)
    .pipe(csv())
    .on('data', (data) => {
      const newData = parseJourney(data)
      if (newData === false) return

      journeys.push(newData)
    })
    .on('end', async () => {
      console.timeEnd('Read data')
      console.time('Write DB')

      console.log('READ', journeys.length, 'journeys')

      const chunkSize = 10000
      const chunks = []
      for (let i = 0; i < journeys.length; i += chunkSize) {
        chunks.push(journeys.slice(i, i + chunkSize))
      }

      console.log('Chunks', chunks.length)

      for (let index = 0; index < chunks.length; index++) {
        const chunk = chunks[index]
        console.log(`Chunk ${index} of ${chunks.length}`)
        const ok = await prisma.journey.createMany({
          data: chunk
        })
        console.log('Chunk done', index, ok)
      }

      console.timeEnd('Write DB')
    })
})
