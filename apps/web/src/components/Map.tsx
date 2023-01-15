import React from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import Bike from '@citybiker/web/public/bike.png'
import 'leaflet/dist/leaflet.css'

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
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      style={{ height: '100%', width: '100%' }}
      attributionControl={false}
    >
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {stations.map((station: any) => (
        <Marker
          position={[station.y, station.x]}
          icon={bikeIcon}
          key={station.id}
          // eventHandlers={{
          //   click: () => {
          //     console.log('ok ')
          //   }
          // }}
        />
      ))}
    </MapContainer>
  )
}

export default Map
