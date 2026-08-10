import React, { useState, useEffect } from 'react';
import { SessionData, QuizQuestion, CoveredTopic } from '../../types';
import {
  Clock,
  CheckSquare,
  FileText,
  HelpCircle,
  Award,
  Star,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Send,
  CheckCircle2,
  RefreshCw,
  BookOpen,
  PlusCircle,
  Users,
  Check,
  Zap,
  Bookmark
} from 'lucide-react';

interface SessionWorkspaceProps {
  session: SessionData;
  onEndSession: (updatedSession: SessionData) => void;
  onBack: () => void;
}

export const SessionWorkspace: React.FC<SessionWorkspaceProps> = ({ session, onEndSession, onBack }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(session.durationMinutes * 60);
  const [activeTab, setActiveTab] = useState<'agenda' | 'topics' | 'notes' | 'quiz' | 'feedback'>('agenda');
  const [sharedNotes, setSharedNotes] = useState(session.notes || 'Type live collaborative notes, code snippets, or key keypoints here...');

  // Covered Topics State
  const [coveredTopics, setCoveredTopics] = useState<CoveredTopic[]>(
    session.coveredTopics || [
      {
        id: 'ct-1',
        topicName: `${session.teachSkill} Fundamentals & Basics`,
        skill: session.teachSkill,
        updatedByPeer: session.mentorName,
        status: 'mastered',
        notes: 'Covered core architecture and primary use cases.',
        updatedAt: '10 mins ago'
      },
      {
        id: 'ct-2',
        topicName: 'Practical Implementation & Syntax Patterns',
        skill: session.teachSkill,
        updatedByPeer: session.mentorName,
        status: 'covered',
        notes: 'Learner built sample code; review recommended before next week.',
        updatedAt: '5 mins ago'
      }
    ]
  );

  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicNotes, setNewTopicNotes] = useState('');
  const [newTopicStatus, setNewTopicStatus] = useState<'covered' | 'needs_revision' | 'mastered'>('covered');
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // AI Study Guide state for covered topics
  const [studyGuide, setStudyGuide] = useState<{
    summary: string;
    keyTakeaways: string[];
    revisionQuestions: { question: string; hint: string }[];
  } | null>(null);
  const [isGeneratingGuide, setIsGeneratingGuide] = useState(false);

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(session.quiz || []);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [postQuizScore, setPostQuizScore] = useState<number>(session.afterScore || 68);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);

  // Feedback State
  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [didHelp, setDidHelp] = useState<'yes' | 'partially' | 'no'>('yes');

  // Recovery Strategy state
  const [adaptationStrategy, setAdaptationStrategy] = useState<string>('');

  // Session timer ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Load Quiz via API if not present
  const handleLoadQuiz = async () => {
    setIsLoadingQuiz(true);
    try {
      const res = await fetch('/api/ai/mini-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: session.teachSkill,
          difficulty: 'Intermediate',
        }),
      });

      const data = await res.json();
      if (data.success && data.quiz?.length > 0) {
        setQuizQuestions(data.quiz);
      } else {
        setQuizQuestions([
          {
            id: 'q1',
            question: `What is the core purpose of ${session.teachSkill}?`,
            options: [
              'Builds structured, maintainable software components',
              'Deletes local disk partitions',
              'Disables web browsers',
              'Generates random numbers'
            ],
            correctIndex: 0,
            explanation: `${session.teachSkill} structures software logic effectively.`
          },
          {
            id: 'q2',
            question: `Which practice is essential when implementing ${session.teachSkill}?`,
            options: [
              'Ignoring error logs',
              'Writing modular, clean code with clear interfaces',
              'Using global mutable variables everywhere',
              'Never reviewing peer code'
            ],
            correctIndex: 1,
            explanation: 'Modular design ensures readability and scalability.'
          },
          {
            id: 'q3',
            question: `How does peer learning accelerate mastery in ${session.teachSkill}?`,
            options: [
              'By forcing students to memorize textbooks',
              'Through active verbal explanation, immediate feedback, and practical problem solving',
              'By skipping code execution',
              'By avoiding practice exercises'
            ],
            correctIndex: 1,
            explanation: 'Verbalizing concepts and solving problems in real-time builds deep understanding.'
          }
        ]);
      }
    } catch (err) {
      console.warn('Quiz API error:', err);
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  const handleSelectAnswer = (qId: string, optionIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [qId]: optionIndex,
    });
  };

  const handleSubmitQuiz = async () => {
    let correctCount = 0;
    quizQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const calculatedScore = Math.round((correctCount / (quizQuestions.length || 1)) * 100);
    setPostQuizScore(calculatedScore);
    setQuizSubmitted(true);

    // If improvement is small (e.g. before: 42%, calculated: 45%), fetch recovery strategy
    const beforeScore = session.beforeScore || 42;
    if (calculatedScore - beforeScore < 10) {
      try {
        const res = await fetch('/api/ai/adaptation-strategy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            beforeScore,
            afterScore: calculatedScore,
            teachSkill: session.teachSkill,
            feedback: feedbackComment,
          }),
        });
        const data = await res.json();
        setAdaptationStrategy(data.strategy || 'Try switching to a visual step-by-step diagram approach or practicing with additional hands-on code examples.');
      } catch (e) {
        console.warn('Strategy API fallback', e);
      }
    }
  };

  const handleAddCoveredTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;

    const newTopic: CoveredTopic = {
      id: `ct-${Date.now()}`,
      topicName: newTopicName.trim(),
      skill: session.teachSkill,
      updatedByPeer: session.learnerName || 'Peer Student',
      status: newTopicStatus,
      notes: newTopicNotes.trim() || undefined,
      updatedAt: 'Just now',
    };

    const updated = [newTopic, ...coveredTopics];
    setCoveredTopics(updated);
    setNewTopicName('');
    setNewTopicNotes('');
    setNewTopicStatus('covered');

    setSyncNotice(`Topic "${newTopic.topicName}" logged and synchronized to both ${session.mentorName} & ${session.learnerName}'s study plan!`);
    setTimeout(() => setSyncNotice(null), 4000);
  };

  const handleToggleTopicStatus = (id: string, currentStatus: 'covered' | 'needs_revision' | 'mastered') => {
    const nextStatus: 'covered' | 'needs_revision' | 'mastered' =
      currentStatus === 'covered' ? 'mastered' : currentStatus === 'mastered' ? 'needs_revision' : 'covered';

    const updated = coveredTopics.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          status: nextStatus,
          updatedByPeer: session.learnerName || session.mentorName,
          updatedAt: 'Just now',
        };
      }
      return t;
    });

    setCoveredTopics(updated);
    setSyncNotice(`Updated status to "${nextStatus.replace('_', ' ')}" for both peers!`);
    setTimeout(() => setSyncNotice(null), 3000);
  };

  const handleGenerateStudyGuide = async () => {
    setIsGeneratingGuide(true);
    try {
      const res = await fetch('/api/ai/covered-topics-study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coveredTopics,
          teachSkill: session.teachSkill,
          mentorName: session.mentorName,
          learnerName: session.learnerName,
        }),
      });

      const data = await res.json();
      if (data.success && data.studyGuide) {
        setStudyGuide(data.studyGuide);
      }
    } catch (err) {
      console.warn('Study guide generation error:', err);
    } finally {
      setIsGeneratingGuide(false);
    }
  };

  const handleFinishSession = () => {
    const beforeScore = session.beforeScore || 42;
    const gain = postQuizScore - beforeScore;

    const updatedSession: SessionData = {
      ...session,
      status: 'completed',
      coveredTopics,
      notes: sharedNotes,
      quiz: quizQuestions,
      afterScore: postQuizScore,
      learningGain: gain,
      feedback: {
        rating,
        knowledge: rating,
        explanation: rating,
        communication: rating,
        punctuality: rating,
        helpfulness: rating,
        didHelp,
        comment: feedbackComment,
      },
      adaptationStrategy,
    };

    onEndSession(updatedSession);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Session Bar */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              LIVE PEER SESSION WORKSPACE
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            {session.teachSkill} Exchange
          </h1>
          <p className="text-xs text-slate-400">
            Mentor: <strong className="text-slate-200">{session.mentorName}</strong> | Learner: <strong className="text-slate-200">{session.learnerName}</strong>
          </p>
        </div>

        {/* Live Timer Countdown */}
        <div className="flex items-center gap-4">
          <div className="p-3 px-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <Clock className="w-5 h-5 text-indigo-400" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Remaining</span>
              <span className="font-mono text-xl font-extrabold text-white">{formatTimer(secondsRemaining)}</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('feedback')}
            className="px-4 py-2.5 rounded-xl bg-red-600/80 hover:bg-red-500 text-white text-xs font-bold shadow-lg"
          >
            End Session & Review
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('agenda')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'agenda'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          Session Agenda
        </button>

        <button
          onClick={() => setActiveTab('topics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'topics'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Covered Topics ({coveredTopics.length})
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'notes'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          Shared Scratchpad
        </button>

        <button
          onClick={() => {
            setActiveTab('quiz');
            if (quizQuestions.length === 0) handleLoadQuiz();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'quiz'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          AI Mini Quiz
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'feedback'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          Feedback & Learning Gain
        </button>
      </div>

      {/* TAB 1: AGENDA */}
      {activeTab === 'agenda' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            AI Session Timeblock Agenda
          </h2>

          <div className="space-y-3">
            {session.agenda?.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold">
                      {step.timeOffset} Mins
                    </span>
                    <h3 className="font-bold text-white text-sm">{step.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400">{step.description}</p>
                </div>

                <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                  {step.speaker === 'both' ? 'Both Peers' : step.speaker === 'mentor' ? `${session.mentorName}` : `${session.learnerName}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: COVERED TOPICS (PEER MUTUAL STUDY LOG) */}
      {activeTab === 'topics' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-lg">
          {/* Header & Sync Indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Peer Shared Covered Topics</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-bold uppercase">
                  Bi-Directional Peer Sync
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Log or update topics covered during this peer session. Changes automatically reflect in both <strong className="text-slate-200">{session.mentorName}</strong> & <strong className="text-slate-200">{session.learnerName}</strong>'s study plans.
              </p>
            </div>

            <button
              onClick={handleGenerateStudyGuide}
              disabled={isGeneratingGuide || coveredTopics.length === 0}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 shrink-0"
            >
              <Zap className={`w-4 h-4 ${isGeneratingGuide ? 'animate-bounce' : 'text-amber-300'}`} />
              {isGeneratingGuide ? 'Generating AI Guide...' : 'Generate AI Study Guide'}
            </button>
          </div>

          {/* Sync Toast Banner */}
          {syncNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-semibold flex items-center gap-2.5 animate-pulse">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{syncNotice}</span>
            </div>
          )}

          {/* Add New Topic Form */}
          <form onSubmit={handleAddCoveredTopic} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-indigo-400" />
              Log Newly Covered Topic
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2 space-y-1">
                <input
                  type="text"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  placeholder="Topic Name (e.g., React Custom Hooks & State Lifting)"
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <select
                  value={newTopicStatus}
                  onChange={(e) => setNewTopicStatus(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="covered">Covered (Needs Practice)</option>
                  <option value="mastered">Mastered by Both Peers</option>
                  <option value="needs_revision">Needs Further Revision</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={newTopicNotes}
                onChange={(e) => setNewTopicNotes(e.target.value)}
                placeholder="Optional key takeaway note for peer study (e.g. Mastered useState, review useEffect cleanup)"
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              />

              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30"
              >
                <PlusCircle className="w-4 h-4" />
                Log & Share Topic
              </button>
            </div>
          </form>

          {/* List of Logged Covered Topics */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-slate-400" />
              Topics Covered in Session ({coveredTopics.length})
            </h3>

            {coveredTopics.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-950/50 rounded-xl border border-slate-800">
                No topics logged yet. Use the form above to record topics covered during your session!
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {coveredTopics.map((topic) => {
                  const isMastered = topic.status === 'mastered';
                  const isCovered = topic.status === 'covered';
                  const isRevision = topic.status === 'needs_revision';

                  return (
                    <div
                      key={topic.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:border-slate-700"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <h4 className="font-bold text-white text-sm">{topic.topicName}</h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                              isMastered
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : isCovered
                                ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}
                          >
                            {isMastered && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                            {isCovered && <Check className="w-3 h-3 text-indigo-300" />}
                            {isRevision && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                            {topic.status.replace('_', ' ')}
                          </span>
                        </div>

                        {topic.notes && (
                          <p className="text-xs text-slate-300 pl-0.5">
                            📝 <strong className="text-slate-400 font-semibold">Note:</strong> {topic.notes}
                          </p>
                        )}

                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-500" />
                          Logged by <strong className="text-slate-400">{topic.updatedByPeer}</strong> • {topic.updatedAt}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleToggleTopicStatus(topic.id, topic.status)}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
                          title="Click to cycle status: Covered → Mastered → Needs Revision"
                        >
                          <RefreshCw className="w-3 h-3 text-indigo-400" />
                          Change Status
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* AI Generated Study Guide View */}
          {studyGuide && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/40 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <h3 className="text-base font-extrabold text-white">
                    AI Shared Peer Revision Guide
                  </h3>
                </div>
                <span className="text-[10px] text-indigo-300 font-mono font-bold uppercase">
                  Generated for Both Peers
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 leading-relaxed">
                  <strong className="text-indigo-400 block mb-1 uppercase text-[10px] tracking-wider">Session Synthesis</strong>
                  {studyGuide.summary}
                </div>

                <div className="space-y-2">
                  <strong className="text-emerald-400 block uppercase text-[10px] tracking-wider font-bold">
                    Key Revision Takeaways
                  </strong>
                  <ul className="space-y-1.5 pl-2">
                    {studyGuide.keyTakeaways?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-300 text-xs">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {studyGuide.revisionQuestions?.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <strong className="text-amber-300 block uppercase text-[10px] tracking-wider font-bold">
                      Interactive Peer Self-Test Questions
                    </strong>
                    <div className="grid grid-cols-1 gap-2">
                      {studyGuide.revisionQuestions.map((rq, qIdx) => (
                        <div key={qIdx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                          <p className="font-bold text-white">Q{qIdx + 1}: {rq.question}</p>
                          <p className="text-[11px] text-indigo-300 font-medium">💡 Hint: {rq.hint}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SHARED SCRATCHPAD */}
      {activeTab === 'notes' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              Live Collaborative Notes & Code Scratchpad
            </h2>
            <span className="text-xs text-slate-400">Syncs automatically with both peers</span>
          </div>

          <textarea
            value={sharedNotes}
            onChange={(e) => setSharedNotes(e.target.value)}
            rows={12}
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm font-mono focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
            placeholder="Type key bullet points, code snippets, or concepts discussed in the session..."
          />
        </div>
      )}

      {/* TAB 3: AI MINI QUIZ */}
      {activeTab === 'quiz' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                AI Post-Exchange Comprehension Check
              </h2>
              <p className="text-xs text-slate-400">3 quick questions to evaluate what you learned today.</p>
            </div>

            <button
              onClick={handleLoadQuiz}
              disabled={isLoadingQuiz}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingQuiz ? 'animate-spin' : ''}`} />
              Regenerate Quiz
            </button>
          </div>

          {isLoadingQuiz ? (
            <div className="p-8 text-center text-xs text-slate-400">Generating customized quiz questions...</div>
          ) : (
            <div className="space-y-6">
              {quizQuestions.map((q, qIdx) => (
                <div key={q.id} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-white">
                    {qIdx + 1}. {q.question}
                  </h3>

                  <div className="space-y-2">
                    {q.options.map((option, oIdx) => {
                      const isSelected = selectedAnswers[q.id] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          disabled={quizSubmitted}
                          onClick={() => handleSelectAnswer(q.id, oIdx)}
                          className={`w-full p-3 rounded-xl text-xs text-left font-medium transition-all border flex items-center justify-between ${
                            isSelected
                              ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span>{option}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-3 rounded-lg bg-slate-900 text-xs text-indigo-300 border border-indigo-500/20 mt-2">
                      💡 <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}

              {!quizSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30"
                >
                  Submit Quiz & Calculate Learning Gain
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-center space-y-1">
                  <span className="text-xs uppercase font-bold block">Assessment Complete</span>
                  <span className="text-2xl font-extrabold text-white block">{postQuizScore}%</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: FEEDBACK & LEARNING GAIN */}
      {activeTab === 'feedback' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-lg">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            Learning Gain & Peer Review
          </h2>

          {/* Before / After Gain Box */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-xl bg-slate-900">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">BEFORE SESSION</span>
              <span className="text-2xl font-bold text-slate-300">{session.beforeScore || 42}%</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">AFTER SESSION</span>
              <span className="text-2xl font-bold text-emerald-400">{postQuizScore}%</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-600/20 border border-emerald-500/30">
              <span className="text-[10px] text-emerald-300 uppercase block font-semibold">LEARNING GAIN</span>
              <span className="text-2xl font-extrabold text-white">
                +{postQuizScore - (session.beforeScore || 42)} POINTS
              </span>
            </div>
          </div>

          {/* Failed Session Recovery Adaptation Strategy Notice if improvement is minimal */}
          {postQuizScore - (session.beforeScore || 42) < 10 && (
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Limited Score Gain Detected — AI Strategy Adaptation</span>
              </div>
              <p className="leading-relaxed">
                {adaptationStrategy || 'We recommend switching to a visual step-by-step diagram approach or practicing with additional hands-on code examples in the next session.'}
              </p>
            </div>
          )}

          {/* Peer Review Rating */}
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                Rate {session.mentorName}'s Explanation & Helpfulness
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setRating(s)}
                    className="p-2 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-6 h-6 ${s <= rating ? 'fill-amber-400' : 'text-slate-700'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Did this session help you?</label>
              <div className="flex gap-2">
                {(['yes', 'partially', 'no'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setDidHelp(opt)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                      didHelp === opt
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Optional Feedback Comment</label>
              <textarea
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="Rahul explained state management super clearly with real-world examples!"
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                rows={3}
              />
            </div>

            <button
              onClick={handleFinishSession}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-emerald-500/20"
            >
              SAVE REVIEW & UPDATE SKILL PASSPORT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
