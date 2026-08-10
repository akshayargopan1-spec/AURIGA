import React, { useState } from 'react';
import { TeacherProfile, StudentProfile } from '../../types';
import { DEMO_STUDENTS } from '../../data/demoData';
import { GraduationCap, CheckCircle, Users, BookOpen, Sparkles, Plus, TrendingUp, Award, Layers } from 'lucide-react';

interface TeacherDashboardProps {
  teacherProfile: TeacherProfile;
  onLogout: () => void;
  onSwitchRole: (role: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ teacherProfile, onLogout, onSwitchRole }) => {
  const [students, setStudents] = useState<StudentProfile[]>(DEMO_STUDENTS);
  const [verifiedMap, setVerifiedMap] = useState<Record<string, boolean>>({
    'demo-rahul-React': true,
    'demo-akshaya-Python': true,
    'demo-arjun-Machine Learning': true,
  });

  const toggleVerification = (studentUid: string, skillName: string) => {
    const key = `${studentUid}-${skillName}`;
    setVerifiedMap({
      ...verifiedMap,
      [key]: !verifiedMap[key],
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 p-[2px]">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-sky-400" />
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-white text-base leading-none">
              PeerSolve Teacher Center
            </h1>
            <span className="text-xs text-slate-400">{teacherProfile.name} • {teacherProfile.department}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSwitchRole('student')}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold"
          >
            Switch to Student View
          </button>
          <button onClick={onLogout} className="text-xs text-slate-400 hover:text-white">
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8 flex-1">
        {/* Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
            <span>Faculty Endorsements & Peer Learning Supervision</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            TEACHER PEER-LEARNING CENTER
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
            Endorse student peer mentor skills, inspect class skill demand, and orchestrate learning circles across your courses.
          </p>
        </div>

        {/* WHAT DOES THIS CLASS NEED? Insights */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            WHAT DOES THIS CLASS NEED? (Faculty Insights)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1">
              <span className="text-[10px] text-amber-300 uppercase font-bold block">HIGH LEARNER DEMAND</span>
              <span className="font-extrabold text-white text-base block">React & Machine Learning</span>
              <p className="text-slate-400">14 students requested peer mentoring in React components.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1">
              <span className="text-[10px] text-emerald-300 uppercase font-bold block">HIGH PEER MENTOR SUPPLY</span>
              <span className="font-extrabold text-white text-base block">Python & C Programming</span>
              <p className="text-slate-400">18 verified student peer mentors available for Python.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-sky-500/30 space-y-1">
              <span className="text-[10px] text-sky-300 uppercase font-bold block">FACULTY ACTION RECOMMENDATION</span>
              <span className="font-extrabold text-white text-base block">Create Cybersecurity Circle</span>
              <p className="text-slate-400">Low mentor supply in Cybersecurity. Recommended workshop.</p>
            </div>
          </div>
        </div>

        {/* Student Skill Verification Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            Teacher Skill Endorsements
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {students.map((student) => (
              <div key={student.uid} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-base">{student.name}</h4>
                    <p className="text-xs text-slate-400">{student.course} • {student.branch}</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                    Reliability: {student.reliabilityScore}%
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 uppercase block">Student Skills For Endorsement</span>
                  <div className="space-y-2">
                    {student.canTeach.map((skillItem, sIdx) => {
                      const isVerified = verifiedMap[`${student.uid}-${skillItem.skill}`];
                      return (
                        <div
                          key={sIdx}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                        >
                          <div>
                            <span className="font-bold text-white block">{skillItem.skill} ({skillItem.level})</span>
                            <span className="text-[10px] text-slate-400">
                              Assessment: {skillItem.assessmentScore}% | Peer Rating: {skillItem.peerRating}★
                            </span>
                          </div>

                          <button
                            onClick={() => toggleVerification(student.uid, skillItem.skill)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                              isVerified
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            }`}
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            {isVerified ? 'TEACHER VERIFIED' : 'Endorse Skill'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
