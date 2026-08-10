import React, { useState, useEffect } from 'react';
import { UserRole, StudentProfile, TeacherProfile, SessionData, MatchResult, DoubtItem, SkillBaseline } from './types';
import { DEMO_STUDENTS, DEMO_TEACHER, DEMO_SESSIONS, DEMO_DOUBTS } from './data/demoData';
import { AuthScreen } from './components/auth/AuthScreen';
import { StudentOnboarding } from './components/onboarding/StudentOnboarding';
import { StudentNavbar, StudentNavView } from './components/navigation/StudentNavbar';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { SkillPassport } from './components/passport/SkillPassport';
import { PeerMatching } from './components/matching/PeerMatching';
import { WhoCanIHelp } from './components/matching/WhoCanIHelp';
import { KnowledgeExchangeModal } from './components/sessions/KnowledgeExchangeModal';
import { SessionWorkspace } from './components/sessions/SessionWorkspace';
import { AskAPeer } from './components/doubts/AskAPeer';
import { KnowledgeMap } from './components/analytics/KnowledgeMap';
import { PrivacyCenter } from './components/privacy/PrivacyCenter';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { EntryAssessment } from './components/assessment/EntryAssessment';
import { PersonalizedLearningPlan } from './components/learning/PersonalizedLearningPlan';
import { StudyPlannerAndTimetable } from './components/planning/StudyPlannerAndTimetable';
import { PeerLeagueAndFeed } from './components/social/PeerLeagueAndFeed';
import { TopicProgressComparison } from './components/analytics/TopicProgressComparison';
import { AiChatbot } from './components/chat/AiChatbot';
import { fetchAllStudents, saveStudentProfile, fetchUserSessions, saveSessionData } from './lib/firebase';
import peerSolveBg from './assets/images/peersolve_hero_bg_1786340234774.jpg';

export default function App() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [isOnboarding, setIsOnboarding] = useState<boolean>(false);
  const [onboardingInitialData, setOnboardingInitialData] = useState<{ name?: string; email?: string; college?: string }>({});
  const [isAssessmentPending, setIsAssessmentPending] = useState<boolean>(false);

  // Student Profile State
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(DEMO_STUDENTS[0]);

  // View State
  const [studentView, setStudentView] = useState<StudentNavView>('dashboard');
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);

  // Active Session & Matching State
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);
  const [activeSessionWorkspace, setActiveSessionWorkspace] = useState<SessionData | null>(null);
  const [userSessions, setUserSessions] = useState<SessionData[]>(DEMO_SESSIONS);

  // Doubts State
  const [doubts, setDoubts] = useState<DoubtItem[]>(DEMO_DOUBTS);

  // Recommended Matches
  const [recommendedMatches, setRecommendedMatches] = useState<MatchResult[]>([
    {
      matchScore: 94,
      peerProfile: DEMO_STUDENTS[1],
      teachSkillMatch: 'Python',
      learnSkillMatch: 'React',
      commonTimeSlot: '6 PM – 7 PM',
      whyMatch: [
        `Akshaya Menon is an Advanced Python peer mentor.`,
        `Reciprocal interest in React UI components.`,
        `Available in evening time slot (6-7 PM).`
      ],
      reciprocalBenefits: '30 mins Python exchange for 30 mins React.'
    },
    {
      matchScore: 91,
      peerProfile: DEMO_STUDENTS[2],
      teachSkillMatch: 'Cybersecurity',
      learnSkillMatch: 'Data Structures',
      commonTimeSlot: '7 PM – 8 PM',
      whyMatch: [
        `Vikram Singh specializes in Cybersecurity and Network Defense.`,
        `Reciprocal goal in practicing Data Structures algorithms.`,
        `Available in evening time slot (7-8 PM).`
      ],
      reciprocalBenefits: '30 mins Cybersecurity exchange for 30 mins Data Structures.'
    }
  ]);

  const handleStartOnboarding = (initialData?: { name?: string; email?: string; college?: string }) => {
    if (initialData) {
      setOnboardingInitialData(initialData);
    } else {
      setOnboardingInitialData({});
    }
    setIsOnboarding(true);
  };

  const handleLoginSuccess = (role: UserRole, userObj: any, isDemoUser: boolean = false) => {
    setUserRole(role);
    setCurrentUser(userObj);
    setIsDemo(isDemoUser);

    if (role === 'student') {
      if (userObj.canTeach) {
        setStudentProfile(userObj);
      } else {
        const displayName = userObj.name || 'Student';
        const nickname = userObj.nickname || (displayName !== 'Student' ? displayName.split(' ')[0] : 'Student');
        setStudentProfile({
          ...DEMO_STUDENTS[0],
          uid: userObj.uid || 'user-' + Date.now(),
          name: displayName,
          nickname: nickname,
          email: userObj.email || `${nickname.toLowerCase()}@college.edu`,
          college: userObj.college || 'National Institute of Technology',
          isDemo: isDemoUser,
        });
      }
    }
  };

  const handleCompleteOnboarding = async (newProfile: StudentProfile) => {
    setStudentProfile(newProfile);
    setUserRole('student');
    setIsOnboarding(false);
    setIsAssessmentPending(true); // Trigger mandatory assessment right after onboarding
    await saveStudentProfile(newProfile);
  };

  const handleSaveAssessmentBaseline = async (baseline: SkillBaseline) => {
    const updated = {
      ...studentProfile,
      skillBaseline: baseline
    };
    setStudentProfile(updated);
    setIsAssessmentPending(false);
    setStudentView('dashboard');
    await saveStudentProfile(updated);
  };

  const handleUpdateProfile = async (updated: StudentProfile) => {
    setStudentProfile(updated);
    await saveStudentProfile(updated);
  };

  const handleConfirmExchangeSession = async (session: SessionData) => {
    setSelectedMatch(null);
    const updatedSessions = [session, ...userSessions];
    setUserSessions(updatedSessions);
    setActiveSessionWorkspace(session);
    await saveSessionData(session);
  };

  const handleEndWorkspaceSession = async (updatedSession: SessionData) => {
    setActiveSessionWorkspace(null);
    const updatedSessions = userSessions.map(s => s.sessionId === updatedSession.sessionId ? updatedSession : s);
    setUserSessions(updatedSessions);
    await saveSessionData(updatedSession);

    // Update student impact score
    if (updatedSession.learningGain && updatedSession.learningGain > 0) {
      setStudentProfile(prev => ({
        ...prev,
        impactMetrics: {
          ...prev.impactMetrics,
          learningImprovements: prev.impactMetrics.learningImprovements + updatedSession.learningGain!
        }
      }));
    }
  };

  const handleSelectHelpPeer = (peerProfile: StudentProfile, skillNeeded: string) => {
    const helpMatch: MatchResult = {
      matchScore: 95,
      peerProfile,
      teachSkillMatch: skillNeeded,
      learnSkillMatch: 'General Mentoring',
      commonTimeSlot: peerProfile.availableSlots[0] || '7 PM – 8 PM',
      whyMatch: [
        `${peerProfile.name} specifically requested peer mentoring in ${skillNeeded}.`,
        `You have verified proficiency in ${skillNeeded}.`
      ],
      reciprocalBenefits: `30 mins ${skillNeeded} peer mentoring.`
    };
    setSelectedMatch(helpMatch);
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser(null);
    setIsDemo(false);
    setIsOnboarding(false);
    setActiveSessionWorkspace(null);
    setSelectedMatch(null);
  };

  // 1. Not Authenticated
  if (!userRole && !isOnboarding) {
    return (
      <AuthScreen
        onLoginSuccess={handleLoginSuccess}
        onStartOnboarding={handleStartOnboarding}
      />
    );
  }

  // 2. Onboarding Wizard
  if (isOnboarding) {
    return (
      <StudentOnboarding
        initialData={onboardingInitialData}
        onComplete={handleCompleteOnboarding}
        onCancel={() => setIsOnboarding(false)}
      />
    );
  }

  // 2.5 Mandatory Entry Assessment (Immediate post-onboarding step)
  if (isAssessmentPending && userRole === 'student') {
    return (
      <EntryAssessment
        studentProfile={studentProfile}
        onCompleteAssessment={handleSaveAssessmentBaseline}
        onSkipOrCancel={() => setIsAssessmentPending(false)}
      />
    );
  }

  // 3. Teacher Dashboard View
  if (userRole === 'teacher') {
    return (
      <TeacherDashboard
        teacherProfile={currentUser || DEMO_TEACHER}
        onLogout={handleLogout}
        onSwitchRole={(role) => setUserRole(role as UserRole)}
      />
    );
  }

  // 4. Admin Dashboard View
  if (userRole === 'admin') {
    return (
      <AdminDashboard
        onLogout={handleLogout}
        onSwitchRole={(role) => setUserRole(role as UserRole)}
      />
    );
  }

  // 5. Active Live Session Workspace View
  if (activeSessionWorkspace) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <SessionWorkspace
          session={activeSessionWorkspace}
          onEndSession={handleEndWorkspaceSession}
          onBack={() => setActiveSessionWorkspace(null)}
        />
      </div>
    );
  }

  // 6. Primary Student View
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-indigo-500 selection:text-white relative overflow-x-hidden bg-edtech-glow">
      {/* Background Image Texture with Soft Overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-80 mix-blend-normal pointer-events-none z-0"
        style={{ backgroundImage: `url(${peerSolveBg})` }}
      />

      {/* Subtle Ambient Glow Orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-1/3 right-10 w-[500px] h-[500px] bg-cyan-200/25 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-10 left-10 w-[550px] h-[550px] bg-violet-200/30 rounded-full blur-[130px] pointer-events-none z-0" />

      {/* Student Navigation Header */}
      <StudentNavbar
        currentView={studentView}
        onNavigate={setStudentView}
        studentProfile={studentProfile}
        isDemo={isDemo}
        onLogout={handleLogout}
        onSwitchRole={(role) => setUserRole(role as UserRole)}
        onToggleAiChat={() => setIsAiChatOpen(!isAiChatOpen)}
      />

      {/* View Router */}
      <main className="flex-1 pb-12 relative z-10">
        {studentView === 'dashboard' && (
          <StudentDashboard
            studentProfile={studentProfile}
            onNavigate={setStudentView}
            upcomingSessions={userSessions.filter(s => s.status === 'scheduled')}
            recommendedMatches={recommendedMatches}
            onSelectMatch={(match) => setSelectedMatch(match)}
          />
        )}

        {studentView === 'entry_assessment' && (
          <EntryAssessment
            studentProfile={studentProfile}
            onCompleteAssessment={handleSaveAssessmentBaseline}
          />
        )}

        {studentView === 'learning_plan' && (
          <PersonalizedLearningPlan
            studentProfile={studentProfile}
            onNavigateToPeerMatch={(skill) => setStudentView('find_peer')}
          />
        )}

        {studentView === 'study_timetable' && (
          <StudyPlannerAndTimetable
            studentProfile={studentProfile}
          />
        )}

        {studentView === 'peer_league' && (
          <PeerLeagueAndFeed
            studentProfile={studentProfile}
          />
        )}

        {studentView === 'topic_comparison' && (
          <TopicProgressComparison
            studentProfile={studentProfile}
          />
        )}

        {studentView === 'skill_passport' && (
          <SkillPassport
            studentProfile={studentProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {studentView === 'find_peer' && (
          <PeerMatching
            studentProfile={studentProfile}
            onSelectMatch={(match) => setSelectedMatch(match)}
          />
        )}

        {studentView === 'who_can_i_help' && (
          <WhoCanIHelp
            studentProfile={studentProfile}
            onSelectHelpPeer={handleSelectHelpPeer}
          />
        )}

        {studentView === 'sessions' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            <h1 className="text-3xl font-extrabold text-white">Your Peer Sessions</h1>
            <div className="space-y-4">
              {userSessions.map((session) => (
                <div key={session.sessionId} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base">{session.teachSkill} Exchange</h3>
                    <p className="text-xs text-slate-400">Time: {session.scheduledTime} | Status: <span className="text-indigo-400 uppercase font-bold">{session.status}</span></p>
                  </div>
                  <button
                    onClick={() => setActiveSessionWorkspace(session)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                  >
                    Open Workspace
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {studentView === 'ask_peer' && (
          <AskAPeer
            studentProfile={studentProfile}
            doubts={doubts}
            onPostDoubt={(newDoubt) => setDoubts([newDoubt, ...doubts])}
          />
        )}

        {studentView === 'resources' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            <h1 className="text-3xl font-extrabold text-white">Peer Resource Library</h1>
            <p className="text-xs text-slate-400">Notes, cheat sheets, and code references shared by verified peers.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-indigo-400">Cheat Sheet</span>
                <h3 className="font-bold text-white text-base">React Hooks & State Management Best Practices</h3>
                <p className="text-xs text-slate-400">Summary of useState, useEffect, and custom hooks with anti-patterns.</p>
                <div className="text-xs font-bold text-emerald-400 pt-2">42 Peers Found Useful</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-emerald-400">Notes</span>
                <h3 className="font-bold text-white text-base">Python Data Structures & Algorithms Summary</h3>
                <p className="text-xs text-slate-400">Clean code snippets for stack, queues, dicts, and binary tree traversals.</p>
                <div className="text-xs font-bold text-emerald-400 pt-2">38 Peers Found Useful</div>
              </div>
            </div>
          </div>
        )}

        {studentView === 'knowledge_map' && <KnowledgeMap />}

        {studentView === 'privacy_center' && (
          <PrivacyCenter
            studentProfile={studentProfile}
            onUpdateSettings={(vis) => setStudentProfile({ ...studentProfile, profileVisibility: vis })}
          />
        )}
      </main>

      {/* Modal: Knowledge Exchange & Scheduler */}
      {selectedMatch && (
        <KnowledgeExchangeModal
          matchResult={selectedMatch}
          currentUser={studentProfile}
          onClose={() => setSelectedMatch(null)}
          onConfirmSession={handleConfirmExchangeSession}
        />
      )}

      {/* Global AI Assistant Chatbot */}
      <AiChatbot
        studentProfile={studentProfile}
        isOpen={isAiChatOpen}
        onToggle={() => setIsAiChatOpen(!isAiChatOpen)}
      />

      {/* Global Footer */}
      <footer className="px-6 py-4 border-t border-slate-800/60 bg-slate-950 text-center text-xs text-slate-500">
        PeerSolve Campus Knowledge Network &copy; 2026. Reciprocal Peer Learning Engine.
      </footer>
    </div>
  );
}
