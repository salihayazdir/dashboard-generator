import { prisma } from '@/lib/prisma';
import { hash } from 'bcrypt';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const exists = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (exists) {
    return NextResponse.json(
      { error: 'Bu e-posta adresi ile kayıtlı kullanıcı bulunuyor.' },
      { status: 400 }
    );
  } else {
    const user = await prisma.user.create({
      data: {
        email,
        password: await hash(password, 12),
      },
    });
    return NextResponse.json(user);
  }
}
