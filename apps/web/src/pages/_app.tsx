// src/pages/_app.tsx
import '../styles/globals.css'
import type { AppType } from 'next/app'
import { MantineProvider } from '@mantine/core'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { api } from '../utils/api'
import Appbar from '../components/appbar'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    }
  }
})

const CustomApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  const router = useRouter()

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        /** Put your mantine theme override here */
        colorScheme: 'light'
      }}
    >
      <QueryClientProvider client={queryClient}>
        {router.pathname !== '/' && <Appbar />}

        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </MantineProvider>
  )
}

export default api.withTRPC(CustomApp)
