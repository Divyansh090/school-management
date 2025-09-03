import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { v2 as cloudinary } from 'cloudinary'

const prisma = new PrismaClient()

// Configure Cloudinary (only if environment variables are set)
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

// GET - Fetch all schools
export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(schools)
  } catch (error) {
    console.error('Error fetching schools:', error)
    return NextResponse.json(
      { error: 'Failed to fetch schools' },
      { status: 500 }
    )
  }
}

// POST - Create new school
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form fields
    const name = formData.get('name') as string
    const address = formData.get('address') as string
    const city = formData.get('city') as string
    const state = formData.get('state') as string
    const contact = formData.get('contact') as string
    const email_id = formData.get('email_id') as string
    const image = formData.get('image') as File | null

    // Validate required fields
    if (!name || !address || !city || !state || !contact || !email_id) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email_id)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate contact number
    const contactRegex = /^\d{10}$/
    if (!contactRegex.test(contact)) {
      return NextResponse.json(
        { error: 'Contact must be a 10-digit number' },
        { status: 400 }
      )
    }

    let imageUrl = null

    // Handle image upload
    if (image && image.size > 0) {
      // Validate file type
      if (!image.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Only image files are allowed' },
          { status: 400 }
        )
      }

      // Validate file size (10MB limit)
      if (image.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Image size must be less than 10MB' },
          { status: 400 }
        )
      }

      try {
        if (process.env.CLOUDINARY_CLOUD_NAME) {
          // Production: Upload to Cloudinary
          const bytes = await image.arrayBuffer()
          const buffer = Buffer.from(bytes)
          
          const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              { 
                folder: 'schools',
                resource_type: 'auto',
                transformation: [
                  { width: 800, height: 600, crop: 'limit' },
                  { quality: 'auto' }
                ]
              },
              (error, result) => {
                if (error) {
                  console.error('Cloudinary upload error:', error)
                  reject(error)
                } else {
                  resolve(result)
                }
              }
            ).end(buffer)
          }) as any

          imageUrl = uploadResult.secure_url
        } else {
          // Development: Save to local filesystem
          const { writeFile, mkdir } = await import('fs/promises')
          const path = await import('path')
          
          const timestamp = Date.now()
          const extension = path.extname(image.name)
          const imageName = `school-${timestamp}${extension}`

          // Create directory if it doesn't exist
          const uploadDir = path.join(process.cwd(), 'public', 'schoolImages')
          await mkdir(uploadDir, { recursive: true })

          // Save file
          const bytes = await image.arrayBuffer()
          const buffer = Buffer.from(bytes)
          const filePath = path.join(uploadDir, imageName)
          await writeFile(filePath, buffer)
          
          imageUrl = `/schoolImages/${imageName}`
        }
      } catch (uploadError) {
        console.error('Image upload error:', uploadError)
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        )
      }
    }

    // Create school record
    const school = await prisma.school.create({
      data: {
        name: name.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        contact: contact.trim(),
        email_id: email_id.trim().toLowerCase(),
        image: imageUrl,
      },
    })

    return NextResponse.json(school, { status: 201 })
  } catch (error) {
    console.error('Error creating school:', error)
    return NextResponse.json(
      { error: 'Failed to create school' },
      { status: 500 }
    )
  }
}

// DELETE - Delete school (optional feature)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'Valid school ID is required' },
        { status: 400 }
      )
    }

    const school = await prisma.school.delete({
      where: { id: Number(id) }
    })

    return NextResponse.json({ message: 'School deleted successfully', school })
  } catch (error) {
    console.error('Error deleting school:', error)
    return NextResponse.json(
      { error: 'Failed to delete school' },
      { status: 500 }
    )
  }
}