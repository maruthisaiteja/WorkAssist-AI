'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Send, 
  Calendar, 
  Users, 
  Tag, 
  AlertCircle, 
  Info,
  ChevronLeft,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function FacultyAssignTaskPage() {
  const router = useRouter();
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    facultyIds: [] as string[],
    priority: 'MEDIUM',
    category: 'ACADEMIC',
    deadline: '',
    notes: '',
  });

  useEffect(() => {
    fetch('/api/faculty/list')
      .then(res => res.json())
      .then(data => setFaculty(data.faculty || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.facultyIds.length === 0) {
      toast.error('Please select at least one faculty member');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/tasks/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Task assigned successfully');
        router.push('/dashboard/faculty/assigned-overview');
      } else {
        toast.error('Failed to assign task');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleFaculty = (id: string) => {
    setFormData(prev => ({
      ...prev,
      facultyIds: prev.facultyIds.includes(id)
        ? prev.facultyIds.filter(fid => fid !== id)
        : [...prev.facultyIds, id]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto animate-in">
      <Link href="/dashboard/faculty/assigned-overview" className="inline-flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-all font-medium text-sm">
        <ChevronLeft size={18} />
        <span>Back to Assigned Tasks</span>
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 card-shadow overflow-hidden">
        <div className="p-8 bg-blue-600 text-white">
          <h1 className="text-2xl font-bold">Assign New Task</h1>
          <p className="text-blue-100 opacity-90 mt-1">Fill in the details to assign work to faculty members.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Title & Description */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Task Title</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                placeholder="e.g., Prepare Mid-term Question Paper"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                placeholder="Detailed instructions for the faculty..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category & Priority */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <Tag size={16} /> Category
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-900"
                >
                  <option value="ACADEMIC" className="text-slate-900">Academic</option>
                  <option value="ADMINISTRATIVE" className="text-slate-900">Administrative</option>
                  <option value="RESEARCH" className="text-slate-900">Research</option>
                  <option value="EVENT" className="text-slate-900">Event</option>
                  <option value="OTHER" className="text-slate-900">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <AlertCircle size={16} /> Priority Level
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData({...formData, priority: p})}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        formData.priority === p 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Deadline */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} /> Deadline Date & Time
                </label>
                <input
                  required
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={e => setFormData({...formData, deadline: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <Info size={16} /> Special Notes (Optional)
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                  placeholder="Any additional info..."
                />
              </div>
            </div>
          </div>

          {/* Faculty Selection */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                <Users size={16} /> Assign To (Select Faculty)
              </label>
              <button
                type="button"
                onClick={() => {
                  if (formData.facultyIds.length === faculty.length) {
                    setFormData({ ...formData, facultyIds: [] });
                  } else {
                    setFormData({ ...formData, facultyIds: faculty.map(f => f.id) });
                  }
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg"
              >
                {formData.facultyIds.length === faculty.length && faculty.length > 0 ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
              {faculty.map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => toggleFaculty(f.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                    formData.facultyIds.includes(f.id)
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                    : 'bg-white border-slate-100 hover:border-blue-200 text-slate-700 shadow-sm'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className={`text-xs font-bold truncate ${formData.facultyIds.includes(f.id) ? 'text-white' : 'text-slate-800'}`}>{f.name}</div>
                    <div className={`text-[10px] truncate ${formData.facultyIds.includes(f.id) ? 'text-blue-100' : 'text-slate-500'}`}>{f.designation}</div>
                  </div>
                  {formData.facultyIds.includes(f.id) && <Check size={16} className="text-white flex-shrink-0" />}
                </button>
              ))}
            </div>
            <div className="mt-2 text-xs text-slate-500 font-medium">
              {formData.facultyIds.length} faculty members selected
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/30 flex items-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={18} />
                  <span>Assign & Notify</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
