import React from 'react';
import { StudentProfile, SessionData, MatchResult } from '../../types';
import { StudentNavView } from '../navigation/StudentNavbar';
import {
  Search,
  HandHeart,
  Award,
  HelpCircle,
  Clock,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Check,
  Bookmark
} from 'lucide-react';

interface StudentDashboardProps {
  studentProfile: StudentProfile;
  onNavigate: (view: StudentNavView) => void;
  upcomingSessions: SessionData[];
  recommendedMatches: MatchResult[];
  onSelectMatch: (match: MatchResult) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  studentProfile,
  onNavigate,
  upcomingSessions,
  recommendedMatches,
  onSelectMatch,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Welcome Greeting Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Reciprocal Peer Learning Active</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Good evening, {studentProfile.nickname || studentProfile.name} 👋
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
            What do you want to do today? Connect with fellow students to exchange Python, React, Cybersecurity, or DBMS skills.
          </p>
        </div>
      </div>

      {/* Primary 4 Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Action 1: Find My Learning Partner */}
        <button
          onClick={() => onNavigate('find_peer')}
          className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900 border border-indigo-500/30 hover:border-indigo-500 hover:scale-[1.02] transition-all text-left shadow-lg group relative overflow-hidden"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
            <Search className="w-6 h-6 text-indigo-400 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-base font-extrabold text-white mb-1 group-hover:text-indigo-300 transition-colors flex items-center gap-2">
            🔍 FIND MY LEARNING PARTNER
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI matches you with peers who teach what you need and want what you know.
          </p>
        </button>

        {/* Action 2: Who Can I Help? */}
        <button
          onClick={() => onNavigate('who_can_i_help')}
          className="p-6 rounded-2xl bg-gradient-to-br from-emerald-900/40 via-slate-900 to-slate-900 border border-emerald-500/30 hover:border-emerald-500 hover:scale-[1.02] transition-all text-left shadow-lg group relative overflow-hidden"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors">
            <HandHeart className="w-6 h-6 text-emerald-400 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-base font-extrabold text-white mb-1 group-hover:text-emerald-300 transition-colors flex items-center gap-2">
            🤝 WHO CAN I HELP?
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Discover students who are looking for help with skills you've mastered.
          </p>
        </button>

        {/* Action 3: My Skills */}
        <button
          onClick={() => onNavigate('skill_passport')}
          className="p-6 rounded-2xl bg-gradient-to-br from-sky-900/40 via-slate-900 to-slate-900 border border-sky-500/30 hover:border-sky-500 hover:scale-[1.02] transition-all text-left shadow-lg group relative overflow-hidden"
        >
          <div className="w-12 h-12 rounded-xl bg-sky-600/20 border border-sky-500/30 flex items-center justify-center mb-4 group-hover:bg-sky-600 transition-colors">
            <Award className="w-6 h-6 text-sky-400 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-base font-extrabold text-white mb-1 group-hover:text-sky-300 transition-colors flex items-center gap-2">
            📚 MY SKILL PASSPORT
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Track self-ratings, AI assessments, peer reviews, and verified skill levels.
          </p>
        </button>

        {/* Action 4: Ask A Peer */}
        <button
          onClick={() => onNavigate('ask_peer')}
          className="p-6 rounded-2xl bg-gradient-to-br from-amber-900/40 via-slate-900 to-slate-900 border border-amber-500/30 hover:border-amber-500 hover:scale-[1.02] transition-all text-left shadow-lg group relative overflow-hidden"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center mb-4 group-hover:bg-amber-600 transition-colors">
            <HelpCircle className="w-6 h-6 text-amber-400 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-base font-extrabold text-white mb-1 group-hover:text-amber-300 transition-colors flex items-center gap-2">
            🧠 ASK A PEER
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Post doubts anonymously or publicly to receive instant AI + peer explanations.
          </p>
        </button>
      </div>

      {/* Grid: Upcoming Sessions & Recommended Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upcoming Sessions & Progress */}
        <div className="lg:col-span-7 space-y-6">
          {/* Upcoming Sessions Widget */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                Upcoming Knowledge Exchanges
              </h2>
              <button
                onClick={() => onNavigate('sessions')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {upcomingSessions.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-800 text-center space-y-2">
                <Calendar className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No scheduled sessions for today.</p>
                <button
                  onClick={() => onNavigate('find_peer')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                >
                  Find a Peer Now
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.sessionId}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-indigo-500/50 transition-colors space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-bold text-white">{session.scheduledTime}</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {session.durationMinutes} Mins
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-900 text-xs">
                      <div>
                        <span className="text-[10px] text-indigo-300 uppercase font-semibold block">Mentor Teaches</span>
                        <span className="font-bold text-white">{session.teachSkill}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-300 uppercase font-semibold block">Learner Teaches</span>
                        <span className="font-bold text-white">{session.learnSkill || 'Reciprocal Exchange'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-slate-400">
                        With <strong className="text-slate-200">{session.mentorName === studentProfile.name ? session.learnerName : session.mentorName}</strong>
                      </span>
                      <button
                        onClick={() => onNavigate('sessions')}
                        className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                      >
                        Launch Workspace
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Shared Covered Topics Widget */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Peer Shared Covered Topics</h2>
              </div>
              <button
                onClick={() => onNavigate('sessions')}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                Log New Topic <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Topics recently logged by your exchange peers during study sessions. Review or update status to sync your study plan!
            </p>

            <div className="space-y-2.5">
              {upcomingSessions.flatMap(s => s.coveredTopics || []).length > 0 ? (
                upcomingSessions.flatMap(s => s.coveredTopics || []).map((topic) => (
                  <div key={topic.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{topic.topicName}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-bold">
                          {topic.status}
                        </span>
                      </div>
                      {topic.notes && <p className="text-[11px] text-slate-400">💡 {topic.notes}</p>}
                      <p className="text-[10px] text-slate-500">Logged by {topic.updatedByPeer} • {topic.updatedAt}</p>
                    </div>
                    <button
                      onClick={() => onNavigate('sessions')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 shrink-0"
                    >
                      Study Topic
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                  No covered topics logged yet. Launch a session to log topics together!
                </div>
              )}
            </div>
          </div>

          {/* Skill Growth & Impact Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Your Peer Impact & Knowledge Gain
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-2xl font-extrabold text-indigo-400 block">{studentProfile.impactMetrics.studentsHelped}</span>
                <span className="text-[11px] text-slate-400">Students Helped</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-2xl font-extrabold text-emerald-400 block">{studentProfile.impactMetrics.sessionsTaught}</span>
                <span className="text-[11px] text-slate-400">Sessions Taught</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-2xl font-extrabold text-sky-400 block">{studentProfile.impactMetrics.avgPeerRating} ★</span>
                <span className="text-[11px] text-slate-400">Peer Rating</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-2xl font-extrabold text-amber-400 block">+{studentProfile.impactMetrics.learningImprovements}</span>
                <span className="text-[11px] text-slate-400">Avg Gain Points</span>
              </div>
            </div>

            {/* Badges Row */}
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">Earned Badges</span>
              <div className="flex flex-wrap gap-2">
                {studentProfile.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Recommended Matches */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                AI Recommended Matches
              </h2>
              <button
                onClick={() => onNavigate('find_peer')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Find More
              </button>
            </div>

            <div className="space-y-3">
              {recommendedMatches.slice(0, 3).map((match, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-indigo-500/60 transition-all space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {match.peerProfile.name}
                      </h3>
                      <p className="text-[11px] text-slate-400">{match.peerProfile.course} • {match.peerProfile.branch}</p>
                    </div>

                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-xs border border-emerald-500/30">
                        {match.matchScore}% MATCH
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900 p-2.5 rounded-lg border border-slate-800/50">
                    <div>
                      <span className="text-[10px] text-indigo-300 block font-semibold">Teaches</span>
                      <span className="font-bold text-white">{match.teachSkillMatch}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-300 block font-semibold">Learns</span>
                      <span className="font-bold text-white">{match.learnSkillMatch}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {match.whyMatch.slice(0, 2).map((reason, rIdx) => (
                      <p key={rIdx} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{reason}</span>
                      </p>
                    ))}
                  </div>

                  <button
                    onClick={() => onSelectMatch(match)}
                    className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                  >
                    Connect & Schedule Session
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy & Safety Quick Banner */}
          <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Campus Privacy Shield</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Phone numbers, email addresses, and private messaging are strictly protected. All connections are opt-in with mutual consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
