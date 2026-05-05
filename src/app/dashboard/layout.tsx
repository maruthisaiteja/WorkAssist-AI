'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  LogOut, 
  Bell, 
  User as UserIcon,
  Menu,
  X,
  Settings,
  PlusSquare,
  ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<{name: string, role: string, email: string} | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const fetchUser = async () => {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        router.push('/login');
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const navItems = user?.role === 'HOD' ? [
    { name: 'Overview', href: '/dashboard/hod', icon: LayoutDashboard },
    { name: 'Assign Task', href: '/dashboard/hod/assign', icon: PlusSquare },
    { name: 'Task Reports', href: '/dashboard/hod/reports', icon: ClipboardList },
  ] : [
    { name: 'My Tasks', href: '/dashboard/faculty', icon: CheckCircle2 },
    { name: 'Deadlines', href: '/dashboard/faculty/deadlines', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="bg-slate-900 text-slate-300 flex-shrink-0 relative hidden md:flex flex-col transition-all duration-300"
      >
        <div className="p-6 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-bold text-white text-lg truncate"
              >
                Vardhaman IT
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-800 rounded">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                pathname === item.href 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <item.icon size={22} />
              {isSidebarOpen && <span className="font-medium">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 w-full rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all"
          >
            <LogOut size={22} />
            {isSidebarOpen && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <button className="md:hidden p-2 text-slate-600">
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-slate-800 capitalize">
              {mounted ? (pathname?.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard') : '...'}
            </h2>
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-800">{mounted ? user?.name : '...'}</div>
                <div className="text-xs text-slate-500 uppercase tracking-tighter">{mounted ? user?.role : '...'}</div>
              </div>
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold border-2 border-blue-200">
                {mounted ? (user?.name?.charAt(0) || 'U') : '?'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
          {children}
        </main>
      </div>
    </div>
  );
}
