import React, { useState } from 'react';
import { UserRole } from '../../types';
import { DEMO_STUDENTS, DEMO_TEACHER } from '../../data/demoData';
import { BookOpen, Users, Shield, Sparkles, CheckCircle, GraduationCap, ArrowRight } from 'lucide-react';

import peerSolveBg from '../../assets/images/peersolve_hero_bg_1786340234774.jpg';

interface AuthScreenProps {
  onLoginSuccess: (userRole: UserRole, userObj: any, isDemo?: boolean) => void;
  onStartOnboarding: (initialData?: { name?: string; email?: string; college?: string }) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess, onStartOnboarding }) => {
  const [activeTab, setActiveTab] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('National Institute of Technology');
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      if (activeTab === 'student') {
        onStartOnboarding({ name, email, college });
      } else {
        const teacherObj = {
          uid: 'teacher-' + Date.now(),
          email,
          name: name || 'Professor',
          college,
          department: 'Computer Science',
          coursesHandled: ['Software Engineering'],
        };
        onLoginSuccess('teacher', teacherObj, false);
      }
    } else {
      // Direct login
      const dummyUser = {
        uid: activeTab + '-' + Date.now(),
        email: email || `${activeTab}@college.edu`,
        name: name || (activeTab === 'student' ? 'Alex Student' : activeTab === 'teacher' ? 'Dr. Smith' : 'System Admin'),
        college,
      };
      onLoginSuccess(activeTab, dummyUser, false);
    }
  };

  const handleDemoLogin = (role: UserRole, demoIndex: number = 0) => {
    if (role === 'student') {
      const demoStudent = DEMO_STUDENTS[demoIndex];
      onLoginSuccess('student', demoStudent, true);
    } else if (role === 'teacher') {
      onLoginSuccess('teacher', DEMO_TEACHER, true);
    } else {
      const adminObj = {
        uid: 'demo-admin',
        email: 'admin@college.edu',
        name: 'Dean of Academics (Admin)',
        college: 'National Institute of Technology',
        isDemo: true,
      };
      onLoginSuccess('admin', adminObj, true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden bg-edtech-glow">
      {/* Background Image Texture with Soft Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-normal pointer-events-none z-0"
        style={{ backgroundImage: `url(${peerSolveBg})` }}
      />

      {/* Subtle Ambient Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-cyan-200/35 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-200/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Bar */}
      <header className="px-6 py-5 border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 p-[2px] flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              PeerSolve
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI Peer Network
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleDemoLogin('student', 0)}
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Try Demo Mode
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto w-full px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 flex-1">
        {/* Left Side: Product Vision & Value Proposition */}
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>AI-Powered Reciprocal Campus Skill Exchange</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Learn What You Need. <br />
              <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                Teach What You Know.
              </span>
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
              Every college campus holds thousands of students with complementary knowledge. PeerSolve uses AI to discover skill swaps, schedule structured knowledge exchanges, and measure real learning growth.
            </p>
          </div>

          {/* Core Product Story & Differentiator Quote */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-indigo-500/30 backdrop-blur-md space-y-4 shadow-xl">
            <blockquote className="text-xs sm:text-sm text-indigo-100 italic leading-relaxed border-l-2 border-indigo-400 pl-3">
              “PeerSolve doesn't just find who can teach you. It understands where you are, what you need to learn, when you can learn it, who can help you, and whether the learning actually worked.”
            </blockquote>

            <div className="pt-2 border-t border-slate-800">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">The 5-Stage Peer Learning Impact Loop</p>
              <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-extrabold">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">1. ASSESS</span>
                <span className="text-slate-500">→</span>
                <span className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30">2. MATCH</span>
                <span className="text-slate-500">→</span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">3. LEARN</span>
                <span className="text-slate-500">→</span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">4. MEASURE</span>
                <span className="text-slate-500">→</span>
                <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">5. IMPROVE</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Selector Cards */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Hackathon Demo Personas</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleDemoLogin('student', 0)}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all text-left group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">Rahul (Student)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Teaches React</span>
                </div>
                <p className="text-[11px] text-slate-400">Wants to learn Python. 92% Match demo ready.</p>
              </button>

              <button
                onClick={() => handleDemoLogin('student', 1)}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all text-left group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">Akshaya (Student)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Teaches Python</span>
                </div>
                <p className="text-[11px] text-slate-400">Wants to learn React. High impact mentor.</p>
              </button>

              <button
                onClick={() => handleDemoLogin('teacher')}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800/80 transition-all text-left group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">Dr. Nair (Faculty)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">Teacher Center</span>
                </div>
                <p className="text-[11px] text-slate-400">Skill verification & class demand insights.</p>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Professional Auth Panel */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
            {/* Role Navigation Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950/80 rounded-xl mb-6 border border-slate-800/80">
              <button
                onClick={() => setActiveTab('student')}
                className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'student'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Student
              </button>
              <button
                onClick={() => setActiveTab('teacher')}
                className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'teacher'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Teacher
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-white">
                {isSignup ? `Create ${activeTab.toUpperCase()} Account` : `${activeTab.toUpperCase()} Login`}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {activeTab === 'student'
                  ? 'Connect with peers to exchange knowledge and track skill growth.'
                  : activeTab === 'teacher'
                  ? 'Endorse student skills and orchestrate peer learning circles.'
                  : 'Monitor institutional peer learning network analytics.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">College Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. student@college.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {activeTab === 'student' && isSignup && (
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
                  ✨ Clicking continue will start the 5-step Skill & Availability onboarding wizard.
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group"
              >
                {isSignup ? (activeTab === 'student' ? 'Start Student Onboarding' : 'Create Account') : 'Sign In'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                {isSignup ? 'Already have an account? Sign in' : `Need a ${activeTab} account? Register`}
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin(activeTab)}
                className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Demo {activeTab.toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-slate-800/60 bg-slate-950/80 text-center text-xs text-slate-500 z-10">
        PeerSolve Campus Knowledge Network &copy; 2026. Built with AI Skill Matching & Privacy-First Architecture.
      </footer>
    </div>
  );
};
