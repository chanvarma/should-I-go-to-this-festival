'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import { LOADING_MESSAGES } from "@/lib/constants"

export default function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((current) => (current + 1) % LOADING_MESSAGES.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-center">
      <Button disabled size="lg" className="bg-purple-600">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {LOADING_MESSAGES[messageIndex]}
      </Button>
    </div>
  )
}

