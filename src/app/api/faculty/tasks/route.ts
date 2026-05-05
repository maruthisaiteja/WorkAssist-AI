import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getAuthUser();
  if (!user || user.role !== 'FACULTY') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tasks = await prisma.task.findMany({
    where: {
      assignedTo: {
        some: { id: user.id }
      }
    },
    orderBy: { deadline: 'asc' }
  });

  return NextResponse.json({ tasks });
}
