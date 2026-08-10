import React, { useState } from 'react';
import { StudentProfile, SkillItem, LearnGoal, SkillLevel } from '../../types';
import { BookOpen, Check, Plus, Trash2, ArrowRight, ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';

interface StudentOnboardingProps {
  initialData?: { name?: string; email?: string; college?: string };
  onComplete: (profile: StudentProfile) => void;
  onCancel: () => void;
}

const COMMON_TEACH_SKILLS = [
  'Python', 'C', 'Java', 'HTML/CSS', 'DBMS', 'Cybersecurity', 'UI/UX', 'Public Speaking', 'Mathematics', 'JavaScript', 'Data Structures'
];

const COMMON_LEARN_SKILLS = [
  'React', 'Machine Learning', 'Cybersecurity', 'Flutter', 'Data Structures', 'Cloud Computing', 'UI/UX Design', 'DevOps'
];

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TIME_SLOTS = ['Morning (8 AM – 12 PM)', 'Afternoon (12 PM – 5 PM)', 'Evening (5 PM – 9 PM)', '7 PM – 8 PM', '8 PM – 9 PM'];

const LEARNING_STYLES = [
  'Visual explanation', 'Practical coding', 'Problem solving', 'Discussion', 'Step-by-step explanation', 'Project-based learning', 'Quiz & practice'
];

export const StudentOnboarding: React.FC<StudentOnboardingProps> = ({ initialData, onComplete, onCancel }) => {
  const [step, setStep] = useState(1);

  // Step 1 State
  const [name, setName] = useState(initialData?.name || '');
  const [nickname, setNickname] = useState(initialData?.name ? initialData.name.split(' ')[0] : '');
  const [college, setCollege] = useState(initialData?.college || 'National Institute of Technology');
  const [course, setCourse] = useState('B.Tech');
  const [branch, setBranch] = useState('Computer Science');
  const [semester, setSemester] = useState('Semester 6');

  // Step 2 State - Can Teach
  const [canTeachList, setCanTeachList] = useState<SkillItem[]>([
    { skill: 'Python', level: 'Intermediate', selfRating: 4, assessmentScore: 80, peerRating: 4.5, sessionsTaught: 0, sessionsCompleted: 0 }
  ]);
  const [newTeachSkill, setNewTeachSkill] = useState('');
  const [newTeachLevel, setNewTeachLevel] = useState<SkillLevel>('Intermediate');

  // Step 3 State - Want To Learn
  const [wantToLearnList, setWantToLearnList] = useState<LearnGoal[]>([
    { skill: 'React', targetLevel: 'Intermediate', initialScore: 35, currentScore: 35 }
  ]);
  const [newLearnSkill, setNewLearnSkill] = useState('');

  // Step 4 State - Availability
  const [selectedDays, setSelectedDays] = useState<string[]>(['Monday', 'Wednesday', 'Friday', 'Saturday']);
  const [selectedSlots, setSelectedSlots] = useState<string[]>(['7 PM – 8 PM', '8 PM – 9 PM']);

  // Step 5 State - Preferences
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Practical coding', 'Visual explanation']);
  const [preferredLanguage, setPreferredLanguage] = useState('English');

  const addTeachSkill = (skillName: string, level: SkillLevel = 'Intermediate') => {
    if (!skillName.trim()) return;
    if (canTeachList.some(s => s.skill.toLowerCase() === skillName.toLowerCase())) return;
    setCanTeachList([
      ...canTeachList,
      { skill: skillName.trim(), level, selfRating: 4, assessmentScore: 75, peerRating: 4.5, sessionsTaught: 0, sessionsCompleted: 0 }
    ]);
    setNewTeachSkill('');
  };

  const removeTeachSkill = (index: number) => {
    setCanTeachList(canTeachList.filter((_, i) => i !== index));
  };

  const addLearnSkill = (skillName: string) => {
    if (!skillName.trim()) return;
    if (wantToLearnList.some(s => s.skill.toLowerCase() === skillName.toLowerCase())) return;
    setWantToLearnList([
      ...wantToLearnList,
      { skill: skillName.trim(), targetLevel: 'Intermediate', initialScore: 30, currentScore: 30 }
    ]);
    setNewLearnSkill('');
  };

  const removeLearnSkill = (index: number) => {
    setWantToLearnList(wantToLearnList.filter((_, i) => i !== index));
  };

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const toggleSlot = (slot: string) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter(s => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleFinish = () => {
    const finalName = name.trim() || initialData?.name || 'New Student';
    const finalNickname = nickname.trim() || (finalName !== 'New Student' ? finalName.split(' ')[0] : 'Student');
    const profile: StudentProfile = {
      uid: 'user-' + Date.now(),
      email: initialData?.email || (finalName !== 'New Student' ? `${finalName.toLowerCase().replace(/\s+/g, '.')}@college.edu` : 'student@college.edu'),
      name: finalName,
      nickname: finalNickname,
      college,
      course,
      branch,
      semester,
      canTeach: canTeachList,
      wantToLearn: wantToLearnList,
      availableDays: selectedDays,
      availableSlots: selectedSlots,
      learningPreferences: selectedStyles,
      preferredLanguage,
      reliabilityScore: 100,
      impactMetrics: {
        studentsHelped: 0,
        sessionsTaught: 0,
        sessionsCompleted: 0,
        avgPeerRating: 5.0,
        learningImprovements: 0,
      },
      badges: ['🌱 Fast Learner', '🤝 Peer Explorer'],
      profileVisibility: 'matched_peers',
    };
    onComplete(profile);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8">
      <div className="max-w-2xl mx-auto w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 my-auto">
        {/* Wizard Progress Indicator */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Step {step} of 5</span>
            <h2 className="text-xl font-bold text-white mt-0.5">
              {step === 1 && 'Basic Profile'}
              {step === 2 && 'What Can You Teach?'}
              {step === 3 && 'What Do You Want To Learn?'}
              {step === 4 && 'Your Availability'}
              {step === 5 && 'Learning Preferences'}
            </h2>
          </div>
          <button onClick={onCancel} className="text-xs text-slate-400 hover:text-white underline">
            Cancel
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* STEP 1: Basic Profile */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Set up your core campus identity. We never collect private contact info like phone numbers or home addresses.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Akshaya Menon"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Optional Nickname</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. Akshu"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">College / Institution *</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. National Institute of Technology"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Course</label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g. B.Tech"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Branch / Major</label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 2">Semester 2</option>
                  <option value="Semester 3">Semester 3</option>
                  <option value="Semester 4">Semester 4</option>
                  <option value="Semester 5">Semester 5</option>
                  <option value="Semester 6">Semester 6</option>
                  <option value="Semester 7">Semester 7</option>
                  <option value="Semester 8">Semester 8</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Skills I Can Teach */}
        {step === 2 && (
          <div className="space-y-5">
            <p className="text-xs text-slate-400">
              Select skills you feel comfortable explaining to a fellow student. You don't need to be an expert!
            </p>

            {/* Quick Suggestion Chips */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-2 uppercase tracking-wider">Quick Suggestions</span>
              <div className="flex flex-wrap gap-2">
                {COMMON_TEACH_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => addTeachSkill(skill)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600/30 text-xs text-slate-200 border border-slate-700 hover:border-indigo-500 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3 text-indigo-400" />
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Skill Adder */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newTeachSkill}
                onChange={(e) => setNewTeachSkill(e.target.value)}
                placeholder="Or type custom skill (e.g. Flutter)"
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
              />
              <select
                value={newTeachLevel}
                onChange={(e) => setNewTeachLevel(e.target.value as SkillLevel)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <button
                onClick={() => addTeachSkill(newTeachSkill, newTeachLevel)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white text-xs font-semibold"
              >
                Add Skill
              </button>
            </div>

            {/* Current Can Teach List */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-300 block">Skills You Can Teach ({canTeachList.length})</span>
              {canTeachList.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
                  No teaching skills added yet. Add at least 1 skill!
                </div>
              ) : (
                <div className="space-y-2">
                  {canTeachList.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{item.skill}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {item.level}
                        </span>
                      </div>
                      <button
                        onClick={() => removeTeachSkill(idx)}
                        className="p-1 text-slate-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Skills I Want To Learn */}
        {step === 3 && (
          <div className="space-y-5">
            <p className="text-xs text-slate-400">
              What topics or frameworks do you want to learn or improve in?
            </p>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-2 uppercase tracking-wider">Popular Topics</span>
              <div className="flex flex-wrap gap-2">
                {COMMON_LEARN_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => addLearnSkill(skill)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-600/30 text-xs text-slate-200 border border-slate-700 hover:border-emerald-500 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3 text-emerald-400" />
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newLearnSkill}
                onChange={(e) => setNewLearnSkill(e.target.value)}
                placeholder="Or type custom learning goal (e.g. Next.js)"
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
              />
              <button
                onClick={() => addLearnSkill(newLearnSkill)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white text-xs font-semibold"
              >
                Add Goal
              </button>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-300 block">Your Learning Goals ({wantToLearnList.length})</span>
              {wantToLearnList.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
                  No learning goals added yet. Add at least 1 goal!
                </div>
              ) : (
                <div className="space-y-2">
                  {wantToLearnList.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{item.skill}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          Goal: {item.targetLevel}
                        </span>
                      </div>
                      <button
                        onClick={() => removeLearnSkill(idx)}
                        className="p-1 text-slate-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: Availability */}
        {step === 4 && (
          <div className="space-y-5">
            <p className="text-xs text-slate-400">
              When are you typically free for short 15–60 minute peer exchanges?
            </p>

            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-2">Available Days</span>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((day) => {
                  const active = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        active
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-2">Preferred Time Slots</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const active = selectedSlots.includes(slot);
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => toggleSlot(slot)}
                      className={`p-3 rounded-xl text-xs text-left font-medium transition-all border flex items-center justify-between ${
                        active
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{slot}</span>
                      {active && <Check className="w-4 h-4 text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Learning Preferences & Finishing */}
        {step === 5 && (
          <div className="space-y-5">
            <p className="text-xs text-slate-400">
              Personalize how you like concepts explained to maximize your learning gain.
            </p>

            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-2">How do you learn best?</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {LEARNING_STYLES.map((style) => {
                  const active = selectedStyles.includes(style);
                  return (
                    <button
                      key={style}
                      type="button"
                      onClick={() => toggleStyle(style)}
                      className={`p-3 rounded-xl text-xs text-left font-medium transition-all border flex items-center justify-between ${
                        active
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{style}</span>
                      {active && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Preferred Explanation Language</label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
              >
                <option value="English">English</option>
                <option value="Malayalam">Malayalam</option>
                <option value="Hindi">Hindi</option>
                <option value="Tamil">Tamil</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Privacy & AI Control Guarantee</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                PeerSolve AI uses only your skills, goals, and availability to discover reciprocal peer matches. Your phone number, home address, and private chats are never shared.
              </p>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <Sparkles className="w-4 h-4" />
              Complete Skill Passport
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
