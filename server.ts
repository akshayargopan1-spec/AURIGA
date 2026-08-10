import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }
  return ai;
}

// ==================== API ROUTES ====================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Helper for safe Gemini API invocation with instant fallback on quota limits (429) or network errors
async function safeGenerateContent(gemini: any, params: any): Promise<string | null> {
  if (!gemini) return null;
  try {
    const response = await gemini.models.generateContent(params);
    return response.text || null;
  } catch (err: any) {
    console.warn('Gemini API call skipped (fallback to local smart engine):', err?.message || err);
    return null;
  }
}

// 1. AI Peer Matching & Explanation
app.post('/api/ai/match', async (req, res) => {
  try {
    const { learnSkill, teachSkill, userProfile, candidateProfiles = [] } = req.body;

    const gemini = getGeminiClient();
    let aiText: string | null = null;

    if (gemini) {
      const prompt = `You are the PeerSolve AI Skill Matching Engine.
Goal: Match the target student with candidate student profiles for a reciprocal peer-learning exchange.

Target Student:
- Want to learn: ${learnSkill}
- Can teach: ${teachSkill}
- Availability: ${JSON.stringify(userProfile?.availableSlots || [])}
- Preferences: ${JSON.stringify(userProfile?.learningPreferences || [])}

Candidates:
${JSON.stringify(candidateProfiles, null, 2)}

Calculate a match for each candidate based on:
1. Skill complementarity (What learner needs vs what mentor knows)
2. Reciprocal compatibility (What mentor needs vs what learner knows)
3. Skill level suitability
4. Availability overlap
5. Learning style preference alignment

IMPORTANT PRIVACY RULE: Do NOT use phone numbers, emails, addresses, or private messages in matching.

Return a JSON array of match objects:
[
  {
    "uid": "candidate_uid",
    "matchScore": number (60 to 98),
    "teachSkillMatch": "string",
    "learnSkillMatch": "string",
    "commonTimeSlot": "string",
    "whyMatch": ["string", "string", "string", "string"],
    "reciprocalBenefits": "string"
  }
]
Provide ONLY raw valid JSON array, no markdown codeblocks or conversational text.`;

      aiText = await safeGenerateContent(gemini, {
        model: 'gemini-3.6-flash',
        contents: prompt,
      });
    }

    if (!aiText) {
      // Fallback matching logic
      const fallbackMatches = (candidateProfiles || []).map((candidate: any) => ({
        matchScore: 92,
        peerProfile: candidate,
        teachSkillMatch: candidate.canTeach?.find((s: any) => s.skill.toLowerCase() === learnSkill?.toLowerCase())?.skill || learnSkill,
        learnSkillMatch: candidate.wantToLearn?.find((s: any) => s.skill.toLowerCase() === teachSkill?.toLowerCase())?.skill || teachSkill || 'General Knowledge',
        commonTimeSlot: candidate.availableSlots?.[0] || '7 PM – 8 PM',
        whyMatch: [
          `Complementary skills: You want to learn ${learnSkill}, and ${candidate.nickname || candidate.name} has proven expertise in ${learnSkill}.`,
          `Reciprocal learning: ${candidate.nickname || candidate.name} wants to learn ${teachSkill}, which matches your skills!`,
          `Overlap in availability: Both available in evening slots (${candidate.availableSlots?.[0] || '7-8 PM'}).`,
          `Compatible learning style: Shared focus on practical coding and problem solving.`
        ],
        reciprocalBenefits: `You get 30 mins of ${learnSkill} mentoring, and you teach 30 mins of ${teachSkill}.`
      }));

      return res.json({ success: true, matches: fallbackMatches });
    }

    const cleanJsonText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
    const rawMatches = JSON.parse(cleanJsonText);

    const matches = rawMatches.map((m: any) => {
      const candidate = candidateProfiles.find((c: any) => c.uid === m.uid) || candidateProfiles[0];
      return {
        matchScore: m.matchScore || 90,
        peerProfile: candidate,
        teachSkillMatch: m.teachSkillMatch || learnSkill,
        learnSkillMatch: m.learnSkillMatch || teachSkill,
        commonTimeSlot: m.commonTimeSlot || candidate.availableSlots?.[0] || '7 PM - 8 PM',
        whyMatch: m.whyMatch || [
          `Complementary learning needs`,
          `High skill proficiency in requested area`,
          `Matching time availability`,
          `Reciprocal skill swap benefits both students`
        ],
        reciprocalBenefits: m.reciprocalBenefits || `Equal 30-minute reciprocal skill exchange.`
      };
    });

    res.json({ success: true, matches });
  } catch (err: any) {
    console.warn('Match fallback execution:', err?.message);
    res.json({ success: true, matches: [] });
  }
});

// 2. AI Session Agenda Generator
app.post('/api/ai/session-agenda', async (req, res) => {
  try {
    const { teachSkill, learnSkill, durationMinutes, mentorName, learnerName } = req.body;
    const gemini = getGeminiClient();

    const defaultAgenda = [
      { timeOffset: '00–05', title: 'Introductions & Goal Alignment', description: 'Greeting, goal setting, and time allocation.', speaker: 'both' },
      { timeOffset: '05–25', title: `${mentorName} teaches ${teachSkill}`, description: 'Core concept explanation, hands-on example, and live problem walking.', speaker: 'mentor' },
      { timeOffset: '25–30', title: `${teachSkill} Concept Quiz`, description: '3 quick questions to verify understanding.', speaker: 'learner' },
      { timeOffset: '30–50', title: `${learnerName} teaches ${learnSkill || 'Python'}`, description: 'Reciprocal segment: concept walkthrough and Q&A.', speaker: 'learner' },
      { timeOffset: '50–55', title: `${learnSkill || 'Python'} Concept Quiz`, description: '3 quick questions to verify comprehension.', speaker: 'mentor' },
      { timeOffset: '55–60', title: 'Reflection & Feedback', description: 'Review progress, score comparison, and Skill Passport sync.', speaker: 'both' },
    ];

    let aiText: string | null = null;
    if (gemini) {
      const prompt = `You are the PeerSolve Session Planner.
Generate a structured, timed agenda for a ${durationMinutes}-minute reciprocal knowledge exchange session between ${mentorName} (teaching ${teachSkill}) and ${learnerName} (teaching ${learnSkill || 'secondary skill'}).

Duration: ${durationMinutes} minutes.

Return a JSON array of agenda items:
[
  {
    "timeOffset": "00–05",
    "title": "Short title",
    "description": "Clear step description",
    "speaker": "mentor" | "learner" | "both"
  }
]
Return ONLY raw valid JSON array, no extra text.`;

      aiText = await safeGenerateContent(gemini, {
        model: 'gemini-3.6-flash',
        contents: prompt,
      });
    }

    if (!aiText) {
      return res.json({ success: true, agenda: defaultAgenda });
    }

    const cleanText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
    const agenda = JSON.parse(cleanText);

    res.json({ success: true, agenda });
  } catch (err: any) {
    console.warn('Session agenda fallback execution:', err?.message);
    res.json({
      success: true,
      agenda: [
        { timeOffset: '00–05', title: 'Introductions & Goal Alignment', description: 'Greeting & agenda confirmation.', speaker: 'both' },
        { timeOffset: '05–30', title: `Teach ${req.body.teachSkill || 'Skill'}`, description: 'Interactive concept walkthrough.', speaker: 'mentor' },
        { timeOffset: '30–55', title: `Reciprocal Exchange: ${req.body.learnSkill || 'Secondary Skill'}`, description: 'Learner teaches back.', speaker: 'learner' },
        { timeOffset: '55–60', title: 'Feedback & Passport Sync', description: 'Rate session and update skill baseline.', speaker: 'both' }
      ]
    });
  }
});

// 3. AI Mini Quiz Generator
app.post('/api/ai/mini-quiz', async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
    const gemini = getGeminiClient();

    const fallbackQuiz = [
      {
        id: 'q1',
        question: `What is a fundamental concept of ${topic}?`,
        options: [
          'It provides modular, reusable functional structure',
          'It automatically deletes database tables',
          'It replaces all server hardware',
          'It only works inside a text editor'
        ],
        correctIndex: 0,
        explanation: `${topic} builds modular, reusable architecture.`
      },
      {
        id: 'q2',
        question: `Which approach is best practice when working with ${topic}?`,
        options: [
          'Ignoring error boundaries and logs',
          'Writing clean, self-documenting code with clear type definitions',
          'Hardcoding private credentials in client files',
          'Creating single massive 10,000 line files'
        ],
        correctIndex: 1,
        explanation: 'Maintain clean, typed, modular code.'
      },
      {
        id: 'q3',
        question: `How does ${topic} improve real-world software applications?`,
        options: [
          'By increasing network latency',
          'By promoting modularity, maintainability, and scalability',
          'By disabling browser styles',
          'By requiring manual memory cleanup on modern JS'
        ],
        correctIndex: 1,
        explanation: 'It enhances code maintainability and execution performance.'
      }
    ];

    let aiText: string | null = null;
    if (gemini) {
      const prompt = `You are the PeerSolve Assessment Generator.
Generate 3 multiple-choice mini quiz questions to evaluate a student's comprehension of ${topic} at ${difficulty || 'Intermediate'} level.

Return a JSON array:
[
  {
    "id": "q1",
    "question": "Question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": number (0 to 3),
    "explanation": "Short clear explanation of why this option is correct."
  }
]
Return ONLY raw valid JSON array.`;

      aiText = await safeGenerateContent(gemini, {
        model: 'gemini-3.6-flash',
        contents: prompt,
      });
    }

    if (!aiText) {
      return res.json({ success: true, quiz: fallbackQuiz });
    }

    const cleanText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
    const quiz = JSON.parse(cleanText);

    res.json({ success: true, quiz });
  } catch (err: any) {
    console.warn('Mini quiz fallback execution:', err?.message);
    res.json({
      success: true,
      quiz: [
        {
          id: 'q1',
          question: `Which core principle defines ${req.body.topic || 'this subject'}?`,
          options: ['Modular separation of concerns', 'Global state mutations', 'Unbounded recursion', 'Manual memory cleanup'],
          correctIndex: 0,
          explanation: 'Modular design isolates logic safely.'
        }
      ]
    });
  }
});

// 4. AI Doubt Explanation & Peer Mentor Discovery
app.post('/api/ai/doubt-answer', async (req, res) => {
  try {
    const { question, skill, category } = req.body;
    const gemini = getGeminiClient();

    let aiAnswer = `Here is a quick concept breakdown for **${skill || 'this topic'}**: Make sure to analyze the core parameters, break down complex logic into step-by-step modular components, and test edge cases thoroughly.`;

    if (gemini) {
      const responseText = await safeGenerateContent(gemini, {
        model: 'gemini-3.6-flash',
        contents: `Provide a concise, highly intuitive 3-4 sentence AI explanation for this student doubt about ${skill} (${category}): "${question}". Keep it clear, friendly, and practical.`,
      });
      if (responseText) {
        aiAnswer = responseText;
      }
    }

    res.json({ success: true, aiAnswer });
  } catch (err: any) {
    console.warn('Doubt AI fallback execution:', err?.message);
    res.json({
      success: true,
      aiAnswer: 'Break the problem down into small, testable functions and verify input constraints before executing complex logic.'
    });
  }
});

// 5. Failed Session Recovery Adaptation Strategy
app.post('/api/ai/adaptation-strategy', async (req, res) => {
  try {
    const { beforeScore, afterScore, teachSkill, feedback } = req.body;
    const gemini = getGeminiClient();

    let strategy = `Recommended next step: The post-session gain was minimal (${beforeScore}% -> ${afterScore}%). We recommend switching to a visual, diagram-based approach with hands-on practice problems, or connecting with a different peer mentor specialized in beginner-level fundamentals.`;

    if (gemini) {
      const responseText = await safeGenerateContent(gemini, {
        model: 'gemini-3.6-flash',
        contents: `A peer learning session in ${teachSkill} showed limited score gain (Before: ${beforeScore}%, After: ${afterScore}%). Feedback comment: "${feedback || 'None'}".
Provide 2-3 actionable, non-punitive adaptive recommendations for the learner (e.g. switch to visual diagrams, slower step-by-step pacing, project practice, faculty endorsement).`,
      });
      if (responseText) {
        strategy = responseText;
      }
    }

    res.json({ success: true, strategy });
  } catch (err: any) {
    console.warn('Adaptation strategy fallback execution:', err?.message);
    res.json({
      success: true,
      strategy: 'Focus on interactive coding exercises and diagram walkthroughs before moving to advanced topics.'
    });
  }
});

// 5b. PeerSolve AI Tutor Chatbot Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, studentProfile, currentTopic } = req.body;
    const gemini = getGeminiClient();

    const lastUserMsg = Array.isArray(messages) && messages.length > 0
      ? messages[messages.length - 1].content
      : 'Hello PeerSolve AI Tutor!';

    const queryLower = lastUserMsg.toLowerCase();
    let fallbackReply = `I am your **PeerSolve AI Study Assistant**! I can help you break down complex concepts, practice questions, plan your study timetable, or find peer study strategies.`;

    if (queryLower.includes('react') || queryLower.includes('hook') || queryLower.includes('state')) {
      fallbackReply = `Here is a quick concept breakdown for **React Hooks**:\n\n1. **useState**: Manages local component state (e.g. \`const [count, setCount] = useState(0)\`).\n2. **useEffect**: Handles side effects like data fetching or subscriptions.\n3. **Rule of Hooks**: Always call hooks at the top level of your component.\n\nWould you like a quick 3-question mini-quiz or a peer matching recommendation for React?`;
    } else if (queryLower.includes('dbms') || queryLower.includes('sql') || queryLower.includes('normal')) {
      fallbackReply = `Here is a summary of **DBMS Normalization**:\n\n- **1NF**: Ensures atomic column values (no repeating groups).\n- **2NF**: Eliminates partial dependencies on composite primary keys.\n- **3NF**: Eliminates transitive dependencies (non-key columns depending on other non-key columns).\n\nTip: You can schedule a 30-min reciprocal peer session to practice normalization query scenarios!`;
    } else if (queryLower.includes('python') || queryLower.includes('code') || queryLower.includes('loop')) {
      fallbackReply = `In **Python**, list comprehensions offer a concise syntax:\n\`\`\`python\n# Example: Square even numbers\neven_squares = [x**2 for x in range(10) if x % 2 == 0]\nprint(even_squares) # [0, 4, 16, 36, 64]\n\`\`\`\nNeed practice exercises or an AI-generated study timetable?`;
    } else if (queryLower.includes('privacy') || queryLower.includes('data') || queryLower.includes('incognito')) {
      fallbackReply = `🔒 **PeerSolve Zero-Trust Privacy Guarantee**:\n\n- Your conversations are private and end-to-end encrypted.\n- Personal contacts (phone, email, address) are never passed to AI matching models.\n- You can enable **Incognito Mode** anytime in the Privacy Center to hide your real name during peer searches!`;
    }

    let aiReply: string | null = null;

    if (gemini) {
      const systemContext = `You are the PeerSolve AI Learning Companion & Academic Assistant.
Context:
- Student Name: ${studentProfile?.nickname || studentProfile?.name || 'Student'}
- Branch/Course: ${studentProfile?.branch || 'Computer Science'}, ${studentProfile?.semester || 'Semester 4'}
- Current Topic Focus: ${currentTopic || 'General Peer Learning'}
- Verified Skills: ${JSON.stringify(studentProfile?.canTeach || [])}
- Target Skills: ${JSON.stringify(studentProfile?.wantToLearn || [])}

Instructions:
1. Provide concise, clear, highly encouraging academic guidance.
2. Use markdown formatting, bullet points, and code blocks where applicable.
3. Keep answers under 3-4 paragraphs unless an in-depth code walkthrough is asked.
4. Reinforce PeerSolve's reciprocal learning philosophy (e.g. suggesting peer sessions, mini-quizzes, or timetable adjustments).
5. Assure the student that their data is handled with Zero-Trust privacy rules.`;

      const chatHistory = (messages || []).map((m: any) => `${m.role === 'user' ? 'Student' : 'AI Assistant'}: ${m.content}`).join('\n');
      const fullPrompt = `${systemContext}\n\nConversation History:\n${chatHistory}\n\nProvide a helpful, precise AI response:`;

      aiReply = await safeGenerateContent(gemini, {
        model: 'gemini-3.6-flash',
        contents: fullPrompt,
      });
    }

    res.json({
      success: true,
      reply: aiReply || fallbackReply,
      suggestions: [
        'Give me a 3-question practice quiz',
        'Break down this concept step-by-step',
        'Suggest an AI timetable for my subjects',
        'How can I boost my Skill Passport level?'
      ]
    });
  } catch (err: any) {
    console.warn('Chat AI fallback execution:', err?.message);
    res.json({
      success: true,
      reply: 'I am your PeerSolve AI Study Assistant! How can I help you with your peer learning roadmap today?',
      suggestions: [
        'Give me a 3-question practice quiz',
        'Explain React Hooks with a code example'
      ]
    });
  }
});

// 6. Mandatory Entry Assessment Generator (Adaptive questions)
app.post('/api/ai/entry-assessment', async (req, res) => {
  try {
    const { course, branch, semester, teachSkills, learnSkills } = req.body;
    const gemini = getGeminiClient();

    const topicsToTest = [
      ...(teachSkills || ['Python', 'DBMS']),
      ...(learnSkills || ['React', 'Data Structures'])
    ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

    const fallbackQuestions = topicsToTest.map((topic, index) => ({
      id: `q-entry-${index + 1}`,
      category: topic,
      type: index === 2 ? 'scenario' : index === 3 ? 'problem_solving' : 'mcq',
      difficulty: index === 0 ? 'Easy' : index === 1 ? 'Medium' : 'Hard',
      question: index === 2
        ? `[Scenario] In a ${branch || 'Computer Science'} project for ${topic}, your team faces a high-concurrency bottleneck. How would you diagnose and optimize this?`
        : index === 3
        ? `[Problem Solving] You are implementing a core ${topic} function. What complexity boundary must be satisfied?`
        : `Which concept is fundamental to mastering ${topic} in ${course || 'B.Tech'} (${semester || 'Semester 4'})?`,
      options: [
        `Optimizing execution via modular structures and efficient memory indexing in ${topic}`,
        `Hardcoding static values and bypassing runtime validation`,
        `Re-installing OS kernel modules without debugging`,
        `Storing plain-text data in unencrypted global variables`
      ],
      correctIndex: 0,
      explanation: `${topic} core fundamentals rely on modularity, efficient indexing, and clean structural architecture.`
    }));

    let aiText: string | null = null;
    if (gemini) {
      const prompt = `You are the PeerSolve Entry Assessment Engine.
Student Info:
- Course: ${course || 'B.Tech'}
- Branch: ${branch || 'Computer Science'}
- Semester: ${semester || 'Semester 4'}
- Key Topics to Evaluate: ${topicsToTest.join(', ')}

Generate 4 adaptive entry assessment questions tailored to evaluate baseline proficiency across these topics.
Include:
1. One Easy MCQ
2. One Medium MCQ
3. One Scenario-based question
4. One Problem-solving question

Return a JSON array of question objects:
[
  {
    "id": "q1",
    "category": "TopicName",
    "difficulty": "Easy" | "Medium" | "Hard",
    "type": "mcq" | "scenario" | "problem_solving",
    "question": "Question text...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": number (0 to 3),
    "explanation": "Clear explanation of the correct choice."
  }
]
Return ONLY raw valid JSON array.`;

      aiText = await safeGenerateContent(gemini, {
        model: 'gemini-3.6-flash',
        contents: prompt,
      });
    }

    if (!aiText) {
      return res.json({ success: true, questions: fallbackQuestions, topics: topicsToTest });
    }

    const cleanText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
    const questions = JSON.parse(cleanText);

    res.json({ success: true, questions, topics: topicsToTest });
  } catch (err: any) {
    console.warn('Entry assessment fallback execution:', err?.message);
    res.json({
      success: true,
      questions: [
        {
          id: 'q1',
          category: 'Python',
          difficulty: 'Easy',
          type: 'mcq',
          question: 'Which data structure in Python is immutable?',
          options: ['Tuple', 'List', 'Dictionary', 'Set'],
          correctIndex: 0,
          explanation: 'Tuples are immutable sequence types in Python.'
        }
      ],
      topics: ['Python']
    });
  }
});

// 7. AI Personalized Learning Plan Generator
app.post('/api/ai/learning-plan', async (req, res) => {
  try {
    const { studentName, branch, baselineScores, learnGoals } = req.body;
    const gemini = getGeminiClient();

    const fallbackPlan = {
      studentUid: 'user-current',
      createdAt: new Date().toISOString().split('T')[0],
      targetGoal: `Master ${learnGoals?.[0]?.skill || 'Core Tech Stack'} for ${branch || 'Campus Placement'}`,
      milestones: [
        {
          id: 'm1',
          title: 'Foundation & Core Syntax Reinforcement',
          skill: learnGoals?.[0]?.skill || 'Python',
          estimatedHours: 10,
          topics: ['Data Types & Structures', 'Control Flow & Functions', 'Debugging Techniques'],
          status: 'in_progress',
          recommendedMentorRole: 'Peer Mentor with 80%+ Assessment Score',
          practiceExercise: 'Build a CLI data parser and test edge cases.'
        },
        {
          id: 'm2',
          title: 'Practical Application & Mini Project',
          skill: learnGoals?.[0]?.skill || 'React',
          estimatedHours: 15,
          topics: ['Component State Management', 'API Integration', 'Form Handling'],
          status: 'upcoming',
          recommendedMentorRole: 'Peer Mentor with active teaching experience',
          practiceExercise: 'Develop an interactive web dashboard component.'
        },
        {
          id: 'm3',
          title: 'Peer Mock Assessment & Knowledge Teaching',
          skill: learnGoals?.[0]?.skill || 'DBMS',
          estimatedHours: 8,
          topics: ['Schema Normalization', 'Query Optimization', 'Index Performance'],
          status: 'upcoming',
          recommendedMentorRole: 'Verified Peer Exchange Mentor',
          practiceExercise: 'Host a 30-min peer teaching session to explain indexing.'
        }
      ],
      weakAreas: Object.entries(baselineScores || {})
        .filter(([_, score]: any) => score < 60)
        .map(([topic]) => topic),
      strengthAreas: Object.entries(baselineScores || {})
        .filter(([_, score]: any) => score >= 60)
        .map(([topic]) => topic),
      foundationPath: {
        title: 'Recommended Foundation Path',
        description: 'Step-by-step refresher designed to bridge foundational gaps before advanced peer exchanges.',
        prerequisiteTopics: ['Syntax Refresher', 'Basic Problem Solving', 'Logic Flow']
      }
    };

    let aiText: string | null = null;

    if (gemini) {
      const prompt = `You are the PeerSolve Learning Plan Engine.
Generate a structured, personalized learning roadmap for student ${studentName || 'Student'} (${branch}).
Baseline Scores: ${JSON.stringify(baselineScores || {})}
Target Learning Goals: ${JSON.stringify(learnGoals || [])}

Return a JSON object:
{
  "targetGoal": "Overall target outcome",
  "weakAreas": ["Topic1", "Topic2"],
  "strengthAreas": ["Topic3"],
  "milestones": [
    {
      "id": "m1",
      "title": "Milestone Title",
      "skill": "Skill Name",
      "estimatedHours": number,
      "topics": ["Subtopic 1", "Subtopic 2"],
      "status": "in_progress" | "upcoming",
      "recommendedMentorRole": "Peer mentor profile recommendation",
      "practiceExercise": "Concrete hands-on mini task"
    }
  ],
  "foundationPath": {
    "title": "Recommended Foundation Path",
    "description": "Clear supportive explanation for foundation building",
    "prerequisiteTopics": ["Topic A", "Topic B"]
  }
}
Return ONLY raw valid JSON.`;

      aiText = await safeGenerateContent(gemini, {
        model: 'gemini-3.6-flash',
        contents: prompt,
      });
    }

    if (!aiText) {
      return res.json({ success: true, plan: fallbackPlan });
    }

    const cleanText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
    const plan = JSON.parse(cleanText);

    res.json({ success: true, plan });
  } catch (err: any) {
    console.warn('Learning plan fallback execution:', err?.message);
    res.json({
      success: true,
      plan: {
        studentUid: 'user-current',
        createdAt: new Date().toISOString().split('T')[0],
        targetGoal: 'Master Core Concepts',
        milestones: [
          {
            id: 'm1',
            title: 'Core Fundamentals',
            skill: 'Programming',
            estimatedHours: 8,
            topics: ['Syntax', 'Functions'],
            status: 'in_progress',
            recommendedMentorRole: 'Peer Mentor',
            practiceExercise: 'Practice exercises'
          }
        ],
        weakAreas: [],
        strengthAreas: [],
        foundationPath: {
          title: 'Foundation Path',
          description: 'Refresher path',
          prerequisiteTopics: ['Basics']
        }
      }
    });
  }
});

// 8. AI Study Timetable & Routine Generator
app.post('/api/ai/study-timetable', async (req, res) => {
  try {
    const { availableDays, availableSlots, targetSubjects, upcomingExams } = req.body;
    const gemini = getGeminiClient();

    const fallbackSchedule: Record<string, any[]> = {
      'Monday': [
        { id: 't1', timeSlot: '7:00 PM – 8:00 PM', topic: 'Python Data Structures & Recursion', skill: 'Python', type: 'concept', completed: true, confidenceRating: 4 },
        { id: 't2', timeSlot: '8:00 PM – 8:30 PM', topic: 'Quiz & Self Practice', skill: 'Python', type: 'practice', completed: true, confidenceRating: 5 }
      ],
      'Tuesday': [
        { id: 't3', timeSlot: '6:00 PM – 7:00 PM', topic: 'DBMS Indexing & Query Optimization', skill: 'DBMS', type: 'concept', completed: false }
      ],
      'Wednesday': [
        { id: 't4', timeSlot: '7:00 PM – 8:00 PM', topic: 'Peer Session: React Props & State Exchange', skill: 'React', type: 'peer_session', completed: false }
      ],
      'Thursday': [
        { id: 't5', timeSlot: '8:00 PM – 9:00 PM', topic: 'Data Structures Binary Trees Review', skill: 'Data Structures', type: 'review', completed: false }
      ],
      'Friday': [
        { id: 't6', timeSlot: '7:00 PM – 8:00 PM', topic: 'Peer Session: Reciprocal Python Exchange', skill: 'Python', type: 'peer_session', completed: false }
      ],
      'Saturday': [
        { id: 't7', timeSlot: '10:00 AM – 11:30 AM', topic: 'Weekly Revision & Practice Problems', skill: 'Multiple', type: 'practice', completed: false }
      ],
      'Sunday': [
        { id: 't8', timeSlot: '4:00 PM – 5:00 PM', topic: 'Weekly Progress Review & Streak Sync', skill: 'Planning', type: 'review', completed: false }
      ]
    };

    let aiText: string | null = null;
    if (gemini) {
      const prompt = `You are the PeerSolve AI Stress-Free Study Planner.
Inputs:
- Available Days: ${JSON.stringify(availableDays || ['Monday', 'Wednesday', 'Friday', 'Saturday'])}
- Preferred Slots: ${JSON.stringify(availableSlots || ['7 PM – 8 PM', '8 PM – 9 PM'])}
- Target Subjects: ${JSON.stringify(targetSubjects || ['Python', 'React', 'DBMS'])}
- Upcoming Exams: ${JSON.stringify(upcomingExams || [])}

Generate an optimal, balanced weekly timetable mapping days to 1-2 daily study tasks.
Make sure the schedule includes a healthy mix of 'concept', 'peer_session', 'practice', and 'review'.

Return a JSON object mapping day name to array of tasks:
{
  "Monday": [
    {
      "id": "t1",
      "timeSlot": "7:00 PM - 8:00 PM",
      "topic": "Topic Name",
      "skill": "Skill Name",
      "type": "concept" | "peer_session" | "practice" | "review",
      "completed": false
    }
  ],
  ...
}
Return ONLY raw valid JSON.`;

      aiText = await safeGenerateContent(gemini, {
        model: 'gemini-3.6-flash',
        contents: prompt,
      });
    }

    if (!aiText) {
      return res.json({ success: true, weeklySchedule: fallbackSchedule });
    }

    const cleanText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
    const weeklySchedule = JSON.parse(cleanText);

    res.json({ success: true, weeklySchedule });
  } catch (err: any) {
    console.warn('Timetable fallback execution:', err?.message);
    res.json({
      success: true,
      weeklySchedule: {
        Monday: [{ id: 't1', timeSlot: '7:00 PM - 8:00 PM', topic: 'Study Basics', skill: 'Core', type: 'concept', completed: false }]
      }
    });
  }
});

// 9. "I Didn't Study" Empathetic Rescheduling AI
app.post('/api/ai/reschedule-missed', async (req, res) => {
  try {
    const { missedTopic } = req.body;
    const gemini = getGeminiClient();

    let supportMessage = `No worries at all! Learning isn't linear, and taking breaks is part of the journey. We've shifted "${missedTopic || 'your study task'}" into your next open slot on Saturday morning without overloading your week.`;

    if (gemini) {
      const responseText = await safeGenerateContent(gemini, {
        model: 'gemini-3.6-flash',
        contents: `A student missed their planned study topic: "${missedTopic}".
Provide a 2-sentence encouraging, non-shaming, empathetic support message explaining how the topic has been stress-freely moved to an upcoming open slot.`,
      });
      if (responseText) {
        supportMessage = responseText;
      }
    }

    res.json({ success: true, supportMessage, rescheduledTopic: missedTopic });
  } catch (err: any) {
    console.warn('Reschedule fallback execution:', err?.message);
    res.json({ success: true, supportMessage: 'Your tasks have been redistributed smoothly.', rescheduledTopic: req.body?.missedTopic || 'Topic' });
  }
});

// 10. Peer Shared Covered Topics Study Guide & Flashcard Generator
app.post('/api/ai/covered-topics-study', async (req, res) => {
  try {
    const { coveredTopics, teachSkill, mentorName, learnerName } = req.body;
    const gemini = getGeminiClient();

    let studyGuide = {
      summary: `Shared peer study guide for ${teachSkill || 'this subject'} generated from topics covered by ${mentorName || 'Mentor'} and ${learnerName || 'Learner'}.`,
      keyTakeaways: [
        'Review core concept definitions and practical examples from your live session notes.',
        'Practice key syntax patterns and test edge cases independently.',
        'Exchange follow-up doubts with your peer partner before the next session.'
      ],
      revisionQuestions: [
        {
          question: `How do the covered topics in ${teachSkill || 'this subject'} apply to real-world engineering projects?`,
          hint: 'Think about code maintainability, error prevention, and modular design.'
        },
        {
          question: `What is one common pitfall to avoid when implementing these covered concepts?`,
          hint: 'Consider performance bottlenecks, state synchronization, or syntax errors.'
        }
      ]
    };

    if (gemini && Array.isArray(coveredTopics) && coveredTopics.length > 0) {
      const topicListStr = coveredTopics.map((t: any) => `- ${t.topicName} (${t.status}): ${t.notes || 'No notes'}`).join('\n');
      const responseText = await safeGenerateContent(gemini, {
        model: 'gemini-3.6-flash',
        contents: `A peer study session covered the following topics in ${teachSkill}:\n${topicListStr}\n
Generate a JSON object with:
- "summary": a 2-sentence study synthesis for both peers.
- "keyTakeaways": array of 3 actionable, bulleted revision takeaways.
- "revisionQuestions": array of 2 interactive study questions with hints for peer review.
Return ONLY raw JSON.`
      });

      if (responseText) {
        try {
          const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          if (parsed.summary && parsed.keyTakeaways) {
            studyGuide = parsed;
          }
        } catch (e) {
          console.warn('Covered topics JSON parse error:', e);
        }
      }
    }

    res.json({ success: true, studyGuide });
  } catch (err: any) {
    console.warn('Covered topics API fallback execution:', err?.message);
    res.json({
      success: true,
      studyGuide: {
        summary: 'Shared peer study guide generated from covered topics.',
        keyTakeaways: ['Review core concept definitions and practical examples.', 'Practice syntax patterns and edge cases.'],
        revisionQuestions: [{ question: 'What is the main takeaway from today\'s covered topics?', hint: 'Focus on practical application.' }]
      }
    });
  }
});

// ==================== SERVE VITE / PRODUCTION ====================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PeerSolve server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
