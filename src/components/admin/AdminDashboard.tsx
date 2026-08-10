import React from 'react';
import { Layers, Users, BarChart3, ShieldAlert, Sparkles, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
  onSwitchRole: (role: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onSwitchRole }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px]">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-white text-base leading-none">
              PeerSolve Admin Center
            </h1>
            <span className="text-xs text-slate-400">Institutional Analytics & Safety Control</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSwitchRole('student')}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold"
          >
            Switch to Student View
          </button>
          <button onClick={onLogout} className="text-xs text-slate-400 hover:text-white">
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8 flex-1">
        {/* Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Campus Network Oversight</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            PEERSOLVE ADMIN CENTER
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
            Monitor aggregate peer learning metrics, campus skill supply vs demand, and knowledge gap alerts across departments.
          </p>
        </div>

        {/* Core KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-bold uppercase block">Total Active Students</span>
            <span className="text-3xl font-extrabold text-white mt-1 block">1,240</span>
            <span className="text-[10px] text-emerald-400 block mt-1">+18% this month</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-bold uppercase block">Knowledge Exchanges</span>
            <span className="text-3xl font-extrabold text-indigo-400 mt-1 block">842</span>
            <span className="text-[10px] text-indigo-300 block mt-1">60-min reciprocal sessions</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-bold uppercase block">Avg Learning Gain</span>
            <span className="text-3xl font-extrabold text-emerald-400 mt-1 block">+24.5</span>
            <span className="text-[10px] text-emerald-300 block mt-1">Points post-session</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-bold uppercase block">Verified Mentors</span>
            <span className="text-3xl font-extrabold text-sky-400 mt-1 block">312</span>
            <span className="text-[10px] text-sky-300 block mt-1">Teacher & peer endorsed</span>
          </div>
        </div>

        {/* Skill Supply vs Demand Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              SKILL DEMAND (Most Requested Topics)
            </h3>

            <div className="space-y-3 text-xs">
              {[
                { topic: 'Machine Learning', count: 184, percent: 85 },
                { topic: 'React & Frontend', count: 162, percent: 75 },
                { topic: 'Cybersecurity & CTF', count: 140, percent: 65 },
                { topic: 'Cloud Computing & AWS', count: 110, percent: 50 },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-slate-200 font-semibold">
                    <span>{item.topic}</span>
                    <span className="text-indigo-400">{item.count} Requests</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              SKILL SUPPLY (Most Available Peer Mentors)
            </h3>

            <div className="space-y-3 text-xs">
              {[
                { topic: 'Python Programming', count: 210, percent: 90 },
                { topic: 'C & C++ Languages', count: 175, percent: 80 },
                { topic: 'DBMS & SQL', count: 150, percent: 70 },
                { topic: 'Data Structures', count: 130, percent: 60 },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-slate-200 font-semibold">
                    <span>{item.topic}</span>
                    <span className="text-emerald-400">{item.count} Mentors</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Knowledge Gap Detection Alert Box */}
        <div className="p-6 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>KNOWLEDGE GAP DETECTION ALERT</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            High Demand + Low Supply identified in <strong>Cybersecurity</strong> (Demand: 140 requests, Mentors: 12 available). Recommendation: Organize a faculty-guided Cybersecurity peer mentor bootcamp.
          </p>
        </div>
      </main>
    </div>
  );
};
