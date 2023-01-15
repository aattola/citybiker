import { useRouter } from 'next/router'
import { NextPage } from 'next'
import GoogleMapReact from 'google-map-react'
import Image from 'next/image'
import Bike from '@citybiker/web/public/bike.png'
import Head from 'next/head'
import { api } from '../../utils/api'
const MapPointer = ({ lat, lng }) => {
  const wh = 30

  return (
    <Image
      src={Bike}
      height={wh}
      width={wh}
      style={{ transform: `translate3d(-${wh / 2}px, -${wh / 2}px, 0px)` }}
      alt={`Bike station at ${lat}, ${lng}`}
    />
  )
}

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
        <GoogleMapReact
          bootstrapURLKeys={{
            key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          }}
          defaultCenter={{
            lat: station.y,
            lng: station.x
          }}
          defaultZoom={16}
        >
          <MapPointer lat={station.y} lng={station.x} />
        </GoogleMapReact>
      </div>
    </div>
  )
}

export default StationById
