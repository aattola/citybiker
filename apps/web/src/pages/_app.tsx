// src/pages/_app.tsx
import '../styles/globals.css'
import type { AppType } from 'next/app'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { api } from '../utils/api'

const queryClient = new QueryClient()

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}

export default api.withTRPC(MyApp)
