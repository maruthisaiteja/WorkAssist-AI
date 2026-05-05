'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  ClipboardList,
  Calendar,
  MoreVertical,
  PlayCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function FacultyDashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    setLoading(true);
    fetch('/api/faculty/tasks')
      .then(res => res.json())
      .then(data => {
        setTasks(data.tasks);
        setLoading(false);
      });
  };

  const updateStatus = async (taskId: string, status: string) => {
    const res = await fetch('/api/tasks/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, status }),
    });

    if (res.ok) {
      toast.success(`Task marked as ${status.replace('_', ' ')}`);
      fetchTasks();
    } else {
      toast.error('Failed to update task');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64">Loading your tasks...</div>;

  return (
    <div className="space-y-8 animate-in pb-10">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 card-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">Track and update your assigned tasks here.</p>
        </div>
        <div className="px-6 py-3 bg-blue-50 text-blue-700 rounded-2xl font-bold text-sm border border-blue-100 shadow-sm flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          {tasks.filter(t => t.status !== 'COMPLETED').length} Active Assignments
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {tasks.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-3xl border border-slate-200 p-8 card-shadow hover:border-blue-300 transition-all group"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{task.title}</h3>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider ${
                    task.priority === 'URGENT' ? 'bg-red-500 text-white' :
                    task.priority === 'HIGH' ? 'bg-orange-500 text-white' :
                    task.priority === 'MEDIUM' ? 'bg-blue-500 text-white' :
                    'bg-slate-500 text-white'
                  }`}>
                    {task.priority}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                    {task.category}
                  </span>
                </div>
                <p className="text-slate-500 text-base leading-relaxed max-w-3xl">{task.description}</p>
                
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <div className="flex items-center gap-2.5 text-sm font-bold text-slate-600">
                    <div className="p-2 bg-slate-100 rounded-xl text-slate-400">
                      <Calendar size={16} />
                    </div>
                    <span>Due: {mounted ? new Date(task.deadline).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '...'}</span>
                  </div>
                  
                  <div className={`flex items-center gap-2 text-sm font-black uppercase tracking-widest ${
                    task.status === 'COMPLETED' ? 'text-emerald-600' :
                    task.status === 'IN_PROGRESS' ? 'text-blue-600' :
                    task.status === 'OVERDUE' ? 'text-red-600' :
                    'text-amber-500'
                  }`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      task.status === 'COMPLETED' ? 'bg-emerald-500' :
                      task.status === 'IN_PROGRESS' ? 'bg-blue-500 animate-pulse' :
                      task.status === 'OVERDUE' ? 'bg-red-500 animate-bounce' :
                      'bg-amber-500'
                    }`}></div>
                    {task.status.replace('_', ' ')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                {task.status === 'PENDING' && (
                  <button
                    onClick={() => updateStatus(task.id, 'IN_PROGRESS')}
                    className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-600/20 active:scale-95"
                  >
                    <PlayCircle size={20} />
                    <span>Acknowledge</span>
                  </button>
                )}
                
                {task.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => updateStatus(task.id, 'COMPLETED')}
                    className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all font-bold shadow-lg shadow-emerald-600/20 active:scale-95"
                  >
                    <CheckCircle2 size={20} />
                    <span>Complete Task</span>
                  </button>
                )}

                {task.status === 'COMPLETED' && (
                  <div className="flex items-center gap-3 px-8 py-4 bg-emerald-50 text-emerald-700 rounded-2xl font-bold border border-emerald-100 shadow-inner">
                    <CheckCircle2 size={20} className="text-emerald-500" />
                    <span>All Done!</span>
                  </div>
                )}

                <button className="p-3 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-all">
                  <MoreVertical size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {tasks.length === 0 && (
          <div className="py-32 text-center bg-white rounded-3xl border-4 border-dashed border-slate-100">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ClipboardList size={48} className="text-slate-200" />
            </div>
            <p className="text-slate-400 font-bold text-xl uppercase tracking-widest">No Active Assignments</p>
            <p className="text-slate-400 text-sm mt-2">Enjoy your free time!</p>
          </div>
        )}
      </div>
    </div>
  );
}
