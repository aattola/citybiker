import { PrismaClient, Journey } from '@citybiker/db'

export async function searchJourney(prisma: PrismaClient, searchTerm: string) {
  const rawSearch = await prisma.journey.aggregateRaw({
    pipeline: [
      {
        $search: {
          index: 'journeyIndex',
          text: {
            query: searchTerm,
            path: ['returnStationName', 'departStationName', '_id']
          }
        }
      },
      {
        $limit: 10
      }
    ]
  })

  return rawSearch as unknown as Journey[]
}
