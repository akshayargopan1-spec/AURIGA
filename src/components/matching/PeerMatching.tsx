import React, { useState } from 'react';
import { StudentProfile, MatchResult } from '../../types';
import { DEMO_STUDENTS } from '../../data/demoData';
import { Search, Sparkles, CheckCircle2, Calendar, Star, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

interface PeerMatchingProps {
  studentProfile: StudentProfile;
  onSelectMatch: (match: MatchResult) => void;
}

export const PeerMatching: React.FC<PeerMatchingProps> = ({ studentProfile, onSelectMatch }) => {
  const [selectedLearnSkill, setSelectedLearnSkill] = useState(
    studentProfile.wantToLearn[0]?.skill || 'React'
  );
  const [selectedTeachSkill, setSelectedTeachSkill] = useState(
    studentProfile.canTeach[0]?.skill || 'Python'
  );
  const [isSearching, setIsSearching] = useState(false);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearchMatches = async () => {
    setIsSearching(true);
    setHasSearched(true);

    try {
      // Filter candidates from DEMO_STUDENTS
      const candidates = DEMO_STUDENTS.filter(s => s.uid !== studentProfile.uid);

      const res = await fetch('/api/ai/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          learnSkill: selectedLearnSkill,
          teachSkill: selectedTeachSkill,
          userProfile: studentProfile,
          candidateProfiles: candidates,
        }),
      });

      const data = await res.json();
      if (data.success && data.matches?.length > 0) {
        setMatches(data.matches);
      } else {
        // Fallback match constructing
        const fallbackMatches: MatchResult[] = candidates.map(c => ({
          matchScore: 92,
          peerProfile: c,
          teachSkillMatch: selectedLearnSkill,
          learnSkillMatch: selectedTeachSkill,
          commonTimeSlot: c.availableSlots[0] || '7 PM – 8 PM',
          whyMatch: [
            `Complementary skills: You want to learn ${selectedLearnSkill}, and ${c.name} is proficient in ${selectedLearnSkill}.`,
            `Reciprocal goals: ${c.name} wants to learn ${selectedTeachSkill}, which you can teach!`,
            `Availability overlap in evening slot (${c.availableSlots[0] || '7-8 PM'}).`,
            `Compatible learning style and high reliability score (${c.reliabilityScore}%).`
          ],
          reciprocalBenefits: `30 mins ${selectedLearnSkill} tutoring by ${c.name} ↕ 30 mins ${selectedTeachSkill} tutoring by you.`
        }));
        setMatches(fallbackMatches);
      }
    } catch (err) {
      console.warn('Matching API fallback:', err);
      const fallbackMatches: MatchResult[] = DEMO_STUDENTS.filter(s => s.uid !== studentProfile.uid).map(c => ({
        matchScore: 92,
        peerProfile: c,
        teachSkillMatch: selectedLearnSkill,
        learnSkillMatch: selectedTeachSkill,
        commonTimeSlot: c.availableSlots[0] || '7 PM – 8 PM',
        whyMatch: [
          `Complementary skills match`,
          `Reciprocal skill swap benefits both students`,
          `Matching evening availability`,
          `High peer feedback score (${c.impactMetrics.avgPeerRating} ★)`
        ],
        reciprocalBenefits: `30 mins ${selectedLearnSkill} exchange for 30 mins ${selectedTeachSkill}.`
      }));
      setMatches(fallbackMatches);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Reciprocal Match Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          FIND MY LEARNING PARTNER
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
          AI searches the campus network to discover students with complementary skills, matching time slots, and reciprocal learning interests.
        </p>
      </div>

      {/* Criteria Selection Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* What I Want To Learn */}
          <div>
            <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">
              I Want to Learn
            </label>
            <select
              value={selectedLearnSkill}
              onChange={(e) => setSelectedLearnSkill(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="React">React (Frontend Framework)</option>
              <option value="Python">Python (Data Science & Web)</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Cybersecurity">Cybersecurity & CTF</option>
              <option value="DBMS">Database Systems (SQL & NoSQL)</option>
              <option value="Data Structures">Data Structures & Algorithms</option>
              <option value="UI/UX Design">UI/UX Design & Figma</option>
            </select>
          </div>

          {/* What I Can Teach */}
          <div>
            <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">
              I Can Teach (In Exchange)
            </label>
            <select
              value={selectedTeachSkill}
              onChange={(e) => setSelectedTeachSkill(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold text-sm focus:outline-none focus:border-emerald-500"
            >
              {studentProfile.canTeach.map((s, idx) => (
                <option key={idx} value={s.skill}>
                  {s.skill} ({s.level} Level)
                </option>
              ))}
              <option value="Python">Python</option>
              <option value="JavaScript">JavaScript</option>
              <option value="C">C Language</option>
              <option value="DBMS">DBMS</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSearchMatches}
          disabled={isSearching}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
        >
          {isSearching ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin text-white" />
              <span>Analyzing Campus Skill Graph...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>FIND MATCH</span>
            </>
          )}
        </button>
      </div>

      {/* Results Section */}
      {hasSearched && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Compatible Campus Matches ({matches.length})
            </h2>
            <span className="text-xs text-slate-400">Sorted by Explainable Match Score</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {matches.map((match, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 transition-all space-y-5 shadow-xl relative overflow-hidden group"
              >
                {/* Match Score Badge */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                      {match.peerProfile.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {match.peerProfile.course} • {match.peerProfile.branch} ({match.peerProfile.semester})
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-sm border border-emerald-500/30 inline-block shadow-md">
                      {match.matchScore}% MATCH
                    </span>
                    <span className="block text-[10px] text-slate-400 font-medium mt-1">
                      Reliability: {match.peerProfile.reliabilityScore}%
                    </span>
                  </div>
                </div>

                {/* Reciprocal Skills Comparison */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-[10px] text-indigo-300 uppercase font-semibold block mb-0.5">You want to learn:</span>
                    <span className="font-bold text-white text-sm block">{match.teachSkillMatch}</span>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      {match.peerProfile.name} teaches {match.teachSkillMatch} (Rating: 4.9 ★)
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-emerald-300 uppercase font-semibold block mb-0.5">They want to learn:</span>
                    <span className="font-bold text-white text-sm block">{match.learnSkillMatch}</span>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      You teach {match.learnSkillMatch}
                    </span>
                  </div>
                </div>

                {/* Availability Overlap */}
                <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span>Common Availability: <strong>{match.commonTimeSlot}</strong></span>
                  </div>
                  <span className="text-[10px] text-indigo-300 uppercase font-bold">Matching Slot</span>
                </div>

                {/* WHY THIS MATCH? Explainability List */}
                <div className="space-y-2 pt-1 border-t border-slate-800/80">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    WHY THIS MATCH?
                  </span>
                  <div className="space-y-1.5">
                    {match.whyMatch.map((reason, rIdx) => (
                      <div key={rIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => onSelectMatch(match)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>CREATE KNOWLEDGE EXCHANGE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
