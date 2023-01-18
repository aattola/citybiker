import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useState } from 'react'
import Link from 'next/link'
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react'
import { api } from '../utils/api'
import { useDebounce } from '../utils/useDebounce'

const Stations: NextPage = () => {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const stationQuery = api.station.getAll.useInfiniteQuery(
    {
      take: 50
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.length < 50) return null
        return lastPage[lastPage.length - 1].id
      }
    }
  )

  const searchQuery = api.station.search.useQuery(debouncedSearch, {
    enabled: debouncedSearch.length > 0,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000
  })

  if (stationQuery.isLoading) {
    return (
      <div className="flex align-center content-center justify-center my-2">
        <Spinner />
      </div>
    )
  }

  if (!stationQuery.isSuccess) {
    return <h1>Failed</h1>
  }

  const isCurrentlySearch = searchQuery.isSuccess && search.length > 0

  return (
    <>
      <Head>
        <title>Citybiker - Stations</title>
      </Head>
      <main className="px-4 pb-4 max-w-2xl m-auto my-4">
        <TableContainer>
          <InputGroup maxW="sm" my={1} mb={3} ml={3}>
            <Input
              variant="outline"
              placeholder="Search for stations"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <InputRightElement>
              {searchQuery.isFetching && <Spinner />}
            </InputRightElement>
          </InputGroup>

          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Address</Th>
              </Tr>
            </Thead>

            {isCurrentlySearch ? (
              <Tbody>
                {searchQuery.data.map((station) => (
                  <Tr key={station.id}>
                    <Td>
                      <Link href={`/station/${station.id}`}>
                        {station.finName}
                      </Link>
                    </Td>
                    <Td>
                      <Link href={`/station/${station.id}`}>
                        {station.finAddress}
                      </Link>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            ) : (
              <Tbody>
                {stationQuery.data.pages.map((stationPage, i) => (
                  <React.Fragment key={i}>
                    {stationPage.map((station) => (
                      <Tr key={station.id}>
                        <Td>
                          <Link href={`/station/${station.id}`}>
                            {station.finName}
                          </Link>
                        </Td>
                        <Td>
                          <Link href={`/station/${station.id}`}>
                            {station.finAddress}
                          </Link>
                        </Td>
                      </Tr>
                    ))}
                  </React.Fragment>
                ))}
              </Tbody>
            )}
            <Tbody />
          </Table>
        </TableContainer>

        {!isCurrentlySearch && (
          <Button
            onClick={() => stationQuery.fetchNextPage()}
            isLoading={stationQuery.isFetchingNextPage}
            variant="ghost"
            className="my-2"
          >
            {stationQuery.isFetchingNextPage ? 'Loading more...' : 'Load More'}
          </Button>
        )}
      </main>
    </>
  )
}

export default Stations
