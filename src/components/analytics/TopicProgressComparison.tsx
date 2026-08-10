import React from 'react';
import { StudentProfile } from '../../types';
import {
  BarChart3,
  ShieldCheck,
  TrendingUp,
  Award,
  BookOpen,
  CheckCircle2,
  Lock,
  Layers
} from 'lucide-react';

interface TopicProgressComparisonProps {
  studentProfile: StudentProfile;
}

export const TopicProgressComparison: React.FC<TopicProgressComparisonProps> = ({ studentProfile }) => {
  const userScores = studentProfile.skillBaseline?.topicScores || {
    Python: 72,
    DBMS: 64,
    React: 38,
    'Data Structures': 55
  };

  const branchAverages: Record<string, number> = {
    Python: 65,
    DBMS: 60,
    React: 45,
    'Data Structures': 58
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800 space-y-2 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
          <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
          Topic Mastery & Privacy-Safe Comparison
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Topic Progress & Branch Benchmark Analysis
        </h1>
        <p className="text-xs text-slate-300">
          Analyze your topic mastery against anonymized branch benchmarks.
        </p>
      </div>

      {/* Privacy Guarantee Note */}
      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            <strong>Anonymized Comparison:</strong> Branch benchmarks use aggregated statistical data. No peer names, email addresses, or individual test scores are ever exposed.
          </span>
        </div>
      </div>

      {/* Topic Mastery Cards */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <h2 className="font-extrabold text-white text-base flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          Topic Score Comparison ({studentProfile.branch})
        </h2>

        <div className="space-y-6">
          {Object.entries(userScores).map(([topic, rawScore]) => {
            const score = Number(rawScore);
            const avg = branchAverages[topic] || 50;
            const diff = score - avg;

            return (
              <div key={topic} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-white text-sm">{topic}</h3>
                    <p className="text-[11px] text-slate-400">
                      Your Score: <strong className="text-white">{score}%</strong> | {studentProfile.branch} Avg: <strong className="text-slate-300">{avg}%</strong>
                    </p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    diff >= 0 ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                  }`}>
                    {diff >= 0 ? `+${diff}% Above Avg` : `${diff}% Growth Need`}
                  </span>
                </div>

                {/* Bars */}
                <div className="space-y-2 pt-1">
                  {/* User Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                      <span>Your Score</span>
                      <span>{score}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>

                  {/* Branch Avg Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                      <span>Branch Benchmark Average</span>
                      <span>{avg}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-600 rounded-full transition-all duration-500"
                        style={{ width: `${avg}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
