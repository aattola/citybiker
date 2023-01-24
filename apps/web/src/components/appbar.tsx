import React from 'react'
import Image from 'next/image'
import Logo from '@citybiker/web/public/android-chrome-192x192.png'
import Link from 'next/link'
import Head from 'next/head'
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'

const Appbar = () => {
  return (
    <div className="flex items-center p-2">
      <Head>
        <title>Citybiker</title>
      </Head>
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

      <Menu>
        <MenuButton ml="auto" as={Button} rightIcon={<AddIcon />}>
          Create
        </MenuButton>
        <MenuList>
          <Link href="/create/journey">
            <MenuItem>Journey</MenuItem>
          </Link>
          <Link href="/create/station">
            <MenuItem>Station</MenuItem>
          </Link>
        </MenuList>
      </Menu>
    </div>
  )
}

export default Appbar
