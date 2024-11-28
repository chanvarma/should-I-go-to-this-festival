'use client'

import { useState, useRef, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, Music2, CheckCircle2, ImageIcon } from 'lucide-react'
import { MOCK_FESTIVAL_RESPONSE, MOCK_SPOTIFY_RESPONSE, IS_PRODUCTION } from "@/lib/constants"
import LoadingState from "@/components/loading-state"

function getMatchStatus(artist: string, topArtists: string[]) {
  const exactMatch = topArtists.some(a => a.toLowerCase() === artist.toLowerCase())
  return exactMatch ? 'exact' : 'none'
}

export default function HomePage() {
  const { data: session, status } = useSession()
  const [festivalArtists, setFestivalArtists] = useState<string[]>([])
  const [matchPercentage, setMatchPercentage] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [topArtists, setTopArtists] = useState<string[]>([])
  const [isConnecting, setIsConnecting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadMockData = async () => {
    setIsConnecting(true)
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    setTopArtists(MOCK_SPOTIFY_RESPONSE.topArtists)
    setIsConnecting(false)
  }
  
  useEffect(() => {
    async function fetchTopArtists() {
      if (session?.accessToken) {
        try {
          const firstResponse = await fetch(
            'https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50&offset=0',
            {
              headers: {
                Authorization: `Bearer ${session.accessToken}`
              }
            }
          )
          const firstData = await firstResponse.json()

          const secondResponse = await fetch(
            'https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50&offset=50',
            {
              headers: {
                Authorization: `Bearer ${session.accessToken}`
              }
            }
          )
          const secondData = await secondResponse.json()

          const allItems = [...firstData.items, ...secondData.items]
          const artists = allItems.map((item: any) => item.name)
          setTopArtists(artists)
        } catch (error) {
          console.error('Error fetching top artists:', error)
          setTopArtists(MOCK_SPOTIFY_RESPONSE.topArtists)
        }
      }
    }

    if (status === "authenticated") {
      fetchTopArtists()
    }
  }, [session, status])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setFestivalArtists(MOCK_FESTIVAL_RESPONSE.artists)

    const matchedArtists = MOCK_FESTIVAL_RESPONSE.artists.filter(artist => 
      topArtists.some(topArtist => topArtist.toLowerCase() === artist.toLowerCase())
    )
    const percentage = Math.round((matchedArtists.length / MOCK_FESTIVAL_RESPONSE.artists.length) * 100)
    setMatchPercentage(percentage)

    setIsUploading(false)
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-red-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <Music2 className="mx-auto h-16 w-16 text-purple-600" />
            <h1 className="mt-8 text-4xl font-bold sm:text-6xl bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
              Should I go to this festival?
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Connect with Spotify, show us a festival lineup, and we'll tell you if it's worth your time and money.
            </p>
          </div>

          {/* Main Content */}
          {(status === "loading" && IS_PRODUCTION) || isConnecting ? (
            <LoadingState />
          ) : !topArtists.length ? (
            <div className="text-center">
              <Button 
                onClick={() => IS_PRODUCTION ? signIn("spotify") : loadMockData()} 
                size="lg" 
                className="bg-purple-600 hover:bg-purple-700"
              >
                Connect with Spotify
              </Button>
            </div>
          ) : (
            <>
              {/* Spotify Connection Status */}
              <div className="flex items-center justify-center gap-2 text-purple-600 mb-8">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">
                  {IS_PRODUCTION ? "Connected to Spotify" : "Using Test Data"}
                </span>
              </div>

              {/* Two Panel Layout */}
              <div className="grid gap-8 md:grid-cols-2">
                {/* Left Panel - Your Artists */}
                <Card className="p-6 border-purple-100 bg-white/80 backdrop-blur-sm">
                  <h2 className="text-xl font-semibold mb-4 text-purple-900">Your Top Artists</h2>
                  <ul className="space-y-2">
                    {topArtists.map((artist) => (
                      <li key={artist} className="rounded-lg bg-purple-50 p-3 text-purple-900">
                        {artist}
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Right Panel - Festival Upload */}
                <Card className="p-6 border-orange-100 bg-white/80 backdrop-blur-sm">
                  <h2 className="text-xl font-semibold mb-4 text-orange-900">Festival Lineup</h2>
                  {isUploading ? (
                    <div className="text-center py-8">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-orange-600" />
                      <p className="mt-4 text-orange-900">Processing festival lineup...</p>
                    </div>
                  ) : festivalArtists.length === 0 ? (
                    <div className="text-center py-8">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <p className="mb-6 text-gray-600">Now upload a festival lineup to see if it's worth your time!</p>
                      <Button 
                        onClick={triggerFileUpload}
                        size="lg"
                        className="gap-2 bg-orange-600 hover:bg-orange-700"
                      >
                        <ImageIcon className="h-4 w-4" />
                        Upload Festival Lineup
                      </Button>
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {festivalArtists.map((artist) => {
                        const matchStatus = getMatchStatus(artist, topArtists)
                        return (
                          <li
                            key={artist}
                            className={`rounded-lg p-3 ${
                              matchStatus === 'exact'
                                ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-900'
                                : 'bg-orange-50 text-orange-900'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{artist}</span>
                              {matchStatus === 'exact' && (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              )}
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </Card>
              </div>

              {/* Match Results */}
              {festivalArtists.length > 0 && (
                <Card className="mt-8 p-6 border-purple-100 bg-white/80 backdrop-blur-sm text-center">
                  <h2 className="text-2xl font-bold text-purple-900">Match Score</h2>
                  <div className="mt-4">
                    <Progress 
                      value={matchPercentage} 
                      className="h-4 bg-purple-100" 
                    />
                    <p className="mt-4 text-4xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
                      {matchPercentage}%
                    </p>
                    <p className="mt-4 text-lg text-gray-600">
                      {matchPercentage >= 70
                        ? "Oh yeah, you'll definitely want to go! 🎉"
                        : matchPercentage >= 40
                        ? "Could be fun for discovering new music! 🎵"
                        : "Might want to save your money for another festival... 💭"}
                    </p>
                  </div>
                </Card>
              )}
            </>
          )}

          {/* Debug Mode Indicator */}
          {!IS_PRODUCTION && (
            <div className="fixed bottom-2 right-2 text-xs text-gray-500">
              In debug/test mode
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

