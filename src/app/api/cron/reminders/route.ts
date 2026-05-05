import { prisma } from '@/lib/prisma';
import { sendEmailNotification, sendSMSNotification, sendWhatsAppNotification } from '@/utils/notifications';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  // Optional: Check for an authorization header to prevent unauthorized pings
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('Running manual reminder check via API...');
  const now = new Date();
  
  try {
    const activeTasks = await prisma.task.findMany({
      where: {
        status: { in: ['PENDING', 'IN_PROGRESS'] },
      },
      include: {
        assignedTo: true,
        reminderLogs: true,
      }
    });

    let sentCount = 0;

    for (const task of activeTasks) {
      const deadline = new Date(task.deadline);
      const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

      const intervals = [
        { type: '4hr', limit: 4 },
        { type: '2hr', limit: 2 },
        { type: '1hr', limit: 1 },
      ];

      for (const interval of intervals) {
        if (hoursRemaining <= interval.limit && hoursRemaining > 0) {
          for (const faculty of task.assignedTo) {
            const alreadySent = task.reminderLogs.some(
              log => log.userId === faculty.id && log.reminderType === interval.type
            );

            if (!alreadySent) {
              await sendReminder(task, faculty, interval.type);
              sentCount++;
            }
          }
        }
      }

      if (hoursRemaining < 0 && task.status !== 'OVERDUE') {
        await prisma.task.update({
          where: { id: task.id },
          data: { status: 'OVERDUE' }
        });
      }
    }

    return NextResponse.json({ success: true, remindersSent: sentCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function sendReminder(task: any, faculty: any, type: string) {
  const message = `Reminder: The task "${task.title}" assigned by HOD is due in ${type}. Please update the status.`;
  
  await prisma.notification.create({
    data: {
      taskId: task.id,
      userId: faculty.id,
      type: 'reminder',
      channel: 'inapp',
      content: message,
    }
  });

  if (faculty.email) {
    await sendEmailNotification(faculty.email, faculty.name, `Task Deadline Reminder: ${type} remaining`, message);
  }

  if (faculty.phone && faculty.phone !== '0000000000') {
    await sendSMSNotification(faculty.phone, faculty.name, message);
    await sendWhatsAppNotification(faculty.phone, faculty.name, message);
  }

  await prisma.reminderLog.create({
    data: {
      taskId: task.id,
      userId: faculty.id,
      reminderType: type,
    }
  });
}
