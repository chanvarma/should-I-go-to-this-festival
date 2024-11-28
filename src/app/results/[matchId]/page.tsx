"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Loader2, Share2 } from 'lucide-react'

// Mock data for development
const MOCK_RESULTS = {
  matchPercentage: 75,
  matchedArtists: ["Artist 1", "Artist 2", "Artist 3"],
  recommendation: "This looks promising! You'll see some favorites and discover new acts!",
}

const LOADING_MESSAGES = [
  "Getting your top artists...",
  "Reading the lineup...",
  "Making matches...",
  "Calculating your festival compatibility...",
]

export default function ResultsPage({ params }: { params: { matchId: string } }) {
  const [loading, setLoading] = useState(true)
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0)
  const [results, setResults] = useState<typeof MOCK_RESULTS | null>(null)

  // Simulate loading steps
  useEffect(() => {
    let step = 0
    const interval = setInterval(() => {
      if (step < LOADING_MESSAGES.length) {
        setCurrentLoadingStep(step)
        step++
      } else {
        clearInterval(interval)
        setLoading(false)
        setResults(MOCK_RESULTS)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <Progress value={(currentLoadingStep / (LOADING_MESSAGES.length - 1)) * 100} className="w-full max-w-md" />
        <p className="mt-4 text-center text-lg font-medium">{LOADING_MESSAGES[currentLoadingStep]}</p>
        <Loader2 className="mt-6 h-8 w-8 animate-spin text-neutral-400" />
      </div>
    )
  }

  if (!results) return null

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Your Festival Match</h1>
          <div className="mt-6 text-6xl font-bold text-green-500">{results.matchPercentage}%</div>
          <p className="mt-4 text-lg text-neutral-600">{results.recommendation}</p>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold">Artists You'll Love</h2>
          <ul className="mt-4 space-y-2">
            {results.matchedArtists.map((artist) => (
              <li key={artist} className="rounded-lg bg-neutral-100 p-3">
                {artist}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex justify-center">
          <Button className="gap-2">
            <Share2 className="h-4 w-4" />
            Share Results
          </Button>
        </div>
      </div>
    </div>
  )
}

