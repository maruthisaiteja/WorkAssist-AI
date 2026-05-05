import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';

export default async function RootPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role === 'HOD') {
    redirect('/dashboard/hod');
  } else {
    redirect('/dashboard/faculty');
  }
}
