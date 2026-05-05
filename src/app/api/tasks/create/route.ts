import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { sendEmailNotification, sendSMSNotification, sendWhatsAppNotification } from '@/utils/notifications';

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user || user.role !== 'HOD') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, facultyIds, priority, category, deadline, notes } = body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        category,
        deadline: new Date(deadline),
        notes,
        assignedById: user.id,
        assignedTo: {
          connect: facultyIds.map((id: string) => ({ id })),
        },
      },
      include: {
        assignedTo: true,
      }
    });

    // Create notifications in database
    for (const faculty of task.assignedTo) {
      const message = `New Task Assigned: "${task.title}". Priority: ${task.priority}. Deadline: ${new Date(task.deadline).toLocaleString()}.`;
      
      await prisma.notification.create({
        data: {
          taskId: task.id,
          userId: faculty.id,
          type: 'assignment',
          channel: 'inapp',
          content: message,
        }
      });
      
      // Send External Notifications
      if (faculty.email) {
        await sendEmailNotification(faculty.email, faculty.name, 'New Task Assigned', message);
      }
      
      if (faculty.phone && faculty.phone !== '0000000000') {
        await sendSMSNotification(faculty.phone, faculty.name, message);
        await sendWhatsAppNotification(faculty.phone, faculty.name, message);
      }
    }

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
