import type { InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import React, { useState } from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Spinner,
  InputGroup,
  InputRightElement,
  Input
} from '@chakra-ui/react'
import Link from 'next/link'
import { Journey, prisma } from '@citybiker/db'
import { getJourneysWithCursor } from '@citybiker/api/src/router/journey/getWithCursor'
import { api } from '../utils/api'
import { convertDistance, convertTime } from '../utils/units'
import { useDebounce } from '../utils/useDebounce'

export const getStaticProps = async () => {
  const ssrJourneys = await getJourneysWithCursor(prisma, {
    take: 50
  })

  const journeys = JSON.parse(JSON.stringify(ssrJourneys)) as Journey[]

  return {
    props: {
      ssrJourneys: journeys
    },
    revalidate: 60
  }
}

type Sortable = 'id' | 'coveredDistance' | 'duration'
type SortableWay = 'desc' | 'asc'

const Journeys = ({
  ssrJourneys
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<Sortable>('id')
  const [way, setWay] = useState<SortableWay>('desc')
  const debouncedSearch = useDebounce(search, 500)
  const journeyQuery = api.journey.getAll.useInfiniteQuery(
    {
      take: 50,
      orderBy: {
        [sortBy]: way
      }
    },
    {
      initialData: {
        pages: [ssrJourneys],
        pageParams: [undefined]
      },
      getNextPageParam: (lastPage) => {
        if (lastPage.length < 50) return null
        return lastPage[lastPage.length - 1].id
      }
    }
  )

  const searchQuery = api.journey.search.useQuery(debouncedSearch, {
    enabled: debouncedSearch.length > 0,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000
  })

  function setSort(by: Sortable) {
    if (by === sortBy) {
      if (way === 'desc') {
        setWay('asc')
      } else {
        setWay('desc')
      }
    }

    setSortBy(by)
  }

  function resetFilters() {
    setSort('id')
    setWay('desc')
    setSearch('')
  }

  if (journeyQuery.isLoading) {
    return (
      <div className="flex align-center content-center justify-center my-2">
        <Spinner />
      </div>
    )
  }

  if (!journeyQuery.isSuccess) {
    return <h1>Failed</h1>
  }

  const journeys =
    searchQuery.isSuccess && search.length > 0
      ? [searchQuery.data]
      : journeyQuery.data.pages

  return (
    <>
      <Head>
        <title>Citybiker - Journeys</title>
      </Head>
      <main className="px-4 pb-4 max-w-5xl m-auto my-4">
        <TableContainer>
          {sortBy !== 'id' && (
            <Button onClick={resetFilters} ml={4}>
              Reset filters
            </Button>
          )}
          <InputGroup maxW="sm" my={1} mb={3} ml={3}>
            <Input
              variant="outline"
              placeholder="Search for journeys"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <InputRightElement>
              {searchQuery.isFetching && <Spinner />}
              {journeyQuery.isFetching && <Spinner />}
            </InputRightElement>
          </InputGroup>

          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Departure station</Th>
                <Th>Return station</Th>
                <Th
                  cursor="pointer"
                  onClick={() => setSort('coveredDistance')}
                  isNumeric
                >
                  Distance travelled (km)
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => setSort('duration')}
                  isNumeric
                >
                  Duration of the ride (min)
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {journeys.map((journeyPage, i) => (
                <React.Fragment key={i}>
                  {journeyPage.map((journey) => (
                    <Tr key={journey.id}>
                      <Td>
                        <Link
                          prefetch={false}
                          href={`/station/${journey.departureStationId}`}
                        >
                          {journey.departureStationName}
                        </Link>
                      </Td>
                      <Td>
                        <Link
                          prefetch={false}
                          href={`/station/${journey.returnStationId}`}
                        >
                          {journey.returnStationName}
                        </Link>
                      </Td>
                      <Td isNumeric>
                        {convertDistance(journey.coveredDistance)}
                      </Td>
                      <Td isNumeric>{convertTime(journey.duration)}</Td>
                    </Tr>
                  ))}
                </React.Fragment>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        {sortBy === 'id' && search.length === 0 && (
          <Button
            onClick={() => journeyQuery.fetchNextPage()}
            isLoading={journeyQuery.isFetchingNextPage}
            variant="ghost"
            className="my-2"
          >
            {journeyQuery.isFetchingNextPage ? 'Loading more...' : 'Load More'}
          </Button>
        )}
      </main>
    </>
  )
}

export default Journeys
