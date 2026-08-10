import { StudentProfile, TeacherProfile, SessionData, DoubtItem, ResourceItem, LearningCircle, ChallengeItem } from '../types';

export const DEMO_STUDENTS: StudentProfile[] = [
  {
    uid: 'demo-rahul',
    email: 'rahul.s@college.edu',
    name: 'Rahul Sharma',
    nickname: 'Rahul',
    college: 'National Institute of Technology',
    course: 'B.Tech',
    branch: 'Computer Science',
    semester: 'Semester 6',
    canTeach: [
      { skill: 'React', level: 'Advanced', verified: true, teacherVerified: true, selfRating: 5, assessmentScore: 92, peerRating: 4.9, sessionsTaught: 12, sessionsCompleted: 8 },
      { skill: 'JavaScript', level: 'Advanced', verified: true, teacherVerified: false, selfRating: 5, assessmentScore: 88, peerRating: 4.8, sessionsTaught: 9, sessionsCompleted: 6 },
      { skill: 'UI/UX Design', level: 'Intermediate', verified: false, teacherVerified: false, selfRating: 4, assessmentScore: 78, peerRating: 4.6, sessionsTaught: 4, sessionsCompleted: 3 },
    ],
    wantToLearn: [
      { skill: 'Python', targetLevel: 'Intermediate', initialScore: 40, currentScore: 72 },
      { skill: 'Machine Learning', targetLevel: 'Beginner', initialScore: 25, currentScore: 45 },
    ],
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    availableSlots: ['7 PM – 8 PM', '8 PM – 9 PM'],
    learningPreferences: ['Practical coding', 'Problem solving', 'Visual explanation'],
    preferredLanguage: 'English',
    reliabilityScore: 96,
    impactMetrics: {
      studentsHelped: 18,
      sessionsTaught: 25,
      sessionsCompleted: 18,
      avgPeerRating: 4.8,
      learningImprovements: 15,
    },
    badges: ['🏅 Verified Skill', '🤝 Helpful Peer', '🎓 Great Mentor', '⚡ Reliable Peer', '🔥 5-Day Streak'],
    isDemo: true,
    profileVisibility: 'matched_peers',
  },
  {
    uid: 'demo-akshaya',
    email: 'akshaya.m@college.edu',
    name: 'Akshaya Menon',
    nickname: 'Akshaya',
    college: 'National Institute of Technology',
    course: 'B.Tech',
    branch: 'Information Technology',
    semester: 'Semester 6',
    canTeach: [
      { skill: 'Python', level: 'Advanced', verified: true, teacherVerified: true, selfRating: 5, assessmentScore: 94, peerRating: 4.9, sessionsTaught: 16, sessionsCompleted: 10 },
      { skill: 'Data Structures', level: 'Intermediate', verified: true, teacherVerified: false, selfRating: 4, assessmentScore: 85, peerRating: 4.7, sessionsTaught: 8, sessionsCompleted: 5 },
      { skill: 'DBMS', level: 'Intermediate', verified: false, teacherVerified: false, selfRating: 4, assessmentScore: 80, peerRating: 4.5, sessionsTaught: 5, sessionsCompleted: 4 },
    ],
    wantToLearn: [
      { skill: 'React', targetLevel: 'Intermediate', initialScore: 35, currentScore: 68 },
      { skill: 'Cybersecurity', targetLevel: 'Beginner', initialScore: 20, currentScore: 30 },
    ],
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Saturday', 'Sunday'],
    availableSlots: ['7 PM – 8 PM', '6 PM – 7 PM'],
    learningPreferences: ['Step-by-step explanation', 'Practical coding', 'Discussion'],
    preferredLanguage: 'English',
    reliabilityScore: 98,
    impactMetrics: {
      studentsHelped: 22,
      sessionsTaught: 29,
      sessionsCompleted: 20,
      avgPeerRating: 4.9,
      learningImprovements: 19,
    },
    badges: ['🏅 Verified Skill', '🎓 Great Mentor', '🌱 Fast Learner', '💡 Problem Solver'],
    isDemo: true,
    profileVisibility: 'matched_peers',
  },
  {
    uid: 'demo-anu',
    email: 'anu.v@college.edu',
    name: 'Anu Varghese',
    nickname: 'Anu',
    college: 'National Institute of Technology',
    course: 'B.Tech',
    branch: 'Computer Science',
    semester: 'Semester 4',
    canTeach: [
      { skill: 'Cybersecurity', level: 'Intermediate', verified: true, teacherVerified: true, selfRating: 4, assessmentScore: 86, peerRating: 4.7, sessionsTaught: 6, sessionsCompleted: 4 },
      { skill: 'C', level: 'Advanced', verified: true, teacherVerified: false, selfRating: 5, assessmentScore: 90, peerRating: 4.8, sessionsTaught: 11, sessionsCompleted: 8 },
    ],
    wantToLearn: [
      { skill: 'Python', targetLevel: 'Intermediate', initialScore: 42, currentScore: 58 },
      { skill: 'UI/UX Design', targetLevel: 'Beginner', initialScore: 30, currentScore: 50 },
    ],
    availableDays: ['Tuesday', 'Wednesday', 'Friday', 'Sunday'],
    availableSlots: ['7 PM – 8 PM', '8 PM – 9 PM'],
    learningPreferences: ['Visual explanation', 'Project-based learning'],
    preferredLanguage: 'English',
    reliabilityScore: 92,
    impactMetrics: {
      studentsHelped: 12,
      sessionsTaught: 17,
      sessionsCompleted: 12,
      avgPeerRating: 4.7,
      learningImprovements: 10,
    },
    badges: ['🏅 Verified Skill', '🤝 Helpful Peer'],
    isDemo: true,
    profileVisibility: 'college_only',
  },
  {
    uid: 'demo-arjun',
    email: 'arjun.k@college.edu',
    name: 'Arjun Kumar',
    nickname: 'Arjun',
    college: 'National Institute of Technology',
    course: 'B.Tech',
    branch: 'Electronics',
    semester: 'Semester 6',
    canTeach: [
      { skill: 'Machine Learning', level: 'Advanced', verified: true, teacherVerified: true, selfRating: 5, assessmentScore: 95, peerRating: 5.0, sessionsTaught: 14, sessionsCompleted: 9 },
      { skill: 'Python', level: 'Advanced', verified: true, teacherVerified: false, selfRating: 5, assessmentScore: 91, peerRating: 4.8, sessionsTaught: 10, sessionsCompleted: 7 },
    ],
    wantToLearn: [
      { skill: 'Cloud Computing', targetLevel: 'Intermediate', initialScore: 30, currentScore: 45 },
      { skill: 'Flutter', targetLevel: 'Beginner', initialScore: 15, currentScore: 30 },
    ],
    availableDays: ['Monday', 'Thursday', 'Saturday'],
    availableSlots: ['6 PM – 7 PM', '7 PM – 8 PM'],
    learningPreferences: ['Problem solving', 'Practical coding'],
    preferredLanguage: 'English',
    reliabilityScore: 95,
    impactMetrics: {
      studentsHelped: 15,
      sessionsTaught: 20,
      sessionsCompleted: 15,
      avgPeerRating: 4.9,
      learningImprovements: 14,
    },
    badges: ['🏅 Verified Skill', '🎓 Great Mentor', '💡 Problem Solver'],
    isDemo: true,
    profileVisibility: 'everyone',
  }
];

export const DEMO_TEACHER: TeacherProfile = {
  uid: 'demo-prof-nair',
  email: 'dr.nair@college.edu',
  name: 'Dr. Suresh Nair',
  college: 'National Institute of Technology',
  department: 'Computer Science & Engineering',
  coursesHandled: ['Data Structures', 'Python Programming', 'Web Technologies'],
  isDemo: true,
};

export const DEMO_SESSIONS: SessionData[] = [
  {
    sessionId: 'session-101',
    mentorUid: 'demo-rahul',
    learnerUid: 'demo-akshaya',
    mentorName: 'Rahul Sharma',
    learnerName: 'Akshaya Menon',
    teachSkill: 'React Components & Hooks',
    learnSkill: 'Python OOP & Lambdas',
    scheduledTime: 'Today, 7:00 PM – 8:00 PM',
    durationMinutes: 60,
    status: 'completed',
    agenda: [
      { timeOffset: '00–05', title: 'Introductions & Goal Alignment', description: 'Quick check-in on today\'s exchange goals.', speaker: 'both' },
      { timeOffset: '05–25', title: 'Rahul Teaches React Hooks', description: 'useState, useEffect, and component lifecycle hands-on.', speaker: 'mentor' },
      { timeOffset: '25–30', title: 'React Mini Quiz', description: '3 quick questions to evaluate React comprehension.', speaker: 'learner' },
      { timeOffset: '30–50', title: 'Akshaya Teaches Python Lambdas', description: 'Functional Python, map/filter, list comprehensions.', speaker: 'learner' },
      { timeOffset: '50–55', title: 'Python Mini Quiz', description: '3 quick questions to test Python concepts.', speaker: 'mentor' },
      { timeOffset: '55–60', title: 'Feedback & Skill Passport Sync', description: 'Exchange reviews and record learning gain.', speaker: 'both' },
    ],
    coveredTopics: [
      { id: 'ct-1', topicName: 'React useState Hook & State Initialization', skill: 'React', updatedByPeer: 'Rahul Sharma', status: 'mastered', notes: 'Demonstrated state updates with counters and input handlers.', updatedAt: 'Just now' },
      { id: 'ct-2', topicName: 'useEffect Dependency Array & Cleanup Functions', skill: 'React', updatedByPeer: 'Rahul Sharma', status: 'covered', notes: 'Learner understood side effects; practice recommended on cleanup functions.', updatedAt: 'Just now' },
      { id: 'ct-3', topicName: 'Python Map, Filter & Anonymous Lambdas', skill: 'Python', updatedByPeer: 'Akshaya Menon', status: 'mastered', notes: 'Akshaya explained inline lambda transformations clearly.', updatedAt: 'Just now' }
    ],
    quiz: [
      { id: 'q1', question: 'What is the primary purpose of useEffect in React?', options: ['To create component state', 'To perform side effects like data fetching or DOM updates', 'To define prop types', 'To render HTML tags'], correctIndex: 1, explanation: 'useEffect handles side effects after rendering.' },
      { id: 'q2', question: 'Which hook should you use to store a persistent value across renders without triggering a re-render?', options: ['useState', 'useMemo', 'useRef', 'useCallback'], correctIndex: 2, explanation: 'useRef stores values without triggering re-renders.' },
      { id: 'q3', question: 'What happens when state changes in a React functional component?', options: ['The browser reloads', 'The component re-renders with new state', 'All props are reset to default', 'The CSS is recompiled'], correctIndex: 1, explanation: 'State updates trigger component re-render.' },
    ],
    beforeScore: 42,
    afterScore: 68,
    learningGain: 26,
    notes: 'Covered React useState & useEffect with practical code snippets. Discussed Python lambda functions and list comprehensions.',
    feedback: {
      rating: 5,
      knowledge: 5,
      explanation: 5,
      communication: 5,
      punctuality: 5,
      helpfulness: 5,
      didHelp: 'yes',
      comment: 'Rahul explained React state management extremely clearly with real-world examples!',
    },
    createdAt: '2026-08-09T18:00:00Z',
  }
];

export const DEMO_DOUBTS: DoubtItem[] = [
  {
    doubtId: 'doubt-1',
    authorUid: 'demo-anu',
    authorName: 'Anu Varghese',
    isAnonymous: false,
    category: 'Database Systems',
    skill: 'DBMS',
    question: 'Can someone explain DBMS 3NF normalization with a simple real-world example?',
    aiAnswer: '3NF (Third Normal Form) requires that a relation is in 2NF and has no transitive dependencies (i.e. non-prime attributes must depend ONLY on the primary key, not on another non-prime attribute). For example, if Student -> Department -> DeptHead, then DeptHead depends transitively on Student. To achieve 3NF, separate Department details into a distinct table!',
    recommendedMentors: [
      { uid: 'demo-akshaya', name: 'Akshaya Menon', skillLevel: 'Intermediate', peerRating: 4.9 },
      { uid: 'demo-rahul', name: 'Rahul Sharma', skillLevel: 'Intermediate', peerRating: 4.8 }
    ],
    status: 'open',
    createdAt: '2 hours ago',
  },
  {
    doubtId: 'doubt-2',
    authorUid: 'student-anon',
    authorName: 'Anonymous Peer',
    isAnonymous: true,
    category: 'Web Development',
    skill: 'React',
    question: 'What is the key difference between props and state in React components?',
    aiAnswer: 'Props are read-only parameters passed down from a parent component to a child component, while state is mutable data managed locally within a component.',
    recommendedMentors: [
      { uid: 'demo-rahul', name: 'Rahul Sharma', skillLevel: 'Advanced', peerRating: 4.9 }
    ],
    status: 'open',
    createdAt: '4 hours ago',
  }
];

export const DEMO_RESOURCES: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'React Hooks Cheat Sheet & Best Practices',
    skill: 'React',
    authorName: 'Rahul Sharma',
    type: 'cheat_sheet',
    url: '#',
    description: 'A 2-page quick reference covering useState, useEffect, useContext, useMemo, and custom hooks with common anti-patterns to avoid.',
    usefulCount: 42,
    createdAt: '3 days ago',
  },
  {
    id: 'res-2',
    title: 'Python Data Structures & Algorithm Notes',
    skill: 'Python',
    authorName: 'Akshaya Menon',
    type: 'notes',
    url: '#',
    description: 'Handwritten typed summary of lists, dicts, tuples, sets, stacks, queues, and tree traversals in clean Python.',
    usefulCount: 38,
    createdAt: '5 days ago',
  },
  {
    id: 'res-3',
    title: 'Cybersecurity Fundamentals & CTF Guide',
    skill: 'Cybersecurity',
    authorName: 'Anu Varghese',
    type: 'project_ref',
    url: '#',
    description: 'Beginner guide for participating in college CTFs (Capture The Flag) including basic cryptography, web security, and network tools.',
    usefulCount: 29,
    createdAt: '1 week ago',
  }
];

export const DEMO_CIRCLES: LearningCircle[] = [
  {
    id: 'circle-1',
    title: 'Full-Stack AI Study Circle',
    topic: 'Building Web Apps with Python & React',
    members: [
      { uid: 'demo-akshaya', name: 'Akshaya Menon', contributingSkill: 'Python Backend' },
      { uid: 'demo-rahul', name: 'Rahul Sharma', contributingSkill: 'React Frontend' },
      { uid: 'demo-arjun', name: 'Arjun Kumar', contributingSkill: 'Machine Learning Model Integration' },
      { uid: 'demo-anu', name: 'Anu Varghese', contributingSkill: 'API Security' },
    ],
    schedule: 'Saturdays, 4:00 PM – 5:30 PM',
    mentorName: 'Dr. Suresh Nair',
  }
];

export const DEMO_CHALLENGES: ChallengeItem[] = [
  {
    id: 'chal-1',
    title: '7-Day Python Peer Challenge',
    duration: '7 Days',
    skill: 'Python',
    participantsCount: 48,
    description: 'Build 1 micro Python script daily with a peer buddy. Swap code reviews every evening!',
    progressPercent: 71,
  },
  {
    id: 'chal-2',
    title: '5-Day React UI Sprint',
    duration: '5 Days',
    skill: 'React',
    participantsCount: 36,
    description: 'Master Tailwind + React components by building responsive widgets alongside your mentor.',
    progressPercent: 40,
  }
];
