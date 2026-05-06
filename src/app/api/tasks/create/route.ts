import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { sendEmailNotification, sendSMSNotification, sendWhatsAppNotification } from '@/utils/notifications';

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) {
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
      const emailHtmlMessage = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1B3A6B; border-bottom: 2px solid #1B3A6B; padding-bottom: 10px;">
            Dept. of INF - Task Management System
          </h2>
          
          <p>You have been assigned a new task. Please find the details below:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #f0f4ff;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; width: 35%;">📌 Task</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${task.title}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">📝 Description</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${task.description}</td>
            </tr>
            <tr style="background-color: #f0f4ff;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">🔴 Priority</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${task.priority}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">⏰ Deadline</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${new Date(task.deadline).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}</td>
            </tr>
            <tr style="background-color: #f0f4ff;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">📂 Category</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${task.category || 'General'}</td>
            </tr>
          </table>
          <p>Please log in to the portal to acknowledge and begin working on this task.</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}" style="background-color: #1B3A6B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">🔗 Open Portal</a></p>

          <br/>
          <hr style="border: 1px solid #ddd;"/>
          <p style="color: #555; font-size: 14px;">
            Thanks & Regards,<br/>
            <strong>Dr. Sreenivasulu Gogula</strong><br/>
            HoD - Information Technology<br/>
            Vardhaman College of Engineering, Hyderabad
          </p>
          <p style="color: #999; font-size: 12px;">This is an automated alert from the HOD Task Management System, IT Department.</p>
        </div>
        `;

      const plainTextMessage = `New Task: "${task.title}"\nPriority: ${task.priority}\nDeadline: ${new Date(task.deadline).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}\nLog in to portal to view details.`;

      await prisma.notification.create({
        data: {
          taskId: task.id,
          userId: faculty.id,
          type: 'assignment',
          channel: 'inapp',
          content: plainTextMessage,
        }
      });

      // Send External Notifications
      if (faculty.email) {
        await sendEmailNotification(faculty.email, faculty.name, 'New Task Assigned', emailHtmlMessage);
      }

      if (faculty.phone && faculty.phone !== '0000000000') {
        await sendSMSNotification(faculty.phone, faculty.name, plainTextMessage);
        await sendWhatsAppNotification(faculty.phone, faculty.name, plainTextMessage);
      }
    }

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
