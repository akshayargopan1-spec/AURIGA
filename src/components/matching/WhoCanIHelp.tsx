import React, { useState } from 'react';
import { StudentProfile, MatchResult } from '../../types';
import { DEMO_STUDENTS } from '../../data/demoData';
import { HandHeart, Sparkles, UserCheck, ArrowRight, TrendingUp, CheckCircle } from 'lucide-react';

interface WhoCanIHelpProps {
  studentProfile: StudentProfile;
  onSelectHelpPeer: (peerProfile: StudentProfile, skillNeeded: string) => void;
}

export const WhoCanIHelp: React.FC<WhoCanIHelpProps> = ({ studentProfile, onSelectHelpPeer }) => {
  const [selectedTeachSkill, setSelectedTeachSkill] = useState(
    studentProfile.canTeach[0]?.skill || 'Python'
  );

  // Find students in DEMO_STUDENTS who want to learn this skill
  const needyStudents = DEMO_STUDENTS.filter((s) =>
    s.uid !== studentProfile.uid &&
    s.wantToLearn.some((g) => g.skill.toLowerCase() === selectedTeachSkill.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
          <HandHeart className="w-3.5 h-3.5 text-emerald-400" />
          <span>Reverse Knowledge Discovery</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          WHO CAN I HELP?
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
          Discover fellow students who are currently looking for mentoring in skills you have mastered. Turn your knowledge into active campus impact!
        </p>
      </div>

      {/* Skill Filter Selector */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider">
          Select A Skill You Can Teach
        </label>
        <div className="flex flex-wrap gap-2">
          {studentProfile.canTeach.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedTeachSkill(s.skill)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedTeachSkill === s.skill
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {s.skill} ({s.level})
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>
              <strong>{needyStudents.length} students</strong> currently need assistance with <strong>{selectedTeachSkill}</strong>.
            </span>
          </div>
          <span className="font-bold text-emerald-400">+15 Knowledge Impact Points / Session</span>
        </div>

        {needyStudents.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-slate-800 text-center space-y-2">
            <UserCheck className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">All student requests for {selectedTeachSkill} are currently matched!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {needyStudents.map((peer, idx) => {
              const learnGoal = peer.wantToLearn.find(
                (g) => g.skill.toLowerCase() === selectedTeachSkill.toLowerCase()
              );

              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/60 transition-all space-y-4 shadow-xl group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {peer.name}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {peer.course} • {peer.branch}
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-bold border border-emerald-500/20">
                      Needs Mentor
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Target Goal</span>
                    <span className="font-bold text-white block">
                      {selectedTeachSkill} ({learnGoal?.targetLevel || 'Intermediate'})
                    </span>
                    <span className="text-[11px] text-emerald-400 block mt-1">
                      Current level: {learnGoal?.currentScore || 35}%
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Available Times</span>
                    <p className="font-medium text-slate-200">{peer.availableSlots.join(', ')}</p>
                  </div>

                  <button
                    onClick={() => onSelectHelpPeer(peer, selectedTeachSkill)}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Offer Peer Mentoring</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
