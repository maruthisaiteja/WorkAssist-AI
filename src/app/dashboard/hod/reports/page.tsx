'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  Download
} from 'lucide-react';

export default function ReportsPage() {
  const [stats, setStats] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/hod/dashboard')
      .then(res => res.json())
      .then(data => setStats(data.stats));
  }, []);

  if (!stats) return <div className="flex items-center justify-center h-64">Analyzing data...</div>;

  const reportCards = [
    { label: 'Completion Rate', value: `${Math.round((stats.completed / stats.total) * 100) || 0}%`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Avg. Turnaround', value: '1.2 Days', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Faculty', value: '32/35', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #report-content, #report-content * {
            visibility: visible;
          }
          #report-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-hidden {
            display: none !important;
          }
          /* Fix background colors in print */
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}} />
      <div id="report-content" className="space-y-8 animate-in pb-10">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 card-shadow flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Department Reports</h1>
            <p className="text-slate-500 font-medium mt-1">Detailed performance metrics and task analytics.</p>
          </div>
          <button 
            onClick={handleExportPDF}
            className="print-hidden flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all font-bold text-sm"
          >
            <Download size={18} />
            <span>Export PDF</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reportCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-slate-200 card-shadow"
            >
              <div className={`w-12 h-12 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center mb-4`}>
                {card.icon ? <card.icon size={24} /> : <TrendingUp size={24} />}
              </div>
              <div className="text-3xl font-black text-slate-900">{card.value}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{card.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Task Distribution Mockup */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 card-shadow">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <PieChart size={20} className="text-blue-600" />
                Task Distribution
              </h3>
            </div>
            <div className="space-y-6">
              {[
                { label: 'Academic', count: stats.total - 5, color: 'bg-blue-500' },
                { label: 'Administrative', count: 3, color: 'bg-purple-500' },
                { label: 'Research', count: 2, color: 'bg-emerald-500' },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-sm font-bold text-slate-700">
                    <span>{item.label}</span>
                    <span>{stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.total > 0 ? (item.count / stats.total) * 100 : 0}%` }}
                      className={`h-full ${item.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Efficiency Metrics */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 card-shadow">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 size={20} className="text-blue-600" />
                Efficiency Metrics
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-[10px] font-black text-slate-400 uppercase mb-1">On-Time Rate</div>
                <div className="text-2xl font-black text-emerald-600">94%</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Overdue Count</div>
                <div className="text-2xl font-black text-red-600">{stats.overdue || 0}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Urgent Handled</div>
                <div className="text-2xl font-black text-blue-600">12</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Avg. Response</div>
                <div className="text-2xl font-black text-purple-600">4h</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Summaries */}
        <div className="bg-white rounded-3xl border border-slate-200 card-shadow overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <FileText size={20} className="text-blue-600" />
              Monthly Task Summary
            </h3>
          </div>
          <div className="p-8 text-center py-20">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 size={32} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">Detailed monthly trends will appear as more tasks are completed.</p>
          </div>
        </div>
      </div>
    </>
  );
}
