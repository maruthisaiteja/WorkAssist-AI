'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  Plus,
  MoreVertical,
  Calendar,
  User as UserIcon,
  ChevronRight,
  ClipboardList,
  Bell
} from 'lucide-react';
import Link from 'next/link';

export default function HODDashboard() {
  const [data, setData] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [facultyFilter, setFacultyFilter] = useState('ALL');
  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/hod/dashboard')
      .then(res => res.json())
      .then(d => setData(d));
      
    fetch('/api/notifications')
      .then(res => res.json())
      .then(d => setNotifications(d.notifications));

    fetch('/api/faculty/list')
      .then(res => res.json())
      .then(d => setFacultyList(d.faculty));
  }, []);

  if (!data) return <div className="flex items-center justify-center h-full">Loading...</div>;

  const filteredTasks = data.tasks.filter((t: any) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                         t.assignedTo.some((f: any) => f.name.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesFaculty = facultyFilter === 'ALL' || t.assignedTo.some((f: any) => f.id === facultyFilter);
    return matchesSearch && matchesStatus && matchesFaculty;
  });

  const statsCards = [
    { label: 'Total Tasks', value: data.stats.total, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Completed', value: data.stats.completed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'In Progress', value: data.stats.inProgress, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Pending', value: data.stats.pending, icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Overdue', value: data.stats.overdue, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  if (!mounted) return <div className="flex items-center justify-center h-screen">Initialising Dashboard...</div>;

  return (
    <div className="space-y-10 animate-in pb-10">
      {/* Header with Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-slate-200 card-shadow">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome, Dr. Sreenivasulu</h1>
          <p className="text-slate-500 font-medium mt-1">Here is what's happening in the IT Department today.</p>
        </div>
        <Link href="/dashboard/hod/assign" className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 text-base font-bold">
          <Plus size={20} />
          <span>Assign New Task</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {statsCards.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-200 card-shadow hover:border-blue-300 transition-all cursor-default group"
          >
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <div className="text-4xl font-black text-slate-900">{stat.value}</div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 card-shadow overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-lg">Task Monitor</h3>
            <div className="flex flex-col md:flex-row items-center gap-4 flex-1 max-w-2xl">
              <div className="relative flex-1 w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search size={18} />
                </span>
                <input 
                  type="text" 
                  placeholder="Search tasks or faculty..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 text-sm shadow-sm"
                />
              </div>
              
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-auto px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold text-slate-700 shadow-sm"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="OVERDUE">Overdue</option>
              </select>

              <select 
                value={facultyFilter}
                onChange={(e) => setFacultyFilter(e.target.value)}
                className="w-full md:w-auto px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold text-slate-700 shadow-sm"
              >
                <option value="ALL">All Faculty</option>
                {facultyList.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-8 py-5">Assignment Info</th>
                  <th className="px-8 py-5">Faculty Team</th>
                  <th className="px-8 py-5">Deadline</th>
                  <th className="px-8 py-5">Priority</th>
                  <th className="px-8 py-5">Live Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((task: any) => (
                  <tr key={task.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{task.title}</div>
                      <div className="text-xs text-slate-500 mt-1.5 flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-600 uppercase">{task.category}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex -space-x-3">
                        {task.assignedTo.slice(0, 3).map((f: any, i: number) => (
                          <div 
                            key={i} 
                            className="w-10 h-10 rounded-full bg-blue-100 border-4 border-white flex items-center justify-center text-xs font-bold text-blue-600 shadow-sm" 
                            title={f.name}
                          >
                            {f.name.charAt(0)}
                          </div>
                        ))}
                        {task.assignedTo.length > 3 && (
                          <div className="w-10 h-10 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm">
                            +{task.assignedTo.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2.5 text-sm text-slate-700 font-bold">
                        <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
                          <Calendar size={14} />
                        </div>
                        {mounted ? new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '...'}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-sm ${
                        task.priority === 'URGENT' ? 'bg-red-500 text-white' :
                        task.priority === 'HIGH' ? 'bg-orange-500 text-white' :
                        task.priority === 'MEDIUM' ? 'bg-blue-500 text-white' :
                        'bg-slate-500 text-white'
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest ${
                        task.status === 'COMPLETED' ? 'text-emerald-600' :
                        task.status === 'IN_PROGRESS' ? 'text-blue-600' :
                        task.status === 'OVERDUE' ? 'text-red-600' :
                        'text-amber-500'
                      }`}>
                        <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                          task.status === 'COMPLETED' ? 'bg-emerald-500' :
                          task.status === 'IN_PROGRESS' ? 'bg-blue-500' :
                          task.status === 'OVERDUE' ? 'bg-red-500' :
                          'bg-amber-500'
                        }`}></div>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <MoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTasks.length === 0 && (
              <div className="py-24 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <ClipboardList size={40} className="text-slate-300" />
                </div>
                <p className="text-slate-400 font-bold text-lg">No matching tasks found</p>
                <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Sidebar */}
        <div className="bg-white rounded-3xl border border-slate-200 card-shadow overflow-hidden flex flex-col h-[700px]">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                <Bell size={20} />
              </div>
              Activity Log
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {notifications.map((n, i) => (
              <div key={n.id} className="relative pl-8 group cursor-default">
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-full ${
                  n.type === 'completion' ? 'bg-emerald-500' :
                  n.type === 'acknowledgment' ? 'bg-blue-500' :
                  n.type === 'overdue' ? 'bg-red-500' :
                  'bg-slate-300'
                }`}></div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{n.content}</p>
                  <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Clock size={10} />
                    {mounted ? new Date(n.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                  </p>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="text-center py-20">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell size={20} className="text-slate-200" />
                </div>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Quiet Day</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
