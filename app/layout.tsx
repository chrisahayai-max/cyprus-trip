import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cyprus Trip 🌊 Aug 5–10, 2025',
  description: 'Group itinerary for the boys — Ayia Napa, Protaras, Limassol, Paphos.',
  openGraph: {
    title: 'Cyprus Trip — Aug 5–10, 2025 🌊',
    description: 'The boys\' Cyprus trip itinerary. View, suggest edits, and help plan the trip.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
