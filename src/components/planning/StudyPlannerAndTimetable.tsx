import React, { useState, useEffect } from 'react';
import { StudentProfile, DailyStudyTask, StudyTimetable } from '../../types';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Plus,
  Heart,
  Smile,
  ShieldCheck,
  Star,
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface StudyPlannerAndTimetableProps {
  studentProfile: StudentProfile;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const StudyPlannerAndTimetable: React.FC<StudyPlannerAndTimetableProps> = ({
  studentProfile,
}) => {
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState<string>('Monday');
  const [weeklySchedule, setWeeklySchedule] = useState<Record<string, DailyStudyTask[]>>({});
  const [examDeadlines, setExamDeadlines] = useState([
    { title: 'Mid-Semester Exam', date: 'In 12 Days', subject: 'Data Structures & DBMS' },
    { title: 'Peer Exchange Assessment', date: 'In 5 Days', subject: 'Python Fundamentals' }
  ]);
  const [rescheduleMessage, setRescheduleMessage] = useState<string | null>(null);
  const [reschedulingTask, setReschedulingTask] = useState<DailyStudyTask | null>(null);
  const [showConfidenceModal, setShowConfidenceModal] = useState<DailyStudyTask | null>(null);
  const [confidenceInput, setConfidenceInput] = useState<number>(4);

  useEffect(() => {
    fetchTimetable();
  }, [studentProfile]);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/study-timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          availableDays: studentProfile.availableDays,
          availableSlots: studentProfile.availableSlots,
          targetSubjects: [
            ...(studentProfile.canTeach?.map(s => s.skill) || []),
            ...(studentProfile.wantToLearn?.map(s => s.skill) || [])
          ],
          upcomingExams: examDeadlines
        })
      });

      const data = await res.json();
      if (data.success && data.weeklySchedule) {
        setWeeklySchedule(data.weeklySchedule);
      } else {
        setWeeklySchedule(getFallbackSchedule());
      }
    } catch (err) {
      setWeeklySchedule(getFallbackSchedule());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackSchedule = (): Record<string, DailyStudyTask[]> => ({
    Monday: [
      { id: 't1', timeSlot: '7:00 PM – 8:00 PM', topic: 'Python Logic & Advanced Lists', skill: 'Python', type: 'concept', completed: true, confidenceRating: 5 },
      { id: 't2', timeSlot: '8:00 PM – 8:30 PM', topic: 'Quick Practice Quiz', skill: 'Python', type: 'practice', completed: true, confidenceRating: 4 }
    ],
    Tuesday: [
      { id: 't3', timeSlot: '6:00 PM – 7:00 PM', topic: 'DBMS Schema Normalization', skill: 'DBMS', type: 'concept', completed: false }
    ],
    Wednesday: [
      { id: 't4', timeSlot: '7:00 PM – 8:00 PM', topic: 'React Props & Hooks Peer Session', skill: 'React', type: 'peer_session', completed: false }
    ],
    Thursday: [
      { id: 't5', timeSlot: '8:00 PM – 9:00 PM', topic: 'Binary Search & Tree Traversal', skill: 'Data Structures', type: 'review', completed: false }
    ],
    Friday: [
      { id: 't6', timeSlot: '7:00 PM – 8:00 PM', topic: 'Reciprocal Python Peer Exchange', skill: 'Python', type: 'peer_session', completed: false }
    ],
    Saturday: [
      { id: 't7', timeSlot: '10:00 AM – 11:30 AM', topic: 'Weekend Coding Practice', skill: 'Multiple', type: 'practice', completed: false }
    ],
    Sunday: [
      { id: 't8', timeSlot: '4:00 PM – 5:00 PM', topic: 'Weekly Progress & Passport Review', skill: 'Planning', type: 'review', completed: false }
    ]
  });

  const handleToggleTask = (task: DailyStudyTask) => {
    if (!task.completed) {
      // Prompt confidence rating modal
      setShowConfidenceModal(task);
    } else {
      // Uncheck
      const updated = (weeklySchedule[activeDay] || []).map(t =>
        t.id === task.id ? { ...t, completed: false, confidenceRating: undefined } : t
      );
      setWeeklySchedule({ ...weeklySchedule, [activeDay]: updated });
    }
  };

  const handleConfirmConfidence = () => {
    if (!showConfidenceModal) return;
    const updated = (weeklySchedule[activeDay] || []).map(t =>
      t.id === showConfidenceModal.id ? { ...t, completed: true, confidenceRating: confidenceInput } : t
    );
    setWeeklySchedule({ ...weeklySchedule, [activeDay]: updated });
    setShowConfidenceModal(null);
  };

  // "I Didn't Study" Support Action
  const handleDidNotStudy = async (task: DailyStudyTask) => {
    setReschedulingTask(task);
    try {
      const res = await fetch('/api/ai/reschedule-missed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missedTopic: task.topic,
          currentSchedule: weeklySchedule
        })
      });

      const data = await res.json();
      const msg = data.supportMessage || `No problem! We rescheduled "${task.topic}" to Saturday morning cleanly.`;

      // Move task to Saturday or Sunday
      const remainingCurrentDay = (weeklySchedule[activeDay] || []).filter(t => t.id !== task.id);
      const satTasks = weeklySchedule['Saturday'] || [];
      const newTask: DailyStudyTask = {
        ...task,
        id: `t-rescheduled-${Date.now()}`,
        timeSlot: '11:30 AM – 12:30 PM (Rescheduled)',
        completed: false
      };

      setWeeklySchedule({
        ...weeklySchedule,
        [activeDay]: remainingCurrentDay,
        Saturday: [...satTasks, newTask]
      });

      setRescheduleMessage(msg);
    } catch (err) {
      setRescheduleMessage(`No worries! Shifting "${task.topic}" to your upcoming open slot on Saturday.`);
    } finally {
      setReschedulingTask(null);
    }
  };

  const currentTasks = weeklySchedule[activeDay] || [];
  const completedCount = currentTasks.filter(t => t.completed).length;
  const progressPct = currentTasks.length > 0 ? Math.round((completedCount / currentTasks.length) * 100) : 0;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col items-center justify-center">
        <div className="p-8 max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Generating AI Study Timetable</h2>
          <p className="text-xs text-slate-400">
            Balancing your available time slots ({studentProfile.availableSlots?.[0] || '7-8 PM'}) with upcoming exam deadlines...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            AI Stress-Free Study Planner
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Your Weekly Study Schedule & Routine
          </h1>
          <p className="text-xs text-slate-300">
            Personalized study pacing that automatically adapts around your exams, available days, and peer sessions.
          </p>
        </div>

        <button
          onClick={fetchTimetable}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shrink-0 shadow-lg shadow-indigo-600/20"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Regenerate Schedule
        </button>
      </div>

      {/* Empathetic Reschedule Support Message Banner */}
      {rescheduleMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 text-xs flex items-center justify-between shadow-xl animate-fade-in">
          <div className="flex items-center gap-3">
            <Smile className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{rescheduleMessage}</span>
          </div>
          <button onClick={() => setRescheduleMessage(null)} className="text-xs text-emerald-400 hover:text-white font-bold underline">
            Got it
          </button>
        </div>
      )}

      {/* Upcoming Exam Deadlines */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          Target Exam & Assessment Milestones
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {examDeadlines.map((exam, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-xs">{exam.title}</h4>
                <p className="text-[11px] text-slate-400">{exam.subject}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                {exam.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {DAYS.map(day => {
          const isActive = activeDay === day;
          const dayTasks = weeklySchedule[day] || [];
          const hasIncomplete = dayTasks.some(t => !t.completed);

          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <span>{day}</span>
              {dayTasks.length > 0 && (
                <span className={`w-2 h-2 rounded-full ${hasIncomplete ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Day Checklist */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-white">{activeDay}'s Study Routine</h2>
            <p className="text-xs text-slate-400">
              {currentTasks.length} planned topic tasks | {completedCount} completed
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-bold text-indigo-400">{progressPct}% Done</span>
              <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {currentTasks.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-slate-800 text-center space-y-2">
              <Smile className="w-8 h-8 text-emerald-400 mx-auto" />
              <h3 className="font-bold text-white text-sm">No Heavy Sessions Today</h3>
              <p className="text-xs text-slate-400">Enjoy your rest day or spend 15 minutes reviewing past Skill Passport notes!</p>
            </div>
          ) : (
            currentTasks.map(task => (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  task.completed
                    ? 'bg-slate-950/60 border-emerald-500/30'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleTask(task)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      task.completed
                        ? 'bg-emerald-500 border-emerald-400 text-white'
                        : 'border-slate-700 hover:border-indigo-500'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{task.topic}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {task.skill}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-slate-800 text-slate-300">
                        {task.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      Slot: {task.timeSlot}
                    </p>

                    {task.confidenceRating && (
                      <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold pt-0.5">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>Confidence: {task.confidenceRating}/5 Stars</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {!task.completed && (
                    <button
                      onClick={() => handleDidNotStudy(task)}
                      disabled={reschedulingTask?.id === task.id}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Supportive AI rescheduling without guilt"
                    >
                      <Heart className="w-3.5 h-3.5 text-amber-400" />
                      I Didn't Study
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Confidence Modal */}
      {showConfidenceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <h3 className="font-extrabold text-white text-lg text-center">
              Mark Topic Complete
            </h3>
            <p className="text-xs text-slate-300 text-center">
              How confident do you feel in <strong>"{showConfidenceModal.topic}"</strong>?
            </p>

            <div className="flex justify-center gap-2 pt-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setConfidenceInput(star)}
                  className={`p-3 rounded-2xl border text-sm font-bold flex flex-col items-center gap-1 transition-all ${
                    confidenceInput === star
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Star className={`w-5 h-5 ${confidenceInput >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                  <span>{star}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfidenceModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmConfidence}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20"
              >
                Save Confidence Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
