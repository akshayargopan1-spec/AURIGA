import React, { useState, useEffect } from 'react';
import { StudentProfile, QuizQuestion, SkillBaseline } from '../../types';
import {
  Brain,
  ShieldAlert,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  BookOpen,
  ArrowRight,
  Maximize2,
  RefreshCw,
  Lock,
  Award,
  Zap,
  ShieldCheck
} from 'lucide-react';

interface EntryAssessmentProps {
  studentProfile: StudentProfile;
  onCompleteAssessment: (baseline: SkillBaseline) => void;
  onSkipOrCancel?: () => void;
}

export const EntryAssessment: React.FC<EntryAssessmentProps> = ({
  studentProfile,
  onCompleteAssessment,
  onSkipOrCancel,
}) => {
  // State
  const [loading, setLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [shortAnswers, setShortAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(60); // 60s per question
  const [tabSwitchWarnings, setTabSwitchWarnings] = useState(0);
  const [fullscreenExits, setFullscreenExits] = useState(0);
  const [showIntegrityAlert, setShowIntegrityAlert] = useState(false);
  const [integrityAlertMsg, setIntegrityAlertMsg] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [calculatedBaseline, setCalculatedBaseline] = useState<SkillBaseline | null>(null);

  // Fetch or generate questions on mount
  useEffect(() => {
    fetchQuestions();
  }, [studentProfile]);

  // Anti-cheating & Focus detection (Visibility change)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isCompleted && hasStarted) {
        setTabSwitchWarnings(prev => {
          const updated = prev + 1;
          setIntegrityAlertMsg(`Focus Warning (${updated}/3): Tab switch or app blur detected. Integrity monitoring is active.`);
          setShowIntegrityAlert(true);
          return updated;
        });
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isCompleted, hasStarted]);

  // Fullscreen Exit Event Listener Handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      setIsFullscreen(isCurrentlyFullscreen);

      // If student manually exits fullscreen while assessment is in progress
      if (!isCurrentlyFullscreen && hasStarted && !isCompleted) {
        console.warn(`[Assessment Integrity] Student manually exited fullscreen at ${new Date().toISOString()}`);
        setFullscreenExits(prev => prev + 1);
        setTabSwitchWarnings(prev => {
          const updated = prev + 1;
          setIntegrityAlertMsg(`Fullscreen Exit Detected: You manually exited fullscreen mode. This event has been logged.`);
          setShowIntegrityAlert(true);
          return updated;
        });
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [hasStarted, isCompleted]);

  // Question countdown timer
  useEffect(() => {
    if (loading || isCompleted || !hasStarted) return;

    if (timeLeft <= 0) {
      handleNextQuestion();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, isCompleted, hasStarted, currentIndex]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const teachSkills = studentProfile.canTeach?.map(s => s.skill) || [];
      const learnSkills = studentProfile.wantToLearn?.map(s => s.skill) || [];

      const res = await fetch('/api/ai/entry-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course: studentProfile.course,
          branch: studentProfile.branch,
          semester: studentProfile.semester,
          teachSkills,
          learnSkills,
        })
      });

      const data = await res.json();

      if (data.success && data.questions?.length > 0) {
        setQuestions(data.questions);
      } else {
        // Fallback questions
        setQuestions(getFallbackQuestions());
      }
    } catch (err) {
      setQuestions(getFallbackQuestions());
    } finally {
      setLoading(false);
      setTimeLeft(60);
    }
  };

  const getFallbackQuestions = (): QuizQuestion[] => [
    {
      id: 'q1',
      category: studentProfile.canTeach?.[0]?.skill || 'Python',
      difficulty: 'Easy',
      type: 'mcq',
      question: `Which of the following best describes the primary benefit of modular code structure in ${studentProfile.canTeach?.[0]?.skill || 'Python'}?`,
      options: [
        'Improves readability, reusability, and unit testability across campus projects',
        'Directly increases CPU clock frequency on client hardware',
        'Replaces web servers with local file systems',
        'Disables runtime error logging'
      ],
      correctIndex: 0,
      explanation: 'Modular design isolates logic into clear, testable, and reusable blocks.'
    },
    {
      id: 'q2',
      category: studentProfile.wantToLearn?.[0]?.skill || 'React',
      difficulty: 'Medium',
      type: 'mcq',
      question: `When building a scalable UI component for ${studentProfile.wantToLearn?.[0]?.skill || 'React'}, what is the recommended state management pattern?`,
      options: [
        'Mutating global window variables directly inside render loops',
        'Keeping state local to where it is needed and passing props cleanly or using context/hooks',
        'Creating infinite useEffect listeners without dependency arrays',
        'Storing all state as unescaped DOM string innerHTML'
      ],
      correctIndex: 1,
      explanation: 'React uses unidirectional data flow with hooks and local state to prevent unnecessary re-renders.'
    },
    {
      id: 'q3',
      category: 'Database Management (DBMS)',
      difficulty: 'Hard',
      type: 'scenario',
      question: `[Scenario] A peer-matching platform query experiences slow response times when searching 10,000 student records. Which optimization provides the highest impact?`,
      options: [
        'Adding B-Tree database indexes on frequently queried fields (e.g., skills, slots)',
        'Deleting all past session history records from storage',
        'Converting all integer fields into multi-line text blobs',
        'Removing primary key constraints'
      ],
      correctIndex: 0,
      explanation: 'Indexes drastically reduce query search time from O(N) linear scans to O(log N) lookup.'
    },
    {
      id: 'q4',
      category: 'Data Structures & Logic',
      difficulty: 'Hard',
      type: 'problem_solving',
      question: `[Problem Solving] You need to fetch and order reciprocal peer matches in real time. Which data structure ensures O(log N) insertion and extraction?`,
      options: [
        'Max-Heap or Priority Queue based on match score',
        'Unsorted Singly Linked List',
        'Static Array without sorting',
        'Nested CSV file reader'
      ],
      correctIndex: 0,
      explanation: 'Priority queues maintain dynamic order efficiently with binary heap implementations.'
    }
  ];

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }));
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(60);
    } else {
      finishAssessment();
    }
  };

  const handleStartAssessment = async (requestFullscreen: boolean = false) => {
    if (requestFullscreen) {
      try {
        const doc = document as any;
        const docEl = document.documentElement as any;
        const reqFn = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;
        if (reqFn) {
          await reqFn.call(docEl);
          setIsFullscreen(true);
        }
      } catch (err) {
        console.warn('Fullscreen request failed or denied:', err);
      }
    }
    setHasStarted(true);
    setTimeLeft(60);
  };

  const toggleFullscreenMode = () => {
    const doc = document as any;
    const docEl = document.documentElement as any;

    if (!doc.fullscreenElement && !doc.webkitFullscreenElement && !doc.mozFullScreenElement && !doc.msFullscreenElement) {
      const req = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;
      if (req) {
        req.call(docEl).then(() => {
          setIsFullscreen(true);
        }).catch((err: any) => {
          console.warn('Fullscreen toggle failed:', err);
        });
      }
    } else {
      const exit = doc.exitFullscreen || doc.webkitExitFullscreen || doc.mozCancelFullScreen || doc.msExitFullscreen;
      if (exit) {
        exit.call(doc).catch((err: any) => {
          console.warn('Exit fullscreen failed:', err);
        });
      }
      setIsFullscreen(false);
    }
  };

  const finishAssessment = () => {
    // Calculate Score
    let correctCount = 0;
    const topicScores: Record<string, number> = {};

    questions.forEach((q, idx) => {
      const userAns = selectedAnswers[idx];
      const isCorrect = userAns === q.correctIndex;
      if (isCorrect) correctCount++;

      const cat = q.category || 'General';
      const weight = isCorrect ? 85 : 40;
      topicScores[cat] = Math.max(topicScores[cat] || 0, weight);
    });

    // Ensure all target skills are mapped
    studentProfile.canTeach.forEach(s => {
      if (!topicScores[s.skill]) topicScores[s.skill] = 75;
    });
    studentProfile.wantToLearn.forEach(l => {
      if (!topicScores[l.skill]) topicScores[l.skill] = 45;
    });

    const accuracyPct = Math.round((correctCount / Math.max(questions.length, 1)) * 100);
    const integrityPct = Math.max(100 - tabSwitchWarnings * 15, 40);
    const needsFoundation = accuracyPct < 50;

    const baseline: SkillBaseline = {
      completedAt: new Date().toISOString(),
      topicScores,
      overallLevel: accuracyPct >= 80 ? 'Advanced Peer Mentor' : accuracyPct >= 50 ? 'Intermediate Explorer' : 'Foundation Learner',
      needsFoundationPath: needsFoundation,
      recommendedTopics: needsFoundation
        ? ['Core Syntax & Logic Basics', 'Guided Peer Sessions', 'Concept Refresher']
        : ['Advanced Peer Exchanges', 'Project Mentorship', 'Knowledge Sharing'],
      integrityScore: integrityPct,
      tabSwitchCount: tabSwitchWarnings,
    };

    setCalculatedBaseline(baseline);
    setIsCompleted(true);
  };

  const currentQ = questions[currentIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
        <div className="p-8 max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center animate-spin">
            <RefreshCw className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Generating Adaptive Assessment</h2>
          <p className="text-xs text-slate-400">
            Evaluating your course ({studentProfile.course}), branch ({studentProfile.branch}), and registered skills to build your custom baseline test...
          </p>
        </div>
      </div>
    );
  }

  // Introduction Screen (Before Assessment Starts)
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-10 px-4 sm:px-6 select-none">
        <div className="max-w-2xl mx-auto w-full my-auto space-y-6">
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
            {/* Header Badge */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-white tracking-tight">
                    Adaptive Peer Assessment
                  </h1>
                  <p className="text-xs text-slate-400">
                    {studentProfile.course} • {studentProfile.branch} • {studentProfile.semester}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                Proctored Mode
              </span>
            </div>

            {/* Intro Copy */}
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-white">Welcome, {studentProfile.name}!</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                This adaptive assessment evaluates your foundational knowledge across your registered skills. Your results generate your custom PeerSolve Skill Baseline to unlock tailored peer mentor pairings and personalized study paths.
              </p>
            </div>

            {/* Assessment Rules */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                  <BookOpen className="w-4 h-4" />
                  <span>{questions.length} Questions</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  60 seconds limit per question with dynamic difficulty adjustment.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <Clock className="w-4 h-4" />
                  <span>Focus Monitoring</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Tab switches & manually exiting fullscreen are logged to preserve test integrity.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Peer Matching</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  No fail state! Used exclusively to structure your optimal peer exchange.
                </p>
              </div>
            </div>

            {/* Fullscreen Action Button */}
            <div className="pt-4 space-y-3 border-t border-slate-800">
              <button
                onClick={() => handleStartAssessment(true)}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/25 flex items-center justify-between gap-3 transition-all transform hover:scale-[1.01]"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Maximize2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="leading-tight text-white font-extrabold">Start Fullscreen Assessment</div>
                    <div className="text-[11px] text-indigo-100 font-normal">Requests browser Fullscreen API & activates exit monitoring</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-white shrink-0" />
              </button>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => handleStartAssessment(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Start in Standard Window Mode
                </button>

                {onSkipOrCancel && (
                  <button
                    onClick={onSkipOrCancel}
                    className="text-xs text-slate-400 hover:text-white underline"
                  >
                    Skip Assessment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="p-4 text-center text-[11px] text-slate-500">
          PeerSolve Integrity Shield • Proctored Assessment Environment
        </footer>
      </div>
    );
  }

  // Result View
  if (isCompleted && calculatedBaseline) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Top Banner */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-950 border border-indigo-500/30 text-center space-y-4 relative overflow-hidden shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Assessment Complete
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Your PeerSolve Skill Baseline
            </h1>
            <p className="text-xs text-slate-300 max-w-lg mx-auto">
              This baseline helps us pair you with peers who match your exact learning speed and teaching level.
            </p>

            {/* Overall Level Badge */}
            <div className="pt-2 flex justify-center">
              <div className="px-5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700 text-emerald-400 font-extrabold text-sm flex items-center gap-2 shadow-lg">
                <Award className="w-5 h-5 text-emerald-400" />
                <span>Level Assigned: {calculatedBaseline.overallLevel}</span>
              </div>
            </div>
          </div>

          {/* Skill Breakdown Cards */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              Your Initial Skill Profile Baseline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {Object.entries(calculatedBaseline.topicScores).map(([topic, rawScore]) => {
                const score = Number(rawScore);
                return (
                  <div key={topic} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-white">{topic}</span>
                      <span className={score >= 70 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-indigo-400'}>
                        {score}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          score >= 70 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Non-Exclusionary Guidance / Foundation Path */}
          {calculatedBaseline.needsFoundationPath ? (
            <div className="p-6 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-3">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <span>Recommended Foundation Path Created</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                PeerSolve never rejects students! Based on your answers, we have structured a gentle <strong>Foundation Path</strong> with step-by-step visual topic reviews and patient peer mentors to help you build confidence rapidly.
              </p>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Verified Peer Mentor Readiness</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Great job! Your baseline qualifies you to mentor fellow campus students and unlock reciprocal peer matching with high-scoring mentors.
              </p>
            </div>
          )}

          {/* Integrity Score Notice */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              Assessment Integrity Score: <strong className="text-white">{calculatedBaseline.integrityScore}%</strong>
            </span>
            <span className="text-[11px] text-slate-500 flex items-center gap-3">
              <span>Tab switches: {calculatedBaseline.tabSwitchCount}</span>
              {fullscreenExits > 0 && <span className="text-amber-400 font-semibold">Fullscreen exits: {fullscreenExits}</span>}
            </span>
          </div>

          {/* Proceed Button */}
          <div className="pt-2 text-center">
            <button
              onClick={() => onCompleteAssessment(calculatedBaseline)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 mx-auto"
            >
              <span>Save Skill Baseline & Open Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between select-none" onCopy={e => e.preventDefault()} onContextMenu={e => e.preventDefault()}>
      {/* Integrity Warning Overlay */}
      {showIntegrityAlert && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-lg w-full bg-red-950/95 border border-red-500 text-red-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between text-xs animate-bounce">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>
              <strong>Integrity Alert:</strong> {integrityAlertMsg || `Focus Warning (${tabSwitchWarnings}/3): Tab switches are monitored.`}
            </span>
          </div>
          <button onClick={() => setShowIntegrityAlert(false)} className="text-xs text-red-400 hover:text-white font-bold ml-2 shrink-0">
            Dismiss
          </button>
        </div>
      )}

      {/* Assessment Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-white text-base tracking-tight">
                🧠 DISCOVER YOUR LEARNING LEVEL
              </h1>
              <p className="text-[11px] text-slate-400">
                {studentProfile.course} | {studentProfile.branch} | {studentProfile.semester}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Integrity Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-semibold">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              Integrity Monitor Active
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreenMode}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
              title="Toggle Fullscreen Mode"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {onSkipOrCancel && (
              <button onClick={onSkipOrCancel} className="text-xs text-slate-400 hover:text-white underline">
                Exit
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Question Canvas */}
      <main className="max-w-3xl mx-auto w-full px-4 py-8 flex-1 flex flex-col justify-center">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Progress & Timer Row */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                {currentQ.difficulty || 'Adaptive'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {currentQ.category}
              </span>
            </div>

            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold text-xs ${
              timeLeft <= 15 ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-slate-950 text-slate-300 border border-slate-800'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{timeLeft}s remaining</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            {currentQ.type && currentQ.type !== 'mcq' && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 inline-block">
                {currentQ.type === 'scenario' ? 'Scenario-Based Question' : 'Problem-Solving Challenge'}
              </span>
            )}
            <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentIndex] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-2xl text-left text-xs sm:text-sm transition-all border flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-100 shadow-md shadow-indigo-600/10'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span>{option}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Dynamic variants active
            </span>

            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswers[currentIndex] === undefined}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <span>{currentIndex === questions.length - 1 ? 'Finish & Generate Baseline' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer Notice */}
      <footer className="p-4 text-center text-[11px] text-slate-500 border-t border-slate-800/60">
        PeerSolve Integrity Shield • Secure Randomization Engine
      </footer>
    </div>
  );
};
