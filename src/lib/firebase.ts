import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  Firestore
} from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';
import { StudentProfile, TeacherProfile, SessionData, DoubtItem } from '../types';
import { DEMO_STUDENTS, DEMO_SESSIONS, DEMO_DOUBTS } from '../data/demoData';

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfigData);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  // Use custom firestore database ID if defined in firebase-applet-config.json
  if (firebaseConfigData.firestoreDatabaseId) {
    db = getFirestore(app, firebaseConfigData.firestoreDatabaseId);
  } else {
    db = getFirestore(app);
  }
} catch (error) {
  console.warn('Firebase initialization error, fallback to local state:', error);
}

export { auth, db };

// Safe Firestore Helper Functions
export async function saveStudentProfile(profile: StudentProfile) {
  try {
    if (db && profile.uid) {
      await setDoc(doc(db, 'student_profiles', profile.uid), profile, { merge: true });
    }
  } catch (err) {
    console.warn('Could not save profile to Firestore:', err);
  }
}

export async function fetchStudentProfile(uid: string): Promise<StudentProfile | null> {
  try {
    if (db) {
      const docRef = doc(db, 'student_profiles', uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as StudentProfile;
      }
    }
  } catch (err) {
    console.warn('Could not fetch profile from Firestore:', err);
  }
  // Check demo match
  const demoMatch = DEMO_STUDENTS.find(s => s.uid === uid);
  return demoMatch || null;
}

export async function fetchAllStudents(): Promise<StudentProfile[]> {
  try {
    if (db) {
      const colRef = collection(db, 'student_profiles');
      const snap = await getDocs(colRef);
      const list = snap.docs.map(d => d.data() as StudentProfile);
      if (list.length > 0) {
        return list;
      }
    }
  } catch (err) {
    console.warn('Could not fetch all students from Firestore:', err);
  }
  return DEMO_STUDENTS;
}

export async function saveSessionData(session: SessionData) {
  try {
    if (db && session.sessionId) {
      await setDoc(doc(db, 'sessions', session.sessionId), session, { merge: true });
    }
  } catch (err) {
    console.warn('Could not save session to Firestore:', err);
  }
}

export async function fetchUserSessions(uid: string): Promise<SessionData[]> {
  try {
    if (db) {
      const colRef = collection(db, 'sessions');
      const snap = await getDocs(colRef);
      const userSessions = snap.docs
        .map(d => d.data() as SessionData)
        .filter(s => s.mentorUid === uid || s.learnerUid === uid);
      if (userSessions.length > 0) return userSessions;
    }
  } catch (err) {
    console.warn('Could not fetch user sessions:', err);
  }
  return DEMO_SESSIONS.filter(s => s.mentorUid === uid || s.learnerUid === uid);
}

export async function saveDoubtItem(doubt: DoubtItem) {
  try {
    if (db && doubt.doubtId) {
      await setDoc(doc(db, 'doubts', doubt.doubtId), doubt, { merge: true });
    }
  } catch (err) {
    console.warn('Could not save doubt item:', err);
  }
}

export async function fetchAllDoubts(): Promise<DoubtItem[]> {
  try {
    if (db) {
      const colRef = collection(db, 'doubts');
      const snap = await getDocs(colRef);
      const list = snap.docs.map(d => d.data() as DoubtItem);
      if (list.length > 0) return list;
    }
  } catch (err) {
    console.warn('Could not fetch doubts:', err);
  }
  return DEMO_DOUBTS;
}
