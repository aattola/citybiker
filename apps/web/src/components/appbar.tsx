import React from 'react'
import Image from 'next/image'
import Logo from '@citybiker/web/public/android-chrome-192x192.png'
import Link from 'next/link'

const Appbar = () => {
  return (
    <div className="flex items-center p-2">
      <Link href="/">
        <div className="flex items-center">
          <Image
            style={{ borderRadius: 12 }}
            src={Logo}
            alt="Citybiker Logo"
            width={40}
            height={40}
          />

          <h1 className="ml-2 text-2xl font-bold">Citybiker</h1>
        </div>
      </Link>

      <div className="flex flex-row gap-4 ml-6 underline text-lg">
        <Link href="/journeys">
          <h2>Journeys</h2>
        </Link>

        <Link href="/stations">
          <h2>Stations</h2>
        </Link>
      </div>
    </div>
  )
}

export default Appbar
