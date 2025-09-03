import Link from 'next/link'
import { School, Plus, Eye } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <School className="w-16 h-16 text-blue-600" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          School Management
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Efficiently manage school information with our modern, responsive platform. 
          Add new schools and browse existing ones with ease.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Link href="/add-school">
          <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-blue-200">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-6 group-hover:bg-blue-200 transition-colors">
              <Plus className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Add New School</h2>
            <p className="text-gray-600 mb-6">
              Register a new school with all necessary details including contact information and images.
            </p>
            <div className="text-blue-600 font-medium group-hover:text-blue-800">
              Get Started →
            </div>
          </div>
        </Link>

        <Link href="/schools">
          <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-blue-200">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-lg mb-6 group-hover:bg-green-200 transition-colors">
              <Eye className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">View All Schools</h2>
            <p className="text-gray-600 mb-6">
              Browse and explore all registered schools in a beautiful, responsive grid layout.
            </p>
            <div className="text-green-600 font-medium group-hover:text-green-800">
              Explore Schools →
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Responsive Design</h3>
            <p className="text-gray-600 text-sm">Works perfectly on both mobile and desktop devices</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Form Validation</h3>
            <p className="text-gray-600 text-sm">Smart validation ensures data accuracy and completeness</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🖼️</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Image Upload</h3>
            <p className="text-gray-600 text-sm">Upload and manage school images seamlessly</p>
          </div>
        </div>
      </div>
    </div>
  )
}