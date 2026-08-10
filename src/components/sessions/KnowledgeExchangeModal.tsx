import React, { useState } from 'react';
import { MatchResult, StudentProfile, SessionData } from '../../types';
import { Clock, Check, X, Sparkles, Calendar, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface KnowledgeExchangeModalProps {
  matchResult: MatchResult;
  currentUser: StudentProfile;
  onClose: () => void;
  onConfirmSession: (session: SessionData) => void;
}

export const KnowledgeExchangeModal: React.FC<KnowledgeExchangeModalProps> = ({
  matchResult,
  currentUser,
  onClose,
  onConfirmSession,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [selectedTime, setSelectedTime] = useState<string>(
    matchResult.commonTimeSlot || 'Today, 7:00 PM – 8:00 PM'
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCreateSession = async () => {
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/session-agenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teachSkill: matchResult.teachSkillMatch,
          learnSkill: matchResult.learnSkillMatch,
          durationMinutes: selectedDuration,
          mentorName: matchResult.peerProfile.name,
          learnerName: currentUser.name,
        }),
      });

      const data = await res.json();
      const agenda = data.agenda || [
        { timeOffset: '00–05', title: 'Introductions & Goal Alignment', description: 'Greeting and topic review.', speaker: 'both' },
        { timeOffset: '05–25', title: `${matchResult.peerProfile.name} teaches ${matchResult.teachSkillMatch}`, description: 'Concept explanation and hands-on code examples.', speaker: 'mentor' },
        { timeOffset: '25–30', title: 'Concept Check & Quiz', description: '3 quick questions to check comprehension.', speaker: 'learner' },
        { timeOffset: '30–50', title: `${currentUser.name} teaches ${matchResult.learnSkillMatch}`, description: 'Reciprocal skill walkthrough.', speaker: 'learner' },
        { timeOffset: '50–55', title: 'Comprehension Quiz', description: 'Quick check on reciprocal skill.', speaker: 'mentor' },
        { timeOffset: '55–60', title: 'Reflection & Feedback', description: 'Review progress and record learning gain.', speaker: 'both' },
      ];

      const newSession: SessionData = {
        sessionId: 'session-' + Date.now(),
        mentorUid: matchResult.peerProfile.uid,
        learnerUid: currentUser.uid,
        mentorName: matchResult.peerProfile.name,
        learnerName: currentUser.name,
        teachSkill: matchResult.teachSkillMatch,
        learnSkill: matchResult.learnSkillMatch,
        scheduledTime: selectedTime,
        durationMinutes: selectedDuration,
        status: 'scheduled',
        agenda,
        beforeScore: 42,
        createdAt: new Date().toISOString(),
      };

      onConfirmSession(newSession);
    } catch (err) {
      console.warn('Agenda API fallback:', err);
      const newSession: SessionData = {
        sessionId: 'session-' + Date.now(),
        mentorUid: matchResult.peerProfile.uid,
        learnerUid: currentUser.uid,
        mentorName: matchResult.peerProfile.name,
        learnerName: currentUser.name,
        teachSkill: matchResult.teachSkillMatch,
        learnSkill: matchResult.learnSkillMatch,
        scheduledTime: selectedTime,
        durationMinutes: selectedDuration,
        status: 'scheduled',
        beforeScore: 42,
        createdAt: new Date().toISOString(),
      };
      onConfirmSession(newSession);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Reciprocal Exchange Proposal
            </div>
            <h2 className="text-xl font-extrabold text-white">
              Create Knowledge Exchange with {matchResult.peerProfile.name}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Knowledge Exchange Breakdown */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            EQUAL RECIPROCAL SKILL SWAP
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-1">
              <span className="text-[10px] text-indigo-300 uppercase font-bold block">
                {matchResult.peerProfile.name.toUpperCase()} TEACHES YOU
              </span>
              <span className="font-bold text-white text-sm block">{matchResult.teachSkillMatch}</span>
              <span className="text-slate-400 block text-[11px]">{selectedDuration / 2} Minutes</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 space-y-1">
              <span className="text-[10px] text-emerald-300 uppercase font-bold block">
                YOU TEACH {matchResult.peerProfile.name.toUpperCase()}
              </span>
              <span className="font-bold text-white text-sm block">{matchResult.learnSkillMatch}</span>
              <span className="text-slate-400 block text-[11px]">{selectedDuration / 2} Minutes</span>
            </div>
          </div>
        </div>

        {/* Micro-Learning & Duration Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Session Duration</span>
            <span className="text-indigo-400 flex items-center gap-1 font-normal text-[11px]">
              <Zap className="w-3 h-3 text-amber-400" /> Micro-Learning Option
            </span>
          </label>

          <div className="grid grid-cols-4 gap-2">
            {[15, 30, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => setSelectedDuration(mins)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                  selectedDuration === mins
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {mins} Mins
              </button>
            ))}
          </div>
        </div>

        {/* Schedule Slot Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            Proposed Meeting Time
          </label>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>{selectedTime}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              Mutual Overlap
            </span>
          </div>
        </div>

        {/* Privacy Safeguard Note */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>In-app collaborative workspace will be generated automatically upon confirmation. Phone numbers and private messages are not exposed.</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            Decline
          </button>
          <button
            onClick={handleCreateSession}
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2"
          >
            {isGenerating ? (
              <span>Generating AI Agenda...</span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>CONFIRM & GENERATE SESSION</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
