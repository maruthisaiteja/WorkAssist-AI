'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Calendar, 
  AlertCircle, 
  ChevronRight,
  ClipboardList,
  CheckCircle2
} from 'lucide-react';

export default function DeadlinesPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/faculty/tasks')
      .then(res => res.json())
      .then(data => {
        // Sort by deadline
        const sorted = data.tasks.sort((a: any, b: any) => 
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        );
        setTasks(sorted);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64">Loading deadlines...</div>;

  const incompleteTasks = tasks.filter(t => t.status !== 'COMPLETED');

  return (
    <div className="space-y-8 animate-in pb-10">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 card-shadow">
        <h1 className="text-3xl font-bold text-slate-900">Upcoming Deadlines</h1>
        <p className="text-slate-500 font-medium mt-1">Tasks sorted by urgency. Stay on top of your schedule.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {incompleteTasks.map((task, i) => {
          const deadlineDate = new Date(task.deadline);
          const now = new Date();
          const isUrgent = (deadlineDate.getTime() - now.getTime()) < 86400000; // Less than 24h

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white rounded-2xl border ${isUrgent ? 'border-red-200 bg-red-50/10' : 'border-slate-200'} p-6 card-shadow flex items-center justify-between gap-6 group hover:border-blue-300 transition-all`}
            >
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold shadow-sm ${
                  isUrgent ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <div className="text-[10px] uppercase tracking-tighter leading-none">
                    {mounted ? deadlineDate.toLocaleDateString(undefined, { month: 'short' }) : '...'}
                  </div>
                  <div className="text-xl leading-none mt-1">
                    {mounted ? deadlineDate.getDate() : '...'}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{task.title}</h3>
                  <div className="flex items-center gap-4 mt-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <Clock size={14} className={isUrgent ? 'text-red-500' : 'text-slate-400'} />
                      {mounted ? deadlineDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                    </div>
                    <div className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      task.priority === 'URGENT' ? 'bg-red-100 text-red-600' :
                      task.priority === 'HIGH' ? 'bg-orange-100 text-orange-600' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {task.priority}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className={`text-xs font-black uppercase tracking-widest ${
                    task.status === 'IN_PROGRESS' ? 'text-blue-600' : 'text-amber-500'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </div>
                </div>
                <div className="p-2 text-slate-300 group-hover:text-blue-600 transition-colors">
                  <ChevronRight size={24} />
                </div>
              </div>
            </motion.div>
          );
        })}

        {incompleteTasks.length === 0 && (
          <div className="py-24 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <p className="text-slate-500 font-bold text-lg">No Pending Deadlines</p>
            <p className="text-slate-400 text-sm mt-1">All your work is currently up to date.</p>
          </div>
        )}
      </div>
    </div>
  );
}
