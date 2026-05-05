import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const since = searchParams.get('since');

  const notifications = await prisma.notification.findMany({
    where: {
      userId: user.id,
      sentAt: {
        gt: since ? new Date(since) : new Date(0),
      },
    },
    orderBy: { sentAt: 'desc' },
  });

  return NextResponse.json({ notifications });
}
