export interface HeroTrack {
  file: string
  title: string
  artist: string
  artwork?: string
}

export const heroPlaylist: HeroTrack[] = [
  {
    file: 'DH - FACE ME Official Audio.mp3',
    title: 'FACE ME',
    artist: 'DH',
  },
  {
    file: 'GLACIER GIRL.mp3',
    title: 'GLACIER GIRL',
    artist: 'Izuchukwu Tony',
  },
]

export function heroTrackSrc(file: string): string {
  return `/audio/${encodeURIComponent(file)}`
}
