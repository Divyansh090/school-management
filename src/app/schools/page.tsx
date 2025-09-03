'use client'

import { useState, useEffect } from 'react'
import { School, MapPin, Phone, Mail, Building } from 'lucide-react'
import Image from 'next/image'

interface SchoolData {
  id: number
  name: string
  address: string
  city: string
  state: string
  contact: string
  image?: string
  email_id: string
}

export default function SchoolsPage() {
  const [schools, setSchools] = useState<SchoolData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSchools()
  }, [])

  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/schools')
      if (response.ok) {
        const data = await response.json()
        setSchools(data)
      } else {
        throw new Error('Failed to fetch schools')
      }
    } catch (err) {
      setError('Failed to load schools. Please try again later.')
      console.error('Error fetching schools:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to get image URL
  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) return null
    
    // If it's already a full URL (Cloudinary), return as-is
    if (imageUrl.startsWith('http')) {
      return imageUrl
    }
    
    // If it's a local path, ensure it has the correct prefix
    return imageUrl.startsWith('/') ? imageUrl : `/schoolImages/${imageUrl}`
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading schools...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <div className="text-red-600 mb-2">⚠️</div>
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchSchools}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Schools</h1>
        <p className="text-gray-600">
          Discover {schools.length} registered schools in our network
        </p>
      </div>

      {schools.length === 0 ? (
        <div className="text-center py-12">
          <Building className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No schools found</h2>
          <p className="text-gray-600 mb-6">Be the first to add a school to our platform!</p>
          <a
            href="/add-school"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add First School
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {schools.map((school) => {
            const imageUrl = getImageUrl(school.image)
            
            return (
              <div
                key={school.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
              >
                <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={school.name}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  <div className={`text-center ${imageUrl ? 'hidden' : ''} fallback-icon`}>
                    <School className="w-12 h-12 text-white mb-2 mx-auto" />
                    <p className="text-white text-sm opacity-80">No Image</p>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {school.name}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">
                        {school.address}, {school.city}, {school.state}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{school.contact}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{school.email_id}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {school.city}, {school.state}
                      </span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {schools.length > 0 && (
        <div className="text-center mt-12">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 mb-2">Want to add your school?</h3>
            <p className="text-gray-600 text-sm mb-4">
              Join our growing network of educational institutions
            </p>
            <a
              href="/add-school"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Your School
            </a>
          </div>
        </div>
      )}
    </div>
  )
}