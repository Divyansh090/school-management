import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch all schools
export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(schools);
  } catch (error) {
    console.error("Error fetching schools:", error);
    return NextResponse.json(
      { error: "Failed to fetch schools" },
      { status: 500 }
    );
  }
}

// POST - Create new school
export async function POST(request: NextRequest) {
  try {
    console.log("=== Starting school creation ===");

    const formData = await request.formData();

    // Extract form fields
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const contact = formData.get("contact") as string;
    const email_id = formData.get("email_id") as string;
    const image = formData.get("image") as File | null;

    // Validate required fields
    if (!name || !address || !city || !state || !contact || !email_id) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email_id)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate contact number
    const contactRegex = /^\d{10}$/;
    if (!contactRegex.test(contact)) {
      return NextResponse.json(
        { error: "Contact must be a 10-digit number" },
        { status: 400 }
      );
    }

    let imageUrl = null;

    // Handle image upload
    if (image && image.size > 0) {
      console.log("Processing image upload...");

      // Validate file type
      if (!image.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Only image files are allowed" },
          { status: 400 }
        );
      }

      // Validate file size (10MB limit)
      if (image.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Image size must be less than 10MB" },
          { status: 400 }
        );
      }

      try {
        // FORCE Cloudinary upload - don't check environment here
        console.log("🚀 Attempting Cloudinary upload...");

        // Import cloudinary here to avoid issues
        const { v2: cloudinary } = await import("cloudinary");

        // Configure cloudinary
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        console.log("📤 Uploading buffer to Cloudinary...");

        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "schools",
                resource_type: "auto",
                public_id: `school-${Date.now()}`, // Custom public ID
                transformation: [
                  { width: 800, height: 600, crop: "limit" },
                  { quality: "auto", fetch_format: "auto" },
                ],
              },
              (error, result) => {
                if (error) {
                  console.error("❌ Cloudinary upload error:", error);
                  reject(error);
                } else {
                  console.log("✅ Cloudinary upload success:", {
                    public_id: result?.public_id,
                    secure_url: result?.secure_url,
                    url: result?.url,
                  });
                  resolve(result);
                }
              }
            )
            .end(buffer);
        });

        imageUrl = (uploadResult as { secure_url?: string }).secure_url;
        console.log("🎉 Final Cloudinary URL:", imageUrl);
      } catch (cloudinaryError) {
        console.error(
          "💥 Cloudinary failed, falling back to local storage:",
          cloudinaryError
        );

        // Fallback to local storage only if Cloudinary fails
        const { writeFile, mkdir } = await import("fs/promises");
        const path = await import("path");

        const timestamp = Date.now();
        const extension = path.extname(image.name);
        const imageName = `school-${timestamp}${extension}`;

        const uploadDir = path.join(process.cwd(), "public", "schoolImages");
        await mkdir(uploadDir, { recursive: true });

        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(uploadDir, imageName);
        await writeFile(filePath, buffer);

        imageUrl = `/schoolImages/${imageName}`;
        console.log("📁 Saved locally as fallback:", imageUrl);
      }
    }

    // Create school record
    console.log("💾 Creating school record with image URL:", imageUrl);

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
    });

    return NextResponse.json(school, { status: 201 });
  } catch (error) {
    console.error("💥 Error creating school:", error);
    return NextResponse.json(
      { error: "Failed to create school" },
      { status: 500 }
    );
  }
}
