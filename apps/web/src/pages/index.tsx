import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Logo from '@citybiker/web/public/android-chrome-192x192.png'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Citybiker - Main</title>
        <link rel="icon" href="/favicon.ico" />
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
      </main>
    </>
  )
}

export default Home
