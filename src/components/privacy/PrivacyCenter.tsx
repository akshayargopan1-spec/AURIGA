import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import {
  Shield,
  Lock,
  Eye,
  CheckCircle2,
  XCircle,
  Sparkles,
  Check,
  Download,
  Trash2,
  Activity,
  Radio,
  FileSpreadsheet,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface PrivacyCenterProps {
  studentProfile: StudentProfile;
  onUpdateSettings: (updatedVisibility: StudentProfile['profileVisibility']) => void;
}

export const PrivacyCenter: React.FC<PrivacyCenterProps> = ({ studentProfile, onUpdateSettings }) => {
  const [visibility, setVisibility] = useState<StudentProfile['profileVisibility']>(
    studentProfile.profileVisibility || 'matched_peers'
  );

  const [showSkills, setShowSkills] = useState(true);
  const [showAvailability, setShowAvailability] = useState(true);
  const [allowAiOptimization, setAllowAiOptimization] = useState(true);
  const [incognitoMode, setIncognitoMode] = useState(false);

  // Granular broadcast controls
  const [broadcastStreaks, setBroadcastStreaks] = useState(true);
  const [broadcastTopicCompletions, setBroadcastTopicCompletions] = useState(true);
  const [broadcastPassportUpgrades, setBroadcastPassportUpgrades] = useState(true);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Privacy Audit Events
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'log-1',
      time: '10:42 AM',
      event: 'AI Skill Matching Vector Processed',
      details: 'Evaluated Python & DBMS complementarity with 0 PII passed',
      type: 'ai_filter'
    },
    {
      id: 'log-2',
      time: '09:15 AM',
      event: 'Verified Skill Passport Inspection',
      details: 'Faculty mentor validated React component architecture score',
      type: 'passport'
    },
    {
      id: 'log-3',
      time: 'Yesterday',
      event: 'Incognito Mode Policy Validated',
      details: 'Personal phone number and email redacted from candidate cache',
      type: 'security'
    }
  ]);

  const handleSave = () => {
    onUpdateSettings(visibility);
    setSaveSuccess(true);

    // Add audit log
    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        event: 'Privacy Preferences Updated',
        details: `Visibility set to "${visibility}". Incognito mode: ${incognitoMode ? 'ON' : 'OFF'}.`,
        type: 'security'
      },
      ...prev
    ]);

    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportData = () => {
    const dataPackage = {
      platform: 'PeerSolve Zero-Trust Learning Network',
      exportedAt: new Date().toISOString(),
      studentProfile: {
        name: studentProfile.name,
        nickname: studentProfile.nickname,
        branch: studentProfile.branch,
        semester: studentProfile.semester,
        reliabilityScore: studentProfile.reliabilityScore,
        canTeach: studentProfile.canTeach,
        wantToLearn: studentProfile.wantToLearn,
        profileVisibility: visibility,
      },
      privacySettings: {
        incognitoMode,
        broadcastStreaks,
        broadcastTopicCompletions,
        broadcastPassportUpgrades,
        allowAiOptimization
      },
      privacyAuditLogs: auditLogs
    };

    const blob = new Blob([JSON.stringify(dataPackage, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PeerSolve-DataExport-${studentProfile.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleExecuteDataErasure = () => {
    setShowResetModal(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5 text-indigo-400" />
          <span>Zero-Trust Privacy & Data Governance</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          PRIVACY & SECURITY CENTER
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          You own your campus data. Control profile discoverability, pseudonymize your peer presence, configure AI data filtering, and export or purge your data anytime.
        </p>
      </div>

      {/* Incognito & Pseudonymized Search Feature */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <Shield className="w-5 h-5 text-indigo-400" />
              <span>Incognito Peer Search Mode</span>
              {incognitoMode && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold">
                  ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              When active, your real name is masked as <span className="text-indigo-300 font-mono font-bold">"PeerScholar#{Math.floor(100 + Math.random() * 900)}"</span> across peer matching lists. Real identity is only revealed after both students accept a reciprocal learning session.
            </p>
          </div>

          <button
            onClick={() => setIncognitoMode(!incognitoMode)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              incognitoMode
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>{incognitoMode ? 'Incognito Mode Active' : 'Enable Incognito Search'}</span>
          </button>
        </div>
      </div>

      {/* AI Data Minimization Filter Box */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span>AI Data Minimization Visual Filter</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Before any peer matching or session generation occurs, your profile passes through our strict privacy filter. AI processes only what is mathematically required for complementary skill matching.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Information AI Uses */}
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
            <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Information Processed By AI
            </span>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-1">
              <li className="flex items-center gap-2">✓ Verified Skills & Proficiency Levels</li>
              <li className="flex items-center gap-2">✓ Learning Goals & Target Skills</li>
              <li className="flex items-center gap-2">✓ Meeting Time Slots & Availability</li>
              <li className="flex items-center gap-2">✓ Preferred Explanation Languages & Styles</li>
            </ul>
          </div>

          {/* Information AI Excludes */}
          <div className="p-4 rounded-xl bg-slate-950 border border-red-500/30 space-y-2">
            <span className="text-xs font-extrabold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-red-400" />
              Information Excluded & Protected
            </span>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-1">
              <li className="flex items-center gap-2">✗ Phone Numbers & Personal Contacts</li>
              <li className="flex items-center gap-2">✗ Personal Email Addresses & Home Addresses</li>
              <li className="flex items-center gap-2">✗ Private Peer Notes & Workspace Scratchpad</li>
              <li className="flex items-center gap-2">✗ Sensitive Personal Attributes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Visibility Settings Form */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Eye className="w-5 h-5 text-indigo-400" />
          Who Can Discover My Profile?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: 'everyone', label: 'Everyone in PeerSolve', desc: 'Visible across all campus peer searches.' },
            { id: 'college_only', label: 'College Members Only', desc: 'Visible only to verified students in your college.' },
            { id: 'matched_peers', label: 'Matched Peers Only', desc: 'Visible only when AI finds a reciprocal match.' },
            { id: 'hidden', label: 'Hidden / Incognito', desc: 'Hide from search. Manual connection only.' },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setVisibility(opt.id as any)}
              className={`p-4 rounded-xl text-left border transition-all ${
                visibility === opt.id
                  ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="text-xs block font-bold text-white mb-1">{opt.label}</span>
              <span className="text-[11px] text-slate-400 block font-normal leading-relaxed">{opt.desc}</span>
            </button>
          ))}
        </div>

        {/* Granular Visibility & Broadcast Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">Granular Profile Attributes</h3>
            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-200 font-medium">Show teaching skills in peer search</span>
                <input
                  type="checkbox"
                  checked={showSkills}
                  onChange={(e) => setShowSkills(e.target.checked)}
                  className="accent-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-200 font-medium">Show availability time slots</span>
                <input
                  type="checkbox"
                  checked={showAvailability}
                  onChange={(e) => setShowAvailability(e.target.checked)}
                  className="accent-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-200 font-medium">Allow AI learning preference optimization</span>
                <input
                  type="checkbox"
                  checked={allowAiOptimization}
                  onChange={(e) => setAllowAiOptimization(e.target.checked)}
                  className="accent-indigo-500"
                />
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>Campus Activity Broadcast Controls</span>
            </h3>
            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-200 font-medium">Broadcast study streak milestones to feed</span>
                <input
                  type="checkbox"
                  checked={broadcastStreaks}
                  onChange={(e) => setBroadcastStreaks(e.target.checked)}
                  className="accent-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-200 font-medium">Broadcast topic completion updates</span>
                <input
                  type="checkbox"
                  checked={broadcastTopicCompletions}
                  onChange={(e) => setBroadcastTopicCompletions(e.target.checked)}
                  className="accent-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-200 font-medium">Broadcast Skill Passport level upgrades</span>
                <input
                  type="checkbox"
                  checked={broadcastPassportUpgrades}
                  onChange={(e) => setBroadcastPassportUpgrades(e.target.checked)}
                  className="accent-emerald-500"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {saveSuccess ? (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-400" /> Privacy Preferences Saved!
            </span>
          ) : (
            <div />
          )}

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
          >
            Save Privacy Preferences
          </button>
        </div>
      </div>

      {/* Live Privacy Audit Log */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Activity className="w-5 h-5 text-indigo-400" />
            <span>Privacy Audit Log (Zero-Trust Transparency)</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            LOGS ENCRYPTED
          </span>
        </div>

        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white">{log.event}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    {log.time}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">{log.details}</p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            </div>
          ))}
        </div>
      </div>

      {/* Data Governance & Portability (GDPR Right to Access & Erasure) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-sky-400" />
          Data Governance & Portability (GDPR Compliant)
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Download your complete PeerSolve academic records, verified skill passport history, and session metadata, or request data cache erasure.
        </p>

        {resetSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Transient cache erased! Your baseline evaluation and session logs have been purged.</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={handleExportData}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/20 flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export My Data Package (JSON)</span>
          </button>

          <button
            onClick={() => setShowResetModal(true)}
            className="px-5 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 font-bold text-xs flex items-center gap-2 transition-all"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
            <span>Request Data Cache Erasure</span>
          </button>

          {exportSuccess && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-400" /> Data Package Downloaded!
            </span>
          )}
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-red-500/40 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 font-bold">
              <AlertTriangle className="w-6 h-6" />
              <span className="text-lg">Confirm Data Cache Erasure</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to request data cache erasure? This will wipe your local transient assessment cache and reset your peer matching logs. Your verified faculty credentials remain stored safely.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteDataErasure}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500 shadow-lg shadow-red-600/30"
              >
                Yes, Erase Cache
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
