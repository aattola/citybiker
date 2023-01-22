import { useRouter } from 'next/router'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Card,
  CardBody,
  Heading,
  HStack,
  Select,
  SkeletonText,
  Spinner,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import { prisma } from '@citybiker/db'
import { api } from '../../utils/api'
import { convertDistance } from '../../utils/units'
import { stationQuery } from '../../queries/stationQuery'

const Skeleton = () => (
  <SkeletonText noOfLines={1} skeletonHeight={7} maxW="75px" />
)

export async function getStaticPaths() {
  const stations = await prisma.station.findMany()

  const paths = stations.map((station) => ({
    params: { stationId: station.id.toString() }
  }))

  return {
    paths,
    fallback: false // can also be true or 'blocking'
  }
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const id = context.params?.stationId

  if (!id || typeof id !== 'string') {
    return {
      notFound: true
    }
  }

  const _station = await prisma.station.findUnique({
    where: {
      id: +id
    }
  })

  if (!_station) {
    return {
      notFound: true
    }
  }

  const info = await stationQuery(+id)

  return {
    props: { station: _station, info },
    revalidate: 60
  }
}

const MapWithNoSSR = dynamic(() => import('../../components/Map'), {
  ssr: false,
  loading: () => <Skeleton />
})

const selectValues = [
  { value: 'all', label: 'All' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' }
]

function Loader() {
  return (
    <div className="flex align-center content-center justify-center my-2">
      <Spinner />
    </div>
  )
}

const StationById = ({
  station,
  info
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [monthFilter, setMonthFilter] = useState<string>('all')
  const router = useRouter()
  const { stationId } = router.query

  const id = +(stationId as string)

  const top5Query = api.station.getTopById.useQuery(id, {
    enabled: router.isReady
  })

  // const stationInfoQuery = api.station.getStatsById.useQuery(id, {
  //   enabled: router.isReady
  // })

  const stationTime = api.station.byIdFilteredByMonth.useQuery(
    {
      id,
      month: +monthFilter
    },
    {
      enabled: monthFilter !== 'all' && router.isReady
    }
  )

  const endedJourneys =
    monthFilter !== 'all'
      ? stationTime.data?.ending
      : info?.counts?._count.endedJourneys
  const startedJourneys =
    monthFilter !== 'all'
      ? stationTime.data?.starting
      : info?.counts?._count.startedJourneys

  const avgDepartureDistance =
    monthFilter !== 'all'
      ? stationTime.data?.avgDepartureStats._avg?.coveredDistance
      : info?.avgDepartureStats._avg?.coveredDistance
  const avgReturnDistance =
    monthFilter !== 'all'
      ? stationTime.data?.avgReturnStats._avg?.coveredDistance
      : info?.avgReturnStats._avg?.coveredDistance

  const infoPaused = stationTime.fetchStatus === 'idle'

  const startingFrom =
    monthFilter !== 'all'
      ? stationTime.data?.startingFrom
      : top5Query.data?.startingFrom

  const endingAt =
    monthFilter !== 'all'
      ? stationTime.data?.endingAt
      : top5Query.data?.endingAt

  return (
    <div>
      <Head>
        <title>Citybiker - Station {station.finName}</title>
      </Head>

      <Card className="max-w-3xl m-auto my-4">
        <CardBody>
          <Stack mt="6" spacing="3">
            <div>
              <Heading size="md" py={1}>
                {station.finAddress}
              </Heading>
              <p className="m-0 mt-0">{station.finName}</p>
            </div>

            <HStack>
              <div>
                <p>Total number of journeys starting from the station:</p>

                <Heading size="md" py={1}>
                  {info && startedJourneys !== undefined ? (
                    startedJourneys
                  ) : (
                    <Skeleton />
                  )}
                </Heading>
              </div>

              <div>
                <p> Total number of journeys ending at the station</p>

                <Heading size="md" py={1}>
                  {info && endedJourneys !== undefined ? (
                    endedJourneys
                  ) : (
                    <Skeleton />
                  )}
                </Heading>
              </div>
            </HStack>

            <HStack>
              <div>
                <p>
                  The average distance of a journey starting from the station
                </p>

                <Heading size="md" py={1}>
                  {info && avgDepartureDistance ? (
                    convertDistance(avgDepartureDistance) + ' km'
                  ) : (
                    <Skeleton />
                  )}
                </Heading>
              </div>

              <div>
                <p>The average distance of a journey ending at the station</p>

                <Heading size="md" py={1}>
                  {info && avgReturnDistance ? (
                    convertDistance(avgReturnDistance) + ' km'
                  ) : (
                    <Skeleton />
                  )}
                </Heading>
              </div>
            </HStack>

            <Select
              zIndex={1234}
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              icon={
                !infoPaused && stationTime.status === 'loading' ? (
                  <Loader />
                ) : (
                  <ChevronDownIcon />
                )
              }
            >
              {selectValues.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>

            <Accordion allowMultiple>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      Top 5
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  {top5Query.isLoading && <Loader />}
                  {top5Query.isSuccess && (
                    <>
                      <HStack>
                        <div>
                          <h1>
                            Top 5 return stations for journeys starting from
                          </h1>
                          <TableContainer>
                            <Table>
                              <Thead>
                                <Tr>
                                  <Th>Station</Th>
                                  <Th>Count</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {startingFrom ? (
                                  startingFrom.map((station) => (
                                    <Tr key={station._id}>
                                      <Td>
                                        <Link
                                          prefetch={false}
                                          href={`/station/${station._id}`}
                                        >
                                          {station.name[0]}
                                        </Link>
                                      </Td>
                                      <Td>{station.count}</Td>
                                    </Tr>
                                  ))
                                ) : (
                                  <div className="p-4">
                                    <Spinner />
                                  </div>
                                )}
                              </Tbody>
                            </Table>
                          </TableContainer>
                        </div>

                        <div>
                          <h1>
                            Top 5 departure stations for journeys ending here
                          </h1>
                          <TableContainer>
                            <Table>
                              <Thead>
                                <Tr>
                                  <Th>Station</Th>
                                  <Th>Count</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {endingAt ? (
                                  endingAt.map((station) => (
                                    <Tr key={station._id}>
                                      <Td>
                                        <Link href={`/station/${station._id}`}>
                                          {station.name[0]}
                                        </Link>
                                      </Td>
                                      <Td>{station.count}</Td>
                                    </Tr>
                                  ))
                                ) : (
                                  <div className="p-4">
                                    <Spinner />
                                  </div>
                                )}
                              </Tbody>
                            </Table>
                          </TableContainer>
                        </div>
                      </HStack>
                    </>
                  )}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>

            <Card borderRadius={8} overflow="hidden" variant="filled">
              <div style={{ height: 300, width: 'auto' }}>
                <MapWithNoSSR
                  stations={[station]}
                  center={[station.y, station.x]}
                  zoom={16}
                />
              </div>
            </Card>
          </Stack>
        </CardBody>
      </Card>
    </div>
  )
}

export default StationById
