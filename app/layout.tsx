import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Alkebula School',
  description: 'Breaking Learning Barriers — premium homeschool education across Kenya.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
