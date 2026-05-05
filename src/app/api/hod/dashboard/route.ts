import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getAuthUser();
  if (!user || user.role !== 'HOD') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tasks = await prisma.task.findMany({
    include: {
      assignedTo: {
        select: { id: true, name: true, designation: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'COMPLETED').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    pending: tasks.filter(t => t.status === 'PENDING').length,
    overdue: tasks.filter(t => t.status === 'OVERDUE' || (new Date(t.deadline) < new Date() && t.status !== 'COMPLETED')).length,
  };

  return NextResponse.json({ tasks, stats, user: { name: user.name } });
}
