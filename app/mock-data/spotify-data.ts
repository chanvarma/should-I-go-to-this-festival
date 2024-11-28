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

// Feature flags for development
export const USE_MOCK_SPOTIFY = process.env.NODE_ENV === 'development'
export const BYPASS_SPOTIFY_AUTH = process.env.NODE_ENV === 'development'

