import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import Link from 'next/link'
import { api } from '../utils/api'

const Stations: NextPage = () => {
  const [cursor, setCursor] = useState<number | null>(null)
  const stationQuery = api.station.getAll.useQuery({
    take: 50,
    cursor
  })

  if (stationQuery.isLoading) {
    return <h1>Loading</h1>
  }

  if (!stationQuery.isSuccess) {
    return <h1>Failed</h1>
  }

  function handleNext() {
    const lastIndex = stationQuery.data!.length - 1
    const lastId = stationQuery.data![lastIndex].id
    setCursor(lastId)
  }

  return (
    <>
      <Head>
        <title>Citybiker - Stations</title>
      </Head>
      <main>
        {stationQuery.data.map((station) => (
          <div key={station.id}>
            <Link href={`/station/${station.id}`}>{station.finName}</Link>
            <h3>{station.finAddress}</h3>
          </div>
        ))}

        <button onClick={handleNext}>load next 50 stations</button>
      </main>
    </>
  )
}

export default Stations
