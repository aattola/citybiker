export interface Journey {
  duration: number
  returnStationId: number
  coveredDistance: number
  departureStationId: number
  departureStationName: string
  returnStationName: string
  departure: Date
  return: Date
}

export interface Station {
  finCity: string
  sweCity: string
  sweAddress: string
  x: number
  y: number
  id: number
  finName: string
  sweName: string
  operator: string
  finAddress: string
  capacity: number
}
