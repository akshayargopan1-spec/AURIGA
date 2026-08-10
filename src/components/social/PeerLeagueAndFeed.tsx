import React, { useState } from 'react';
import { StudentProfile, PeerLeagueUser, LearningFeedPost, ChallengeItem } from '../../types';
import {
  Trophy,
  Flame,
  Award,
  Sparkles,
  ThumbsUp,
  MessageSquare,
  Users,
  Send,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  Zap,
  Star
} from 'lucide-react';

interface PeerLeagueAndFeedProps {
  studentProfile: StudentProfile;
}

const DEMO_LEAGUE: PeerLeagueUser[] = [
  {
    uid: 'p1',
    name: 'Akshaya Menon',
    nickname: 'Akshu',
    college: 'National Institute of Technology',
    branch: 'Computer Science',
    xpPoints: 1250,
    streakDays: 8,
    rank: 1,
    badges: ['🔥 8-Day Streak', '🥇 Top Mentor'],
    learningImprovementPercent: 42,
    recentAchievement: 'Completed 5 reciprocal Python exchanges with +35% score gain!',
    avatarBg: 'from-amber-500 to-orange-600'
  },
  {
    uid: 'p2',
    name: 'Rahul Varma',
    nickname: 'Rahul',
    college: 'National Institute of Technology',
    branch: 'Computer Science',
    xpPoints: 1120,
    streakDays: 7,
    rank: 2,
    badges: ['🌱 Fast Learner', '🤝 Peer Explorer'],
    learningImprovementPercent: 38,
    recentAchievement: 'Mastered React Hooks baseline assessment!',
    avatarBg: 'from-indigo-500 to-purple-600'
  },
  {
    uid: 'p3',
    name: 'Sneha Patel',
    nickname: 'Sneha',
    college: 'National Institute of Technology',
    branch: 'Information Technology',
    xpPoints: 980,
    streakDays: 5,
    rank: 3,
    badges: ['📚 Consistency Champ'],
    learningImprovementPercent: 31,
    recentAchievement: 'Resolved 12 peer doubts in DBMS Queries!',
    avatarBg: 'from-emerald-500 to-teal-600'
  },
  {
    uid: 'p4',
    name: 'Arjun Das',
    nickname: 'Arjun',
    college: 'National Institute of Technology',
    branch: 'Electrical Engineering',
    xpPoints: 840,
    streakDays: 4,
    rank: 4,
    badges: ['⚡ Rapid Improver'],
    learningImprovementPercent: 28,
    recentAchievement: 'Completed 3 peer tutoring sessions in C++',
    avatarBg: 'from-sky-500 to-blue-600'
  }
];

const INITIAL_POSTS: LearningFeedPost[] = [
  {
    id: 'post-1',
    authorUid: 'p1',
    authorName: 'Akshaya Menon',
    authorBranch: 'CSE',
    type: 'assessment_completed',
    content: 'Just completed my DBMS Entry Assessment with an 85% score baseline! Excited to mentor peers in SQL indexing.',
    skillTag: 'DBMS',
    scoreOrGain: '85% Baseline',
    cheersCount: 14,
    cheeredByMe: false,
    createdAt: '20 mins ago'
  },
  {
    id: 'post-2',
    authorUid: 'p2',
    authorName: 'Rahul Varma',
    authorBranch: 'CSE',
    type: 'session_completed',
    content: 'Had an awesome 30-minute reciprocal exchange with Akshaya! Taught React props and learned Python recursion.',
    skillTag: 'React & Python',
    scoreOrGain: '+28% Gain',
    cheersCount: 19,
    cheeredByMe: true,
    createdAt: '1 hour ago'
  },
  {
    id: 'post-3',
    authorUid: 'p3',
    authorName: 'Sneha Patel',
    authorBranch: 'IT',
    type: 'streak_milestone',
    content: 'Hit a 5-day study routine streak! The AI timetable makes rescheduling missed topics so stress-free.',
    skillTag: 'Study Habit',
    scoreOrGain: '5-Day Streak',
    cheersCount: 22,
    cheeredByMe: false,
    createdAt: '3 hours ago'
  }
];

const WEEKLY_CHALLENGES: ChallengeItem[] = [
  {
    id: 'c1',
    title: '7-Day Study Routine Streak',
    duration: 'Ends in 3 days',
    skill: 'Consistency',
    participantsCount: 142,
    description: 'Complete at least 1 study task daily for 7 consecutive days.',
    progressPercent: 71
  },
  {
    id: 'c2',
    title: 'Reciprocal Knowledge Swap',
    duration: 'Ends in 5 days',
    skill: 'Teaching & Learning',
    participantsCount: 88,
    description: 'Complete 2 reciprocal peer exchange sessions with verified feedback.',
    progressPercent: 50
  }
];

export const PeerLeagueAndFeed: React.FC<PeerLeagueAndFeedProps> = ({ studentProfile }) => {
  const [activeTab, setActiveTab] = useState<'league' | 'feed' | 'challenges'>('league');
  const [posts, setPosts] = useState<LearningFeedPost[]>(INITIAL_POSTS);
  const [newPostText, setNewPostText] = useState('');
  const [selectedTag, setSelectedTag] = useState('Python');
  const [myStreak] = useState(7);
  const [myXP] = useState(studentProfile.xpPoints || 1050);

  const handleCheerPost = (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const cheered = !p.cheeredByMe;
          return {
            ...p,
            cheeredByMe: cheered,
            cheersCount: cheered ? p.cheersCount + 1 : p.cheersCount - 1
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: LearningFeedPost = {
      id: `post-${Date.now()}`,
      authorUid: studentProfile.uid,
      authorName: studentProfile.name,
      authorBranch: studentProfile.branch || 'CSE',
      type: 'custom_update',
      content: newPostText.trim(),
      skillTag: selectedTag,
      scoreOrGain: 'Learning Update',
      cheersCount: 1,
      cheeredByMe: true,
      createdAt: 'Just now'
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Hero Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-indigo-400" />
            Peer Learning League & Feed
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Campus Peer League & Community Activity
          </h1>
          <p className="text-xs text-slate-300">
            Celebrating learning consistency, peer assistance, and skill score growth across campus.
          </p>
        </div>

        {/* Live Peers Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <span className="text-xs font-extrabold text-white block">18 Peers Learning Now</span>
              <span className="text-[10px] text-slate-400 font-medium">Active on Campus</span>
            </div>
          </div>

          <div className="px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-amber-300 font-bold text-xs">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span>{myStreak}-Day Streak</span>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('league')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'league'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Trophy className="w-4 h-4" />
          Peer Learning League
        </button>

        <button
          onClick={() => setActiveTab('feed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'feed'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          Learning Feed ({posts.length})
        </button>

        <button
          onClick={() => setActiveTab('challenges')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'challenges'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Weekly Challenges
        </button>
      </div>

      {/* TAB 1: PEER LEAGUE LEADERBOARD */}
      {activeTab === 'league' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              <strong>Improvement-Focused League:</strong> XP is awarded for learning consistency, helping peers, and score improvements — encouraging non-toxic, inclusive growth!
            </span>
          </div>

          <div className="space-y-3">
            {DEMO_LEAGUE.map((user) => (
              <div
                key={user.uid}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Rank Badge */}
                  <div className={`w-8 h-8 rounded-xl font-extrabold text-xs flex items-center justify-center shrink-0 ${
                    user.rank === 1 ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30' :
                    user.rank === 2 ? 'bg-slate-300 text-slate-950' :
                    user.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    #{user.rank}
                  </div>

                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${user.avatarBg} text-white font-bold text-sm flex items-center justify-center shadow-md shrink-0`}>
                    {user.name.charAt(0)}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-white text-sm">{user.name}</h3>
                      <span className="text-[10px] text-slate-400 font-medium">({user.branch})</span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">{user.recentAchievement}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {user.badges.map((b, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-950 text-slate-300 border border-slate-800">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-emerald-400 block">+{user.learningImprovementPercent}% Score Gain</span>
                    <span className="text-xs font-bold text-white block">{user.xpPoints} XP</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold text-xs flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>{user.streakDays}d</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LEARNING UPDATE FEED */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          {/* Create Post Input */}
          <form onSubmit={handleCreatePost} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
              Share a Learning Milestone with Campus
            </h3>
            <textarea
              value={newPostText}
              onChange={e => setNewPostText(e.target.value)}
              placeholder="What concept did you learn or teach today? (e.g. Mastered React Hooks baseline assessment!)"
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 h-20 resize-none"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-medium">Tag Skill:</span>
                <select
                  value={selectedTag}
                  onChange={e => setSelectedTag(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="Python">Python</option>
                  <option value="React">React</option>
                  <option value="DBMS">DBMS</option>
                  <option value="Data Structures">Data Structures</option>
                  <option value="Study Routine">Study Routine</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!newPostText.trim()}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                Post Update (+15 XP)
              </button>
            </div>
          </form>

          {/* Posts Stream */}
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
                      {post.authorName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-xs">{post.authorName}</h4>
                        <span className="text-[10px] text-slate-400">({post.authorBranch})</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block">{post.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {post.skillTag && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {post.skillTag}
                      </span>
                    )}
                    {post.scoreOrGain && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {post.scoreOrGain}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {post.content}
                </p>

                <div className="flex items-center gap-4 pt-2 border-t border-slate-800/60">
                  <button
                    onClick={() => handleCheerPost(post.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      post.cheeredByMe
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-indigo-400" />
                    <span>High-Five ({post.cheersCount})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WEEKLY CHALLENGES */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WEEKLY_CHALLENGES.map(challenge => (
              <div key={challenge.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {challenge.duration}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {challenge.participantsCount} Peers Enrolled
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-white text-base">{challenge.title}</h3>
                  <p className="text-xs text-slate-400">{challenge.description}</p>
                </div>

                <div className="space-y-1 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400">Your Progress</span>
                    <span className="text-indigo-400">{challenge.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                      style={{ width: `${challenge.progressPercent}%` }}
                    />
                  </div>
                </div>

                <button className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20">
                  Active Challenge (Reward: 250 XP)
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
