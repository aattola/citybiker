import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Logo from '@citybiker/web/public/android-chrome-192x192.png'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Skeleton from 'react-loading-skeleton'
import { prisma } from '@citybiker/db'

const MapWithNoSSR = dynamic(() => import('../components/Map'), {
  ssr: false,
  loading: () => <Skeleton />
})

export const getStaticProps: GetStaticProps = async () => {
  const stations = await prisma.station.findMany({
    select: {
      x: true,
      y: true,
      id: true,
      finName: true,
      sweName: true
    }
  })

  if (!stations) {
    return {
      notFound: true
    }
  }

  return {
    props: { stations }
  }
}
const Home: NextPage = ({
  stations
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  // const stationsQuery = api.station.getAllMapPoints.useQuery()

  return (
    <>
      <Head>
        <title>Citybiker - Main</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://tile.openstreetmap.org/" />
      </Head>
      <main className="flex h-screen flex-col items-center bg-gray-100 text-black">
        <div className="container flex flex-col items-center justify-center gap-6 px-4 py-8">
          <div className="flex items-center justify-center">
            <Image
              style={{ borderRadius: 12 }}
              src={Logo}
              alt="Citybiker Logo"
              width={55}
              height={55}
            />

            <h1 className="ml-4 text-3xl font-bold">Citybiker</h1>
          </div>

          <div className="flex flex-auto gap-6 underline">
            <Link href="/journeys">
              <h1>Journeys</h1>
            </Link>

            <Link href="/stations">
              <h1>Stations</h1>
            </Link>
          </div>
        </div>

        <MapWithNoSSR
          zoom={10}
          center={[60.1975, 24.93213]}
          stations={stations}
        />
      </main>
    </>
  )
}

export default Home
