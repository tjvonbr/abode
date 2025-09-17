import { NextResponse } from "next/server";
import { prisma } from "@repo/prisma/client";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { type, record } = payload;
    
    if (type !== 'INSERT') {
      return NextResponse.json({
        success: false,
        message: 'Invalid webhook type',
      }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id: record.id },
          { email: record.email }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'User already exists',
      }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        id: record.id,
        firstName: record.raw_user_meta_data.firstName,
        lastName: record.raw_user_meta_data.lastName,
        email: record.email,
        phone: record.raw_user_meta_data.phone,
      }
    });
    
    return NextResponse.json({ 
      success: true,
      data: user
    }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}