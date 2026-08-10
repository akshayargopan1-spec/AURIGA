import React, { useState } from 'react';
import { StudentProfile, SkillItem, LearnGoal, SkillLevel } from '../../types';
import { Award, Star, CheckCircle, Plus, BookOpen, ShieldCheck, Sparkles, TrendingUp, BarChart2, User, Edit3 } from 'lucide-react';

interface SkillPassportProps {
  studentProfile: StudentProfile;
  onUpdateProfile: (updated: StudentProfile) => void;
}

export const SkillPassport: React.FC<SkillPassportProps> = ({ studentProfile, onUpdateProfile }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>('Intermediate');
  const [newSelfRating, setNewSelfRating] = useState(4);

  // Profile Edit State
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editName, setEditName] = useState(studentProfile.name);
  const [editNickname, setEditNickname] = useState(studentProfile.nickname || studentProfile.name.split(' ')[0] || '');
  const [editCollege, setEditCollege] = useState(studentProfile.college || '');
  const [editBranch, setEditBranch] = useState(studentProfile.branch || '');
  const [editSemester, setEditSemester] = useState(studentProfile.semester || '');

  const handleSaveProfile = () => {
    const trimmedName = editName.trim() || studentProfile.name;
    const trimmedNickname = editNickname.trim() || trimmedName.split(' ')[0] || 'Student';
    
    onUpdateProfile({
      ...studentProfile,
      name: trimmedName,
      nickname: trimmedNickname,
      college: editCollege.trim() || studentProfile.college,
      branch: editBranch.trim() || studentProfile.branch,
      semester: editSemester.trim() || studentProfile.semester,
    });
    setShowEditProfileModal(false);
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;

    const newSkill: SkillItem = {
      skill: newSkillName.trim(),
      level: newSkillLevel,
      verified: false,
      selfRating: newSelfRating,
      assessmentScore: 78, // Initial baseline test
      peerRating: 4.5,
      sessionsTaught: 0,
      sessionsCompleted: 0,
    };

    const updatedCanTeach = [...studentProfile.canTeach, newSkill];
    onUpdateProfile({
      ...studentProfile,
      canTeach: updatedCanTeach,
    });

    setNewSkillName('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Peer Credentials</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            MY SKILL PASSPORT
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
            Your dynamic, peer-verified knowledge portfolio. Scores are calculated through self-evaluation, AI assessments, peer feedback, and teaching sessions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setEditName(studentProfile.name);
              setEditNickname(studentProfile.nickname || studentProfile.name.split(' ')[0] || '');
              setEditCollege(studentProfile.college || '');
              setEditBranch(studentProfile.branch || '');
              setEditSemester(studentProfile.semester || '');
              setShowEditProfileModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4 text-indigo-400" />
            Edit Profile Info
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Skill to Passport
          </button>
        </div>
      </div>

      {/* Skills You Can Teach Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Skills You Can Teach ({studentProfile.canTeach.length})
          </h2>
          <span className="text-xs text-slate-400">Calculated via PeerSolve Skill Indicator</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentProfile.canTeach.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-5 shadow-lg relative group"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {item.skill}
                  </h3>
                  <p className="text-xs text-slate-400">Verified Peer Proficiency</p>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 block">
                    {item.level}
                  </span>
                  {item.teacherVerified && (
                    <span className="text-[10px] text-emerald-400 font-bold block mt-1 flex items-center justify-end gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-400" /> TEACHER VERIFIED
                    </span>
                  )}
                </div>
              </div>

              {/* Core Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Self Rating</span>
                  <div className="flex items-center gap-1 font-bold text-amber-400 mt-0.5">
                    {item.selfRating} / 5 <Star className="w-3 h-3 fill-amber-400" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Assessment Score</span>
                  <div className="font-bold text-emerald-400 mt-0.5">
                    {item.assessmentScore}%
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Peer Feedback</span>
                  <div className="font-bold text-sky-400 mt-0.5">
                    {item.peerRating} / 5.0
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Sessions Taught</span>
                  <div className="font-bold text-indigo-300 mt-0.5">
                    {item.sessionsTaught} completed
                  </div>
                </div>
              </div>

              {/* PeerSolve Skill Level Indicator */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">PeerSolve Skill Level:</span>
                <span className="font-extrabold text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                  {item.level}+
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills You Want To Learn Section */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          Learning Goals & Progress
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studentProfile.wantToLearn.map((goal, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{goal.skill}</h3>
                  <span className="text-xs text-slate-400">Target Level: {goal.targetLevel}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-emerald-400">
                    {goal.currentScore}% Progress
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${goal.currentScore || 40}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Initial Assessment: {goal.initialScore}%</span>
                <span className="text-emerald-400 font-semibold">
                  +{(goal.currentScore || 40) - (goal.initialScore || 0)} Points Gained
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Disclaimer Box */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            <strong>PeerSolve Skill Level</strong> is an internal platform indicator based on peer feedback, teaching sessions, and quizzes. It is not an official academic grade or university certification.
          </span>
        </div>
      </div>

      {/* Add Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Add Skill to Passport</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Skill Name</label>
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. Node.js or Cybersecurity"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Proficiency Level</label>
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Self Rating (1 to 5 Stars)</label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={newSelfRating}
                  onChange={(e) => setNewSelfRating(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
                <div className="text-right text-xs text-amber-400 font-bold">{newSelfRating} Stars</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSkill}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Save Skill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Info Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-400" />
                Edit Profile Information
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Akshaya Menon"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Preferred Display / Nickname</label>
                <input
                  type="text"
                  value={editNickname}
                  onChange={(e) => setEditNickname(e.target.value)}
                  placeholder="e.g. Akshaya"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">College / University</label>
                <input
                  type="text"
                  value={editCollege}
                  onChange={(e) => setEditCollege(e.target.value)}
                  placeholder="e.g. National Institute of Technology"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Branch / Major</label>
                  <input
                    type="text"
                    value={editBranch}
                    onChange={(e) => setEditBranch(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Semester</label>
                  <input
                    type="text"
                    value={editSemester}
                    onChange={(e) => setEditSemester(e.target.value)}
                    placeholder="e.g. Semester 6"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Save Profile Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
