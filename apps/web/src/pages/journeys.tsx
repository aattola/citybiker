import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { api } from '../utils/api'

// convert seconds to minutes and hours
const convertTime = (time: number) => {
  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time - hours * 3600) / 60)
  const seconds = time - hours * 3600 - minutes * 60
  if (hours) return `${hours}h ${minutes}m ${seconds}s`
  return `${minutes}m ${seconds}s`
}

const convertDistance = (distance: number) => {
  return (distance / 1000).toFixed(1)
}
const Journeys: NextPage = () => {
  const [cursor, setCursor] = useState<string | null>(null)
  const journeyQuery = api.journey.getAll.useQuery({
    take: 50,
    cursor
  })

  console.log(journeyQuery)

  if (journeyQuery.isLoading) {
    return <h1>Loading</h1>
  }

  if (!journeyQuery.isSuccess) {
    return <h1>Failed</h1>
  }

  function handleNext() {
    if (!journeyQuery.data) return

    const lastIndex = journeyQuery.data.length - 1
    const lastId = journeyQuery.data[lastIndex].id
    setCursor(lastId)
  }

  return (
    <>
      <Head>
        <title>Citybiker - Journeys</title>
      </Head>
      <main>
        {journeyQuery.data.map((journey) => (
          <div key={journey.id}>
            <h3>
              from {journey.departureStationName} to {journey.returnStationName}{' '}
              distance: {convertDistance(journey.coveredDistance)} km duration:{' '}
              {convertTime(journey.duration)}
            </h3>
          </div>
        ))}

        <button onClick={handleNext}>load next 50 journeys</button>
      </main>
    </>
  )
}

export default Journeys
