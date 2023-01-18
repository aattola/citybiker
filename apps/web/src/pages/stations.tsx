import type { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import Link from 'next/link'
import {
  Button,
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

const Stations: NextPage = () => {
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

  return (
    <>
      <Head>
        <title>Citybiker - Stations</title>
      </Head>
      <main className="px-4 pb-4 max-w-2xl m-auto my-4">
        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Address</Th>
              </Tr>
            </Thead>
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
          </Table>
        </TableContainer>

        <Button
          onClick={() => stationQuery.fetchNextPage()}
          isLoading={stationQuery.isFetchingNextPage}
          variant="ghost"
          className="my-2"
        >
          {stationQuery.isFetchingNextPage ? 'Loading more...' : 'Load More'}
        </Button>
      </main>
    </>
  )
}

export default Stations
