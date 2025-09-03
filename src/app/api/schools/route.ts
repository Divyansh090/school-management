import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

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

    let imageName = null

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

      // Generate unique filename
      const timestamp = Date.now()
      const extension = path.extname(image.name)
      imageName = `school-${timestamp}${extension}`

      // Create directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), 'public', 'schoolImages')
      await mkdir(uploadDir, { recursive: true })

      // Save file
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const filePath = path.join(uploadDir, imageName)
      await writeFile(filePath, buffer)
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
        image: imageName,
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