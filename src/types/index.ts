export type UserRole = 'student' | 'teacher' | 'admin';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface SkillItem {
  skill: string;
  level: SkillLevel;
  verified?: boolean;
  teacherVerified?: boolean;
  selfRating: number; // 1 to 5
  assessmentScore: number; // 0 to 100%
  peerRating: number; // 1 to 5
  sessionsTaught: number;
  sessionsCompleted: number;
}

export interface LearnGoal {
  skill: string;
  targetLevel: SkillLevel;
  initialScore?: number;
  currentScore?: number;
}

export interface ImpactMetrics {
  studentsHelped: number;
  sessionsTaught: number;
  sessionsCompleted: number;
  avgPeerRating: number;
  learningImprovements: number;
}

export interface SkillBaseline {
  completedAt: string;
  topicScores: Record<string, number>; // e.g. { "Python": 72, "DBMS": 64, "React": 38 }
  overallLevel: string; // "Intermediate Explorer"
  needsFoundationPath: boolean;
  recommendedTopics: string[];
  integrityScore: number; // 100 - warnings
  tabSwitchCount: number;
}

export interface StudentProfile {
  uid: string;
  email: string;
  name: string;
  nickname?: string;
  college: string;
  course: string;
  branch: string;
  semester: string;
  canTeach: SkillItem[];
  wantToLearn: LearnGoal[];
  availableDays: string[];
  availableSlots: string[];
  learningPreferences: string[];
  preferredLanguage: string;
  reliabilityScore: number; // 0 to 100
  impactMetrics: ImpactMetrics;
  badges: string[];
  isDemo?: boolean;
  profileVisibility?: 'everyone' | 'college_only' | 'matched_peers' | 'hidden';
  skillBaseline?: SkillBaseline;
  streakDays?: number;
  xpPoints?: number;
  leagueRank?: number;
}

export interface TeacherProfile {
  uid: string;
  email: string;
  name: string;
  college: string;
  department: string;
  coursesHandled: string[];
  isDemo?: boolean;
}

export interface AgendaItem {
  timeOffset: string; // e.g. "00-05"
  title: string;
  description: string;
  speaker: 'mentor' | 'learner' | 'both';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  type?: 'mcq' | 'short_answer' | 'scenario' | 'problem_solving';
  category?: string;
}

export interface AssessmentResult {
  scores: Record<string, number>;
  totalCorrect: number;
  totalQuestions: number;
  accuracy: number;
  integrityPassed: boolean;
  warningsCount: number;
  foundationPathNeeded: boolean;
  recommendations: string[];
}

export interface LearningMilestone {
  id: string;
  title: string;
  skill: string;
  estimatedHours: number;
  topics: string[];
  status: 'completed' | 'in_progress' | 'upcoming';
  recommendedMentorRole?: string;
  practiceExercise?: string;
}

export interface PersonalizedPlan {
  studentUid: string;
  createdAt: string;
  targetGoal: string;
  milestones: LearningMilestone[];
  weakAreas: string[];
  strengthAreas: string[];
  foundationPath?: {
    title: string;
    description: string;
    prerequisiteTopics: string[];
  };
}

export interface DailyStudyTask {
  id: string;
  timeSlot: string; // e.g. "7:00 PM – 8:00 PM"
  topic: string;
  skill: string;
  type: 'concept' | 'peer_session' | 'practice' | 'review';
  completed: boolean;
  confidenceRating?: number; // 1-5
  notes?: string;
}

export interface StudyTimetable {
  uid: string;
  weeklySchedule: Record<string, DailyStudyTask[]>; // day -> tasks
  examDeadlines: { title: string; date: string; subject: string }[];
  weeklyHoursTarget: number;
}

export interface PeerLeagueUser {
  uid: string;
  name: string;
  nickname?: string;
  college: string;
  branch: string;
  xpPoints: number;
  streakDays: number;
  rank: number;
  badges: string[];
  learningImprovementPercent: number;
  recentAchievement: string;
  avatarBg: string;
}

export interface LearningFeedPost {
  id: string;
  authorUid: string;
  authorName: string;
  authorBranch: string;
  type: 'assessment_completed' | 'session_completed' | 'streak_milestone' | 'badge_earned' | 'custom_update';
  content: string;
  skillTag?: string;
  scoreOrGain?: string;
  cheersCount: number;
  cheeredByMe?: boolean;
  createdAt: string;
}

export interface CoveredTopic {
  id: string;
  topicName: string;
  skill: string;
  updatedByPeer: string; // Name of peer who logged/updated this topic
  status: 'covered' | 'needs_revision' | 'mastered';
  notes?: string;
  updatedAt: string;
}

export interface SessionData {
  sessionId: string;
  mentorUid: string;
  learnerUid: string;
  mentorName: string;
  learnerName: string;
  teachSkill: string;
  learnSkill?: string;
  scheduledTime: string;
  durationMinutes: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  agenda?: AgendaItem[];
  coveredTopics?: CoveredTopic[];
  quiz?: QuizQuestion[];
  beforeScore?: number;
  afterScore?: number;
  learningGain?: number;
  notes?: string;
  feedback?: {
    rating: number; // 1-5
    knowledge: number;
    explanation: number;
    communication: number;
    punctuality: number;
    helpfulness: number;
    didHelp: 'yes' | 'partially' | 'no';
    comment?: string;
  };
  adaptationStrategy?: string;
  createdAt: string;
}

export interface MatchResult {
  matchScore: number; // e.g. 92
  peerProfile: StudentProfile;
  teachSkillMatch: string;
  learnSkillMatch: string;
  commonTimeSlot: string;
  whyMatch: string[];
  reciprocalBenefits: string;
}

export interface DoubtItem {
  doubtId: string;
  authorUid: string;
  authorName: string;
  isAnonymous: boolean;
  category: string;
  skill: string;
  question: string;
  aiAnswer?: string;
  recommendedMentors?: {
    uid: string;
    name: string;
    skillLevel: string;
    peerRating: number;
  }[];
  status: 'open' | 'resolved';
  createdAt: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  skill: string;
  authorName: string;
  type: 'notes' | 'cheat_sheet' | 'code' | 'practice_questions' | 'project_ref';
  url: string;
  description: string;
  usefulCount: number;
  createdAt: string;
}

export interface LearningCircle {
  id: string;
  title: string;
  topic: string;
  members: {
    uid: string;
    name: string;
    contributingSkill: string;
  }[];
  schedule: string;
  mentorName?: string;
}

export interface ChallengeItem {
  id: string;
  title: string;
  duration: string;
  skill: string;
  participantsCount: number;
  description: string;
  progressPercent: number;
}

export interface PrivacySettings {
  profileVisibility: 'everyone' | 'college_only' | 'matched_peers' | 'hidden';
  showSkills: boolean;
  showAvailability: boolean;
  showLearningGoals: boolean;
  allowAiOptimization: boolean;
}

