import React from 'react';
import {
  Users,
  Search,
  HandHeart,
  Award,
  Clock,
  HelpCircle,
  FileText,
  Network,
  Shield,
  LogOut,
  Sparkles,
  Layers,
  GraduationCap,
  Brain,
  Target,
  Calendar,
  Trophy,
  BarChart3,
  Bot
} from 'lucide-react';
import { StudentProfile } from '../../types';

export type StudentNavView =
  | 'dashboard'
  | 'entry_assessment'
  | 'learning_plan'
  | 'study_timetable'
  | 'peer_league'
  | 'find_peer'
  | 'who_can_i_help'
  | 'skill_passport'
  | 'topic_comparison'
  | 'sessions'
  | 'ask_peer'
  | 'resources'
  | 'knowledge_map'
  | 'privacy_center';

interface StudentNavbarProps {
  currentView: StudentNavView;
  onNavigate: (view: StudentNavView) => void;
  studentProfile: StudentProfile;
  isDemo?: boolean;
  onLogout: () => void;
  onSwitchRole?: (role: string) => void;
  onToggleAiChat?: () => void;
}

export const StudentNavbar: React.FC<StudentNavbarProps> = ({
  currentView,
  onNavigate,
  studentProfile,
  isDemo,
  onLogout,
  onSwitchRole,
  onToggleAiChat,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Users },
    { id: 'entry_assessment', label: 'Assessment', icon: Brain },
    { id: 'learning_plan', label: 'Learning Plan', icon: Target },
    { id: 'study_timetable', label: 'Timetable', icon: Calendar },
    { id: 'peer_league', label: 'Peer League', icon: Trophy },
    { id: 'find_peer', label: 'Find Peer', icon: Search },
    { id: 'who_can_i_help', label: 'Who Can I Help?', icon: HandHeart },
    { id: 'skill_passport', label: 'Skill Passport', icon: Award },
    { id: 'topic_comparison', label: 'Analytics', icon: BarChart3 },
    { id: 'sessions', label: 'Sessions', icon: Clock },
    { id: 'ask_peer', label: 'Ask a Peer', icon: HelpCircle },
    { id: 'resources', label: 'Resources', icon: FileText },
    { id: 'knowledge_map', label: 'Campus Map', icon: Network },
    { id: 'privacy_center', label: 'Privacy', icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 p-[2px] shadow-md shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Users className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight block leading-none">
                PeerSolve
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Campus Knowledge Network</span>
            </div>
          </button>

          {isDemo && (
            <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              DEMO DATA
            </span>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as StudentNavView)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Profile Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Role Switcher for Hackathon Judges */}
          {onSwitchRole && (
            <div className="hidden sm:flex items-center gap-1 bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
              <button
                onClick={() => onSwitchRole('teacher')}
                className="px-2 py-1 text-[11px] font-medium text-slate-300 hover:text-white flex items-center gap-1"
                title="Switch to Teacher View"
              >
                <GraduationCap className="w-3 h-3 text-sky-400" />
                Teacher
              </button>
              <button
                onClick={() => onSwitchRole('admin')}
                className="px-2 py-1 text-[11px] font-medium text-slate-300 hover:text-white flex items-center gap-1"
                title="Switch to Admin View"
              >
                <Layers className="w-3 h-3 text-indigo-400" />
                Admin
              </button>
            </div>
          )}

          {/* AI Chatbot Trigger Button */}
          {onToggleAiChat && (
            <button
              onClick={onToggleAiChat}
              className="px-2.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
              title="Open AI Tutor"
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline-block">AI Tutor</span>
            </button>
          )}

          {/* User Badge */}
          <button
            onClick={() => onNavigate('skill_passport')}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-indigo-500 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
              {studentProfile.name.charAt(0)}
            </div>
            <div className="text-left hidden md:block">
              <span className="text-xs font-bold text-white block leading-tight">{studentProfile.nickname || studentProfile.name}</span>
              <span className="text-[10px] text-emerald-400 font-medium block leading-none">
                Score: {studentProfile.reliabilityScore}%
              </span>
            </div>
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Scrollable Nav */}
      <div className="flex lg:hidden overflow-x-auto px-4 py-2 border-t border-slate-800/80 bg-slate-950/80 gap-1 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as StudentNavView)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
