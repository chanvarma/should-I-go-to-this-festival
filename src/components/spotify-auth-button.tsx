'use client'

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Loader2, Music2 } from 'lucide-react'

export function SpotifyAuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <Button disabled size="lg">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting to Spotify...
      </Button>
    )
  }

  if (session) {
    return (
      <Button 
        onClick={() => signOut()} 
        size="lg" 
        variant="outline"
      >
        Disconnect from Spotify
      </Button>
    )
  }

  return (
    <Button
      onClick={() => signIn("spotify")}
      size="lg"
      className="bg-green-500 hover:bg-green-600"
    >
      <Music2 className="mr-2 h-4 w-4" />
      Connect with Spotify
    </Button>
  )
}

