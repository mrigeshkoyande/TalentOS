import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  type Query,
  type DocumentData,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Job, Candidate, Shortlist } from '../types'

// ─── Jobs ─────────────────────────────────────────────────────────────────────
export const jobsRef = () => collection(db, 'jobs')
export const jobRef = (id: string) => doc(db, 'jobs', id)

export const createJob = async (data: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
  return addDoc(jobsRef(), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
}

export const getJobs = () => getDocs(query(jobsRef(), orderBy('createdAt', 'desc')))

export const subscribeJobs = (cb: (jobs: Job[]) => void, errCb?: (error: any) => void) =>
  onSnapshot(
    query(jobsRef(), orderBy('createdAt', 'desc')),
    snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Job)),
    err => {
      console.warn("Firestore subscribeJobs failed:", err);
      if (errCb) errCb(err);
    }
  )

export const updateJob = (id: string, data: Partial<Job>) =>
  updateDoc(jobRef(id), { ...data, updatedAt: serverTimestamp() })

// ─── Candidates ───────────────────────────────────────────────────────────────
export const candidatesRef = () => collection(db, 'candidates')

export const createCandidate = async (data: Omit<Candidate, 'id' | 'createdAt'>) =>
  addDoc(candidatesRef(), { ...data, createdAt: serverTimestamp() })

export const subscribeCandidates = (jobId: string, cb: (candidates: Candidate[]) => void, errCb?: (error: any) => void) =>
  onSnapshot(
    query(candidatesRef(), where('jobId', '==', jobId), orderBy('matchScore', 'desc')),
    snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Candidate)),
    err => {
      console.warn("Firestore subscribeCandidates failed:", err);
      if (errCb) errCb(err);
    }
  )

export const subscribeHiddenGems = (jobId: string, cb: (candidates: Candidate[]) => void, errCb?: (error: any) => void) =>
  onSnapshot(
    query(
      candidatesRef(),
      where('jobId', '==', jobId),
      where('isHiddenGem', '==', true),
      orderBy('latentSignalPercent', 'desc')
    ),
    snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Candidate)),
    err => {
      console.warn("Firestore subscribeHiddenGems failed:", err);
      if (errCb) errCb(err);
    }
  )

export const subscribeAllHiddenGems = (cb: (candidates: Candidate[]) => void, errCb?: (error: any) => void) =>
  onSnapshot(
    query(candidatesRef(), where('isHiddenGem', '==', true), orderBy('latentSignalPercent', 'desc')),
    snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Candidate)),
    err => {
      console.warn("Firestore subscribeAllHiddenGems failed:", err);
      if (errCb) errCb(err);
    }
  )

// ─── Shortlists ───────────────────────────────────────────────────────────────
export const shortlistsRef = () => collection(db, 'shortlists')

export const addToShortlist = async (data: Omit<Shortlist, 'id' | 'addedAt'>) =>
  addDoc(shortlistsRef(), { ...data, addedAt: serverTimestamp() })

export const removeFromShortlist = (id: string) => deleteDoc(doc(db, 'shortlists', id))

export const subscribeShortlists = (userId: string, cb: (items: Shortlist[]) => void, errCb?: (error: any) => void) =>
  onSnapshot(
    query(shortlistsRef(), where('addedBy', '==', userId), orderBy('addedAt', 'desc')),
    snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Shortlist)),
    err => {
      console.warn("Firestore subscribeShortlists failed:", err);
      if (errCb) errCb(err);
    }
  )

