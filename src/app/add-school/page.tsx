'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import Image from 'next/image'

const schoolSchema = z.object({
  name: z.string().min(2, 'School name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  contact: z.string().regex(/^\d{10}$/, 'Contact must be a 10-digit number'),
  email_id: z.string().email('Please enter a valid email address'),
})

type SchoolFormData = z.infer<typeof schoolSchema>

export default function AddSchoolPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: SchoolFormData) => {
    setIsLoading(true)
    setSubmitStatus('idle')

    try {
      const formData = new FormData()
      
      // Append school data
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
      })

      // Append image if selected
      if (selectedImage) {
        formData.append('image', selectedImage)
      }

      const response = await fetch('/api/schools', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setSubmitStatus('success')
        reset()
        setSelectedImage(null)
        setImagePreview(null)
        setTimeout(() => setSubmitStatus('idle'), 3000)
      } else {
        throw new Error('Failed to add school')
      }
    } catch (error) {
      setSubmitStatus('error')
      console.error('Error adding school:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New School</h1>
          <p className="text-gray-600">Fill out the form below to register a new school</p>
        </div>

        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800">School added successfully!</span>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">Failed to add school. Please try again.</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School Name *
              </label>
              <input
                {...register('name')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter school name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                {...register('email_id')}
                type="email"
                className="w-full px-4 py-2 border border-gray-300 text-gray-400  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="school@example.com"
              />
              {errors.email_id && (
                <p className="text-red-500 text-sm mt-1">{errors.email_id.message}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <textarea
              {...register('address')}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-400  focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter complete address"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                {...register('city')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 text-gray-400  focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter city"
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                {...register('state')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 text-gray-400  focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter state"
              />
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number *
            </label>
            <input
              {...register('contact')}
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 text-gray-400  focus:ring-blue-500 focus:border-blue-500"
              placeholder="10-digit contact number"
            />
            {errors.contact && (
              <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>
            )}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                {imagePreview ? (
                  <div className="text-center">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      height="32"
                      width="32"
                      className="mx-auto h-32 w-32 object-cover rounded-lg mb-2"
                    />
                    <p className="text-sm text-gray-600">Click to change image</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload school image</p>
                    <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-8 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Adding School...
              </>
            ) : (
              'Add School'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}