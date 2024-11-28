export const IS_PRODUCTION = typeof window !== 'undefined' && 
  window.location.hostname === 'shouldigotothisfestival.vercel.app'

// Mock data for development and testing
export const MOCK_SPOTIFY_RESPONSE = {
  topArtists: [
    "Drake",
    "The Weeknd",
    "Travis Scott",
    "Kendrick Lamar",
    "Post Malone",
    "J. Cole",
    "Kanye West",
    "Future",
    "21 Savage",
    "Bad Bunny",
    "SZA",
    "Frank Ocean",
    "Tyler, The Creator",
    "A$AP Rocky",
    "Lil Baby"
  ]
}

export const MOCK_FESTIVAL_RESPONSE = {
  artists: ["Travis Scott", "Lady Gaga", "Post Malone"],
  festivalName: "Summer Fest 2024"
}

export const LOADING_MESSAGES = [
  "Checking your music taste...",
  "Analyzing your Spotify history...",
  "Finding your favorite artists...",
  "Getting ready to match festivals..."
]

