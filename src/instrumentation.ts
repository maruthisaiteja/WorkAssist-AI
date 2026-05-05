export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startReminderScheduler } = await import('./utils/scheduler');
    startReminderScheduler();
    console.log('Reminder scheduler started');
  }
}
