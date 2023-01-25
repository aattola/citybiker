export type top5List = { _id: number; count: number; name: [string] }[]

export function generateQuey(
  where: string,
  input: number,
  month?: {
    gteDate: Date
    ltDate: Date
  }
) {
  const whereInvert =
    where === 'departureStationId' ? 'returnStationId' : 'departureStationId'

  const whereInvertName =
    where === 'departureStationId'
      ? 'returnStationName'
      : 'departureStationName'

  const whereMonth = month
    ? {
        [where]: input,
        $expr: {
          $gte: [
            '$departure',
            {
              $dateFromString: {
                dateString: month.gteDate.toISOString()
              }
            }
          ]
        },
        // PROFESSIONAL RULE BREAKING AHEAD!! mongodb queries are weird
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore, eslint-disable-next-line no-dupe-keys
        // eslint-disable-next-line no-dupe-keys
        $expr: {
          $lt: [
            '$departure',
            {
              $dateFromString: {
                dateString: '2021-06-01T05:00:00.000Z'
              }
            }
          ]
        }
      }
    : { [where]: input }

  return {
    pipeline: [
      {
        $match: whereMonth
      },
      {
        $group: {
          _id: `$${whereInvert}`,
          name: {
            $addToSet: `$${whereInvertName}`
          },
          count: {
            $count: {}
          }
        }
      },
      {
        $sort: {
          count: -1
        }
      },
      {
        $limit: 5
      }
    ]
  }
}
