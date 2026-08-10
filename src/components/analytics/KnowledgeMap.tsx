import React, { useState } from 'react';
import { Network, Sparkles, Filter, Users, BookOpen, Layers } from 'lucide-react';

export const KnowledgeMap: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'teach' | 'learn'>('all');

  const nodes = [
    { id: 'n1', label: 'Python', type: 'skill', count: 18, x: 20, y: 30, color: 'emerald' },
    { id: 'n2', label: 'React', type: 'skill', count: 14, x: 70, y: 25, color: 'indigo' },
    { id: 'n3', label: 'Machine Learning', type: 'skill', count: 22, x: 45, y: 70, color: 'amber' },
    { id: 'n4', label: 'Cybersecurity', type: 'skill', count: 12, x: 80, y: 75, color: 'sky' },
    { id: 'n5', label: 'DBMS', type: 'skill', count: 15, x: 15, y: 75, color: 'purple' },
    // Student Nodes
    { id: 's1', label: 'Rahul Sharma', type: 'student', teaches: 'React', learns: 'Python', x: 50, y: 20 },
    { id: 's2', label: 'Akshaya Menon', type: 'student', teaches: 'Python', learns: 'React', x: 30, y: 45 },
    { id: 's3', label: 'Anu Varghese', type: 'student', teaches: 'Cybersecurity', learns: 'Python', x: 75, y: 50 },
    { id: 's4', label: 'Arjun Kumar', type: 'student', teaches: 'Machine Learning', learns: 'DBMS', x: 35, y: 80 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <Network className="w-3.5 h-3.5 text-indigo-400" />
          <span>Campus Peer Network Visualization</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          COLLEGE KNOWLEDGE MAP
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
          Visualizing the hidden knowledge connections across campus departments. See how student skill supply connects directly with student skill demand.
        </p>
      </div>

      {/* Network Canvas Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-300">Filter Nodes:</span>
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1 rounded-lg font-semibold ${
                activeCategory === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400'
              }`}
            >
              All Skills & Students
            </button>
            <button
              onClick={() => setActiveCategory('teach')}
              className={`px-3 py-1 rounded-lg font-semibold ${
                activeCategory === 'teach' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400'
              }`}
            >
              High Mentor Supply
            </button>
            <button
              onClick={() => setActiveCategory('learn')}
              className={`px-3 py-1 rounded-lg font-semibold ${
                activeCategory === 'learn' ? 'bg-amber-600 text-white' : 'bg-slate-950 text-slate-400'
              }`}
            >
              High Student Demand
            </button>
          </div>

          <span className="text-xs text-slate-400">Interconnected Campus Nodes</span>
        </div>

        {/* Network Graphic Container */}
        <div className="w-full h-96 bg-slate-950 rounded-2xl border border-slate-800 relative p-6 flex flex-col justify-between overflow-hidden">
          {/* Subtle Grid Lines Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

          {/* Interactive Node Items */}
          <div className="relative w-full h-full">
            {nodes.map((node) => (
              <div
                key={node.id}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 p-3 rounded-2xl border backdrop-blur-md shadow-xl transition-all cursor-pointer hover:scale-110 z-10 ${
                  node.type === 'skill'
                    ? 'bg-slate-900/90 border-indigo-500/50 text-white'
                    : 'bg-indigo-950/80 border-emerald-500/50 text-emerald-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${node.type === 'skill' ? 'bg-indigo-400' : 'bg-emerald-400'}`} />
                  <span className="font-bold text-xs">{node.label}</span>
                </div>
                {node.count && (
                  <span className="text-[10px] text-slate-400 block mt-0.5">{node.count} active peers</span>
                )}
                {node.teaches && (
                  <span className="text-[10px] text-indigo-300 block mt-0.5">Teaches: {node.teaches}</span>
                )}
              </div>
            ))}
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-400 inline-block" /> Skill Nodes
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block ml-3" /> Student Peer Mentors
            </span>
            <span>Real-Time Knowledge Flow Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
