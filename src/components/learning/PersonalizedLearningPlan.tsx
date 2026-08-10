import React, { useState, useEffect } from 'react';
import { StudentProfile, PersonalizedPlan, LearningMilestone } from '../../types';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  BookOpen,
  Target,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Users,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface PersonalizedLearningPlanProps {
  studentProfile: StudentProfile;
  onNavigateToPeerMatch?: (skillNeeded: string) => void;
}

export const PersonalizedLearningPlan: React.FC<PersonalizedLearningPlanProps> = ({
  studentProfile,
  onNavigateToPeerMatch,
}) => {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<PersonalizedPlan | null>(null);

  useEffect(() => {
    fetchPlan();
  }, [studentProfile]);

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/learning-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: studentProfile.name,
          branch: studentProfile.branch,
          baselineScores: studentProfile.skillBaseline?.topicScores || { Python: 70, DBMS: 60, React: 40 },
          learnGoals: studentProfile.wantToLearn || []
        })
      });

      const data = await res.json();
      if (data.success && data.plan) {
        setPlan(data.plan);
      } else {
        setPlan(getFallbackPlan());
      }
    } catch (err) {
      setPlan(getFallbackPlan());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackPlan = (): PersonalizedPlan => ({
    studentUid: studentProfile.uid,
    createdAt: new Date().toISOString().split('T')[0],
    targetGoal: `Master ${studentProfile.wantToLearn?.[0]?.skill || 'Full Stack Engineering'} for ${studentProfile.branch} Career Goals`,
    milestones: [
      {
        id: 'm1',
        title: 'Core Syntax & Architectural Fundamentals',
        skill: studentProfile.wantToLearn?.[0]?.skill || 'React',
        estimatedHours: 8,
        topics: ['JSX Syntax & Virtual DOM', 'Component Props & State', 'Basic Hooks (useState, useEffect)'],
        status: 'in_progress',
        recommendedMentorRole: 'Peer Mentor with 80%+ Assessment Score',
        practiceExercise: 'Create a reusable multi-step form with client validation.'
      },
      {
        id: 'm2',
        title: 'Practical Application & State Management',
        skill: studentProfile.wantToLearn?.[0]?.skill || 'React',
        estimatedHours: 12,
        topics: ['Custom Custom Hooks', 'Context API & Global State', 'API Proxy & Fetching'],
        status: 'upcoming',
        recommendedMentorRole: 'Active Peer Exchange Mentor',
        practiceExercise: 'Build an interactive peer dashboard component.'
      },
      {
        id: 'm3',
        title: 'Reciprocal Peer Teaching & Practice Mock Session',
        skill: studentProfile.canTeach?.[0]?.skill || 'Python',
        estimatedHours: 6,
        topics: ['Teaching Core Concepts', 'Live Code Walkthrough', 'Constructive Feedback'],
        status: 'upcoming',
        recommendedMentorRole: 'Peer Mentee searching for beginner guidance',
        practiceExercise: 'Lead a 30-minute peer teaching session.'
      }
    ],
    weakAreas: studentProfile.wantToLearn?.map(l => l.skill) || ['React'],
    strengthAreas: studentProfile.canTeach?.map(t => t.skill) || ['Python'],
    foundationPath: {
      title: 'Recommended Foundation Refresher',
      description: 'Quick step-by-step module designed to clear prerequisite doubts before starting advanced sessions.',
      prerequisiteTopics: ['Basic Logic Flow', 'Functional Code Components', 'Debugging Fundamentals']
    }
  });

  const handleToggleMilestone = (milestoneId: string) => {
    if (!plan) return;
    const updatedMilestones = plan.milestones.map(m => {
      if (m.id === milestoneId) {
        const nextStatus = m.status === 'completed' ? 'in_progress' : m.status === 'in_progress' ? 'completed' : 'in_progress';
        return { ...m, status: nextStatus as any };
      }
      return m;
    });
    setPlan({ ...plan, milestones: updatedMilestones });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col items-center justify-center">
        <div className="p-8 max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Synthesizing Your Learning Roadmap</h2>
          <p className="text-xs text-slate-400">
            Analyzing your baseline assessment and learning goals to map out milestone objectives...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            AI Personalized Learning Plan
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {plan?.targetGoal}
          </h1>
          <p className="text-xs text-slate-300">
            Tailored specifically for {studentProfile.name} based on your baseline assessment scores and semester milestones.
          </p>
        </div>

        <button
          onClick={fetchPlan}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 shrink-0 border border-slate-700"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Regenerate Roadmap
        </button>
      </div>

      {/* Strength vs Growth Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Award className="w-4 h-4" />
            <span>Verified Strengths</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {plan?.strengthAreas?.map(skill => (
              <span key={skill} className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-semibold">
                ✓ {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <Target className="w-4 h-4" />
            <span>Target Growth Focus Areas</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {plan?.weakAreas?.map(skill => (
              <span key={skill} className="px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
                🎯 {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Foundation Path (If Recommended) */}
      {plan?.foundationPath && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/30 to-indigo-950/30 border border-amber-500/30 space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span>{plan.foundationPath.title}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {plan.foundationPath.description}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {plan.foundationPath.prerequisiteTopics.map((topic, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-200 border border-amber-500/20 text-[11px] font-medium">
                • {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Milestones Roadmap Timeline */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          Milestone Progression Roadmap
        </h2>

        <div className="space-y-4">
          {plan?.milestones.map((milestone, idx) => {
            const isCompleted = milestone.status === 'completed';
            const isInProgress = milestone.status === 'in_progress';

            return (
              <div
                key={milestone.id}
                className={`p-6 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-slate-900/60 border-emerald-500/30'
                    : isInProgress
                    ? 'bg-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-500/5'
                    : 'bg-slate-900/40 border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                        0{idx + 1}
                      </span>
                      <h3 className="font-extrabold text-white text-base">{milestone.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isCompleted
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : isInProgress
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {milestone.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Topics List */}
                    <div className="flex flex-wrap gap-2 pt-1 pl-10">
                      {milestone.topics.map((t, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Practice Exercise */}
                    {milestone.practiceExercise && (
                      <p className="text-xs text-indigo-300 pl-10 pt-1 font-medium">
                        💡 Hands-on Exercise: {milestone.practiceExercise}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      Est. {milestone.estimatedHours} Hours
                    </span>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => handleToggleMilestone(milestone.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isCompleted ? 'Completed' : 'Mark Complete'}
                      </button>

                      {onNavigateToPeerMatch && (
                        <button
                          onClick={() => onNavigateToPeerMatch(milestone.skill)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-indigo-600/20"
                        >
                          <Users className="w-3.5 h-3.5" />
                          Find Peer
                        </button>
                      )}
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
