import { useRouter } from 'next/router'
import { NextPage } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { api } from '../../utils/api'

const MapWithNoSSR = dynamic(() => import('../../components/Map'), {
  ssr: false
})

const StationById: NextPage = () => {
  const router = useRouter()
  const { stationId } = router.query

  console.log(stationId)

  if (typeof stationId !== 'string') return <h1>Invalid station id</h1>

  const stationQuery = api.station.byId.useQuery(+stationId)

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

      <h2>
        Count of journeys starting from the station:{' '}
        {station._count.startedJourneys}
      </h2>
      <h2>
        Count of journeys ending at the station: {station._count.endedJourneys}
      </h2>

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
