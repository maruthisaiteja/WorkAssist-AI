import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch tasks assigned by this exact user
  const tasks = await prisma.task.findMany({
    where: { assignedById: user.id },
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
