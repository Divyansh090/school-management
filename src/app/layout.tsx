import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'School Management App',
  description: 'Manage school information with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-blue-600 text-white shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-xl font-bold">
                <Link href="/" className="hover:text-blue-200">School Manager</Link>
              </h1>
              <div className="flex space-x-4">
                <a 
                  href="/add-school" 
                  className="px-4 py-2 bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Add School
                </a>
                <a 
                  href="/schools" 
                  className="px-4 py-2 bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors"
                >
                  View Schools
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
     
      </body>
    </html>
  )
}