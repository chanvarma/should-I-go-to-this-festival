'use client'

import { useState } from 'react'
import { SessionProvider } from "next-auth/react"
import { IS_PREVIEW } from '@/lib/constants'

// Mock session for preview environment
const MOCK_SESSION = {
  user: { name: "Preview User", email: "preview@example.com" },
  expires: "2100-01-01T00:00:00.000Z"
}

export function PreviewWrapper({ children }: { children: React.ReactNode }) {
  const [mockSession, setMockSession] = useState<any>(null)

  if (!IS_PREVIEW) {
    return <SessionProvider>{children}</SessionProvider>
  }

  return (
    <SessionProvider session={mockSession}>
      {children}
    </SessionProvider>
  )
}

