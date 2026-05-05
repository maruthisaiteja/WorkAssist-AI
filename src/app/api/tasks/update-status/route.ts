import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { taskId, status } = await req.json();

    const task = await prisma.task.update({
      where: { id: taskId },
      data: { status },
      include: { assignedTo: true }
    });

    // Notify HOD
    await prisma.notification.create({
      data: {
        taskId: task.id,
        userId: task.assignedById,
        type: status === 'COMPLETED' ? 'completion' : 'acknowledgment',
        channel: 'inapp',
        content: `Faculty ${user.name} marked task "${task.title}" as ${status.replace('_', ' ')}`,
      }
    });

    return NextResponse.json({ success: true, task });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
