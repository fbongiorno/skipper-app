import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Skipper — Boat Trip Planner',
  description: 'Plan your perfect sailing trip. Routes, weather, checklists, and costs — all in seconds.',
  keywords: 'boat trip planner, sailing route, nautical planner, skipper, boat rental',
  openGraph: {
    title: 'Skipper — Boat Trip Planner',
    description: 'Plan your perfect sailing trip.',
    url: 'https://skipper.com',
    siteName: 'Skipper',
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
