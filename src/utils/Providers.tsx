'use client'

import { ReactNode } from 'react'
import { useState } from 'react'
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
            },
        },
    }))
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}