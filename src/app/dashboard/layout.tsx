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
  const [user, setUser] = useState<{ name: string, role: string, email: string, vceId: string, designation?: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
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
    { name: 'Assigned By Me', href: '/dashboard/faculty/assigned-overview', icon: LayoutDashboard },
    { name: 'Assign Task', href: '/dashboard/faculty/assign', icon: PlusSquare },
    { name: 'Deadlines', href: '/dashboard/faculty/deadlines', icon: Clock },
  ];

  return (
    <div className="h-screen bg-[#f8fafc] flex overflow-hidden">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className={`bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col transition-all duration-300 z-50 fixed inset-y-0 left-0 md:relative ${!isSidebarOpen ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}
      >
        <div className="p-6 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <img src="/vce-logo.png" alt="VCE Logo" className="w-8 h-8 object-contain bg-white rounded-md p-1" />
                <div className="flex flex-col">
                  <span className="font-bold text-white text-base leading-tight">Vardhaman</span>
                  <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">IT dept</span>
                </div>
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
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${pathname === item.href
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
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-slate-600">
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
                <div className="text-xs text-slate-500 uppercase tracking-tighter">{mounted ? (user?.designation || user?.role) : '...'}</div>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 border-slate-200 overflow-hidden bg-blue-100 text-blue-600">
                {mounted && user?.vceId ? (
                  <>
                    <img 
                      src={`/images/faculty/${user.vceId}.png`} 
                      alt={user.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => { 
                        e.currentTarget.style.display = 'none'; 
                        e.currentTarget.nextElementSibling?.classList.remove('hidden'); 
                      }} 
                    />
                    <span className="hidden">{user.name?.charAt(0) || 'U'}</span>
                  </>
                ) : (
                  <span>{mounted ? (user?.name?.charAt(0) || 'U') : '?'}</span>
                )}
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
