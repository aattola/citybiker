import { PrismaClient } from '@citybiker/db'

export type JourneySearchResult = {
  id: string
  finName: string
  finAddress: string
}
export async function searchStations(prisma: PrismaClient, searchTerm: string) {
  const rawSearch = await prisma.station.aggregateRaw({
    pipeline: [
      {
        $search: {
          index: 'stationIndex',
          autocomplete: {
            query: searchTerm,
            path: 'finName',
            fuzzy: {},
            tokenOrder: 'any'
          }
        }
      },
      {
        $limit: 10
      }
    ]
  })

  return rawSearch as unknown as JourneySearchResult[]
}
