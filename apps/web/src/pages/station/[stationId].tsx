import { useRouter } from 'next/router'
import { NextPage } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import Skeleton from 'react-loading-skeleton'
import React, { useState } from 'react'
import { Select } from '@chakra-ui/react'
import { api } from '../../utils/api'

const MapWithNoSSR = dynamic(() => import('../../components/Map'), {
  ssr: false,
  loading: () => <Skeleton />
})

const selectValues = [
  { value: 'all', label: 'All' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' }
]

const StationById: NextPage = () => {
  const [monthFilter, setMonthFilter] = useState<string>('all')
  const router = useRouter()
  const { stationId } = router.query

  const id = +(stationId as string)

  const stationQuery = api.station.byId.useQuery(id, {
    enabled: router.isReady
  })

  const top5Query = api.station.getTopById.useQuery(id, {
    enabled: router.isReady
  })

  const stationTime = api.station.byIdFilteredByMonth.useQuery(
    {
      id,
      month: +monthFilter
    },
    {
      enabled: monthFilter !== 'all' && router.isReady
    }
  )

  if (stationQuery.isLoading) return <h1>Loading</h1>

  if (!stationQuery.isSuccess || !stationQuery.data)
    return <p>Something broke</p>
  const station = stationQuery.data

  // Station name
  // Station address
  // Total number of journeys starting from the station
  // Total number of journeys ending at the station
  return (
    <div>
      <Head>
        <title>Citybiker - Station {station.finName}</title>
      </Head>
      <h1>{station.finName}</h1>
      <h2>{station.finAddress}</h2>

      <Select
        placeholder="Filter journeys by month"
        zIndex={1234}
        value={monthFilter}
        onChange={(e) => setMonthFilter(e.target.value)}
      >
        {selectValues.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>

      {/* TODO: REFACTOR TO SOMETHING MUCH NICER */}
      <h2>
        Total number of journeys starting from the station
        {stationTime.data && monthFilter !== 'all' ? (
          <>
            {' '}
            in {stationTime.data.monthName}: {stationTime.data.starting}{' '}
          </>
        ) : (
          <>: {station._count.departureCount}</>
        )}
      </h2>

      <h2>
        Total number of journeys ending at the station
        {stationTime.data && monthFilter !== 'all' ? (
          <>
            {' '}
            in {stationTime.data.monthName}: {stationTime.data.ending}{' '}
          </>
        ) : (
          <>: {station._count.returnCount}</>
        )}
      </h2>

      <h2>Top 5 most popular return stations for journeys starting here</h2>

      {top5Query.isLoading && <Skeleton />}

      {/* TODO: MAKE DEPARTURE STATIONS TOO AND MAKE THIS LOOK NICE */}

      {top5Query.isSuccess && top5Query.data && (
        <ul>
          {top5Query.data.map((station) => (
            <li key={station._id}>{station.name[0]}</li>
          ))}
        </ul>
      )}

      <div style={{ height: 400, width: 400 }}>
        <MapWithNoSSR
          stations={[station]}
          center={[station.y, station.x]}
          zoom={16}
        />
      </div>
    </div>
  )
}

export default StationById
