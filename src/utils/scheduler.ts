import { prisma } from '@/lib/prisma';
import nodeCron from 'node-cron';
import { sendEmailNotification, sendSMSNotification, sendWhatsAppNotification } from './notifications';

export const startReminderScheduler = () => {
  // Run every 15 minutes
  nodeCron.schedule('*/15 * * * *', async () => {
    console.log('Running reminder check...');
    const now = new Date();
    
    // Fetch all active tasks
    const activeTasks = await prisma.task.findMany({
      where: {
        status: { in: ['PENDING', 'IN_PROGRESS'] },
      },
      include: {
        assignedTo: true,
        reminderLogs: true,
      }
    });

    for (const task of activeTasks) {
      const deadline = new Date(task.deadline);
      const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

      // Reminder intervals: 4h, 2h, 1h
      const intervals = [
        { type: '4hr', limit: 4 },
        { type: '2hr', limit: 2 },
        { type: '1hr', limit: 1 },
      ];

      for (const interval of intervals) {
        if (hoursRemaining <= interval.limit && hoursRemaining > 0) {
          // Check if reminder already sent for this interval
          for (const faculty of task.assignedTo) {
            const alreadySent = task.reminderLogs.some(
              log => log.userId === faculty.id && log.reminderType === interval.type
            );

            if (!alreadySent) {
              // Send reminder
              await sendReminder(task, faculty, interval.type);
            }
          }
        }
      }

      // Check for overdue
      if (hoursRemaining < 0 && task.status !== 'OVERDUE') {
        await prisma.task.update({
          where: { id: task.id },
          data: { status: 'OVERDUE' }
        });
        
        // Notify HOD about overdue
        await prisma.notification.create({
          data: {
            taskId: task.id,
            userId: task.assignedById,
            type: 'overdue',
            channel: 'inapp',
            content: `Task Overdue: "${task.title}" has passed its deadline.`,
          }
        });
      }
    }
  });
};

async function sendReminder(task: any, faculty: any, type: string) {
  const message = `Reminder: The task "${task.title}" assigned by HOD is due in ${type}. Please update the status.`;
  
  // 1. In-App Notification
  await prisma.notification.create({
    data: {
      taskId: task.id,
      userId: faculty.id,
      type: 'reminder',
      channel: 'inapp',
      content: message,
    }
  });

  // 2. Email Notification
  if (faculty.email) {
    await sendEmailNotification(
      faculty.email,
      faculty.name,
      `Task Deadline Reminder: ${type} remaining`,
      message
    );
  }

  // 3. SMS/WhatsApp Notification
  if (faculty.phone && faculty.phone !== '0000000000') {
    await sendSMSNotification(faculty.phone, faculty.name, message);
    await sendWhatsAppNotification(faculty.phone, faculty.name, message);
  }

  // Log reminder to prevent duplicates
  await prisma.reminderLog.create({
    data: {
      taskId: task.id,
      userId: faculty.id,
      reminderType: type,
    }
  });
}
