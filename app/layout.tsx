import type { Metadata } from 'next'
import { AppProvider } from '@/contexts/AppContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nuance & Clarity – Quiet Presence Scan Wizard · Multi-Client Engine',
  description: 'Quiet Presence Scan – a calm, card-by-card brand and space scan with owner + clients and Global Brand Health Indicators.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}

