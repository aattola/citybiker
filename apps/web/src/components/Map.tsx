import React from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import Bike from '@citybiker/web/public/bike.png'
import 'leaflet/dist/leaflet.css'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { useRouter } from 'next/router'

const bikeIcon = new L.Icon({
  iconUrl: Bike.src,
  iconRetinaUrl: Bike.src,
  popupAnchor: [-0, -0],
  iconSize: [30, 30]
})
const Map = ({
  stations,
  center,
  zoom
}: {
  stations: any[]
  center: [number, number]
  zoom: number
}) => {
  const router = useRouter()

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      style={{ height: '100%', width: '100%' }}
      attributionControl={false}
    >
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <MarkerClusterGroup chunkedLoading>
        {stations.map((station: any) => (
          <Marker
            position={[station.y, station.x]}
            icon={bikeIcon}
            key={station.id}
            eventHandlers={{
              mouseover: () => {
                router.prefetch(`/station/${station.id}`)
              },
              click: () => {
                router.push(`/station/${station.id}`)
              }
            }}
          />
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  )
}

export default Map
