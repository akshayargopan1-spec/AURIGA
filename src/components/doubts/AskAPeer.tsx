import React, { useState } from 'react';
import { DoubtItem, StudentProfile } from '../../types';
import { HelpCircle, Sparkles, Send, ShieldCheck, UserCheck, MessageSquare } from 'lucide-react';

interface AskAPeerProps {
  studentProfile: StudentProfile;
  doubts: DoubtItem[];
  onPostDoubt: (newDoubt: DoubtItem) => void;
}

export const AskAPeer: React.FC<AskAPeerProps> = ({ studentProfile, doubts, onPostDoubt }) => {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('Database Systems');
  const [skill, setSkill] = useState('DBMS');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsPosting(true);

    try {
      // Call AI Doubt Answer API
      const res = await fetch('/api/ai/doubt-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          skill,
          category,
        }),
      });

      const data = await res.json();
      const aiAns = data.aiAnswer || 'Here is an initial concept overview: Focus on breaking down the key relations and identifying primary vs foreign key dependencies.';

      const newDoubt: DoubtItem = {
        doubtId: 'doubt-' + Date.now(),
        authorUid: isAnonymous ? 'anon' : studentProfile.uid,
        authorName: isAnonymous ? 'Anonymous Peer' : studentProfile.name,
        isAnonymous,
        category,
        skill,
        question,
        aiAnswer: aiAns,
        recommendedMentors: [
          { uid: 'demo-rahul', name: 'Rahul Sharma', skillLevel: 'Advanced', peerRating: 4.9 },
          { uid: 'demo-akshaya', name: 'Akshaya Menon', skillLevel: 'Intermediate', peerRating: 4.8 }
        ],
        status: 'open',
        createdAt: 'Just now',
      };

      onPostDoubt(newDoubt);
      setQuestion('');
    } catch (err) {
      console.warn('Doubt post error:', err);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Peer Doubt Community</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          ASK A PEER
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
          Get an instant AI concept breakdown first, then connect with a verified campus peer mentor for a human explanation.
        </p>
      </div>

      {/* Ask Question Form */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Post A Question
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              >
                <option value="Database Systems">Database Systems</option>
                <option value="Web Development">Web Development</option>
                <option value="Programming Languages">Programming Languages</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Machine Learning">Machine Learning</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Skill Topic</label>
              <input
                type="text"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                placeholder="e.g. DBMS or React"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Your Question / Doubt</label>
            <textarea
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Can someone explain DBMS 3NF normalization with a simple real-world example?"
              rows={3}
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {/* Anonymous Toggle */}
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded bg-slate-950 border-slate-800 text-indigo-600 accent-indigo-500"
              />
              <span>Post Anonymously (Hide My Profile)</span>
            </label>

            <button
              type="submit"
              disabled={isPosting}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              {isPosting ? 'Processing...' : 'Post Question'}
            </button>
          </div>
        </form>
      </div>

      {/* Community Doubts Stream */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-amber-400" />
          Recent Student Questions ({doubts.length})
        </h2>

        <div className="space-y-4">
          {doubts.map((doubt) => (
            <div key={doubt.doubtId} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-indigo-300">{doubt.authorName}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{doubt.category} ({doubt.skill})</span>
                </div>
                <span className="text-slate-500 text-[11px]">{doubt.createdAt}</span>
              </div>

              <h3 className="text-base font-bold text-white leading-relaxed">
                "{doubt.question}"
              </h3>

              {/* AI Quick Answer Box */}
              {doubt.aiAnswer && (
                <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-indigo-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> AI QUICK EXPLANATION
                  </span>
                  <p className="leading-relaxed">{doubt.aiAnswer}</p>
                </div>
              )}

              {/* Recommended Mentors Box */}
              {doubt.recommendedMentors && doubt.recommendedMentors.length > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Verified Campus Mentors for This Topic
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {doubt.recommendedMentors.map((m, mIdx) => (
                      <span
                        key={mIdx}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-2"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                        {m.name} ({m.skillLevel} • {m.peerRating}★)
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
