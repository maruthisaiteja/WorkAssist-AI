import { prisma } from '@/lib/prisma';
import { createToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { vceId: identifier }
        ]
      },
    });

    if (!user || user.passwordHash !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = createToken({
      id: user.id,
      email: user.email,
      role: user.role as 'HOD' | 'FACULTY',
      name: user.name,
    });

    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
