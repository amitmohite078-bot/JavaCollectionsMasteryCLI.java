import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GlobalView, TabId, TelemetryLog, TopicId } from '../types/collections';

export interface ArrayListState {
  items: string[];
  capacity: number;
  highlightIndex: number | null;
  shiftedIndices: number[];
  isGrowing: boolean;
  growFrom: number;
  growTo: number;
}

export interface LinkedListNode {
  id: string;
  val: string;
  address: string;
}

export interface LinkedListState {
  nodes: LinkedListNode[];
  highlightId: string | null;
  unlinkingId: string | null;
  isLinkingHead: boolean;
  isLinkingTail: boolean;
}

export interface HashBucketNode {
  key: string;
  hash: number;
  spreadHash: number;
  val?: number;
}

export interface HashBucket {
  index: number;
  nodes: HashBucketNode[];
  isTreeified: boolean;
}

export interface HashSetState {
  elements: string[];
  capacity: number;
  buckets: HashBucket[];
  activeCalculation: {
    key: string;
    hashCode: number;
    spreadHash: number;
    bucketIndex: number;
    step: string;
  } | null;
}

export interface HashMapState {
  entries: { key: string; value: number }[];
  capacity: number;
  buckets: HashBucket[];
  activeCalculation: {
    key: string;
    value?: number;
    hashCode: number;
    spreadHash: number;
    bucketIndex: number;
    step: string;
  } | null;
}

export interface TreeSetState {
  keys: number[];
  highlightPath: number[];
  targetKey: number | null;
  rotationInfo: string | null;
  boundaryResult: { label: string; value: number | null } | null;
}

export interface StreamStage {
  id: string;
  name: string;
  type: 'source' | 'filter' | 'map' | 'sorted' | 'terminal';
  items: number[];
}

export interface StreamsState {
  source: number[];
  filterValue: number;
  mapMultiplier: number;
  isSorted: boolean;
  terminalOp: 'toList' | 'findFirst' | 'anyMatch' | 'sum' | 'count';
  stages: StreamStage[];
  activeElementIndex: number;
  isEvaluating: boolean;
  terminalResult: string | number | boolean | number[] | (number | string)[] | null;
  shortCircuited: boolean;
}

export interface QuizProgress {
  answered: number;
  correct: number;
  answers: Record<number, { selected: string; correct: string; isCorrect: boolean }>;
  completed: boolean;
}

interface MasteryStore {
  // Navigation
  activeTopic: TopicId;
  activeTab: TabId;
  globalView: GlobalView;
  isSearchOpen: boolean;
  isSidebarCollapsed: boolean;
  
  // Topic Telemetry
  telemetryLogs: Record<TopicId, TelemetryLog[]>;
  currentLog: TelemetryLog | null;

  // Quiz Progress
  quizProgress: Record<TopicId, QuizProgress>;

  // Visualizer Live States
  arrayListState: ArrayListState;
  linkedListState: LinkedListState;
  hashSetState: HashSetState;
  treeSetState: TreeSetState;
  hashMapState: HashMapState;
  streamsState: StreamsState;

  // Actions
  setActiveTopic: (topic: TopicId) => void;
  setActiveTab: (tab: TabId) => void;
  setGlobalView: (view: GlobalView) => void;
  setSearchOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Telemetry Action
  addTelemetryLog: (topic: TopicId, log: TelemetryLog) => void;

  // Quiz Actions
  submitQuizAnswer: (topic: TopicId, questionId: number, selected: string, correct: string) => void;
  resetQuiz: (topic: TopicId) => void;

  // Sandbox State Actions
  updateArrayList: (updater: (prev: ArrayListState) => Partial<ArrayListState>) => void;
  updateLinkedList: (updater: (prev: LinkedListState) => Partial<LinkedListState>) => void;
  updateHashSet: (updater: (prev: HashSetState) => Partial<HashSetState>) => void;
  updateTreeSet: (updater: (prev: TreeSetState) => Partial<TreeSetState>) => void;
  updateHashMap: (updater: (prev: HashMapState) => Partial<HashMapState>) => void;
  updateStreams: (updater: (prev: StreamsState) => Partial<StreamsState>) => void;
}

const initialArrayList: ArrayListState = {
  items: ['Microservice', 'Cloud', 'Kubernetes', 'DevOps'],
  capacity: 10,
  highlightIndex: null,
  shiftedIndices: [],
  isGrowing: false,
  growFrom: 10,
  growTo: 15
};

const initialLinkedList: LinkedListState = {
  nodes: [
    { id: 'n1', val: 'Req-Ingest', address: '0x7F01A4' },
    { id: 'n2', val: 'Auth-Token', address: '0x7F02B8' },
    { id: 'n3', val: 'Rate-Limiter', address: '0x7F03C0' },
    { id: 'n4', val: 'Response-Sink', address: '0x7F04E2' }
  ],
  highlightId: null,
  unlinkingId: null,
  isLinkingHead: false,
  isLinkingTail: false
};

function computeHash(key: string): { hash: number; spreadHash: number; bucketIndex: number } {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (Math.imul(31, h) + key.charCodeAt(i)) | 0;
  }
  const spreadHash = (h ^ (h >>> 16)) >>> 0;
  const bucketIndex = spreadHash & (16 - 1);
  return { hash: h, spreadHash, bucketIndex };
}

function buildInitialBuckets(keys: string[], capacity = 16): HashBucket[] {
  const buckets: HashBucket[] = Array.from({ length: capacity }, (_, i) => ({
    index: i,
    nodes: [],
    isTreeified: false
  }));
  keys.forEach(k => {
    const { hash, spreadHash, bucketIndex } = computeHash(k);
    const bucket = buckets[bucketIndex % capacity];
    bucket.nodes.push({ key: k, hash, spreadHash });
    if (bucket.nodes.length >= 8 && capacity >= 64) {
      bucket.isTreeified = true;
    }
  });
  return buckets;
}

const initialHashSet: HashSetState = {
  elements: ['JWT_ADMIN', 'SESSION_X92', 'API_KEY_LIVE', 'CACHE_V1'],
  capacity: 16,
  buckets: buildInitialBuckets(['JWT_ADMIN', 'SESSION_X92', 'API_KEY_LIVE', 'CACHE_V1']),
  activeCalculation: null
};

const initialTreeSet: TreeSetState = {
  keys: [20, 35, 50, 65, 80, 95],
  highlightPath: [],
  targetKey: null,
  rotationInfo: null,
  boundaryResult: null
};

function buildInitialMapBuckets(entries: { key: string; value: number }[], capacity = 16): HashBucket[] {
  const buckets: HashBucket[] = Array.from({ length: capacity }, (_, i) => ({
    index: i,
    nodes: [],
    isTreeified: false
  }));
  entries.forEach(e => {
    const { hash, spreadHash, bucketIndex } = computeHash(e.key);
    const bucket = buckets[bucketIndex % capacity];
    bucket.nodes.push({ key: e.key, hash, spreadHash, val: e.value });
    if (bucket.nodes.length >= 8 && capacity >= 64) {
      bucket.isTreeified = true;
    }
  });
  return buckets;
}

const initialHashMap: HashMapState = {
  entries: [
    { key: 'AWS_CPU', value: 45 },
    { key: 'MEM_GB', value: 64 },
    { key: 'LATENCY_MS', value: 12 },
    { key: 'QPS_K', value: 180 }
  ],
  capacity: 16,
  buckets: buildInitialMapBuckets([
    { key: 'AWS_CPU', value: 45 },
    { key: 'MEM_GB', value: 64 },
    { key: 'LATENCY_MS', value: 12 },
    { key: 'QPS_K', value: 180 }
  ]),
  activeCalculation: null
};

const initialStreams: StreamsState = {
  source: [12, 45, 8, 88, 23, 67, 19, 54],
  filterValue: 20,
  mapMultiplier: 2,
  isSorted: false,
  terminalOp: 'toList',
  stages: [
    { id: 's1', name: 'Source: Arrays.stream()', type: 'source', items: [12, 45, 8, 88, 23, 67, 19, 54] },
    { id: 's2', name: 'Filter: n > 20', type: 'filter', items: [45, 88, 23, 67, 54] },
    { id: 's3', name: 'Map: n * 2', type: 'map', items: [90, 176, 46, 134, 108] },
    { id: 's4', name: 'Terminal: .toList()', type: 'terminal', items: [90, 176, 46, 134, 108] }
  ],
  activeElementIndex: -1,
  isEvaluating: false,
  terminalResult: null,
  shortCircuited: false
};

export const useMasteryStore = create<MasteryStore>()(
  persist(
    (set, get) => ({
      activeTopic: 'ArrayList',
      activeTab: 'sandbox',
      globalView: 'topic',
      isSearchOpen: false,
      isSidebarCollapsed: false,

      telemetryLogs: {
        ArrayList: [],
        LinkedList: [],
        HashSet: [],
        TreeSet: [],
        HashMap: [],
        Streams: []
      },
      currentLog: null,

      quizProgress: {
        ArrayList: { answered: 0, correct: 0, answers: {}, completed: false },
        LinkedList: { answered: 0, correct: 0, answers: {}, completed: false },
        HashSet: { answered: 0, correct: 0, answers: {}, completed: false },
        TreeSet: { answered: 0, correct: 0, answers: {}, completed: false },
        HashMap: { answered: 0, correct: 0, answers: {}, completed: false },
        Streams: { answered: 0, correct: 0, answers: {}, completed: false }
      },

      arrayListState: initialArrayList,
      linkedListState: initialLinkedList,
      hashSetState: initialHashSet,
      treeSetState: initialTreeSet,
      hashMapState: initialHashMap,
      streamsState: initialStreams,

      setActiveTopic: (topic) => set({ activeTopic: topic, globalView: 'topic' }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setGlobalView: (view) => set({ globalView: view }),
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

      addTelemetryLog: (topic, log) =>
        set((state) => ({
          currentLog: log,
          telemetryLogs: {
            ...state.telemetryLogs,
            [topic]: [log, ...(state.telemetryLogs[topic] || []).slice(0, 19)]
          }
        })),

      submitQuizAnswer: (topic, questionId, selected, correct) =>
        set((state) => {
          const current = state.quizProgress[topic] || { answered: 0, correct: 0, answers: {}, completed: false };
          if (current.answers[questionId]) return state; // already answered
          const isCorrect = selected === correct;
          const updatedAnswers = {
            ...current.answers,
            [questionId]: { selected, correct, isCorrect }
          };
          const answered = current.answered + 1;
          const correctCount = isCorrect ? current.correct + 1 : current.correct;
          const completed = answered >= 20;

          return {
            quizProgress: {
              ...state.quizProgress,
              [topic]: {
                answered,
                correct: correctCount,
                answers: updatedAnswers,
                completed
              }
            }
          };
        }),

      resetQuiz: (topic) =>
        set((state) => ({
          quizProgress: {
            ...state.quizProgress,
            [topic]: { answered: 0, correct: 0, answers: {}, completed: false }
          }
        })),

      updateArrayList: (updater) =>
        set((state) => ({ arrayListState: { ...state.arrayListState, ...updater(state.arrayListState) } })),

      updateLinkedList: (updater) =>
        set((state) => ({ linkedListState: { ...state.linkedListState, ...updater(state.linkedListState) } })),

      updateHashSet: (updater) =>
        set((state) => ({ hashSetState: { ...state.hashSetState, ...updater(state.hashSetState) } })),

      updateTreeSet: (updater) =>
        set((state) => ({ treeSetState: { ...state.treeSetState, ...updater(state.treeSetState) } })),

      updateHashMap: (updater) =>
        set((state) => ({ hashMapState: { ...state.hashMapState, ...updater(state.hashMapState) } })),

      updateStreams: (updater) =>
        set((state) => ({ streamsState: { ...state.streamsState, ...updater(state.streamsState) } }))
    }),
    {
      name: 'java-mastery-store',
      partialize: (state) => ({
        activeTopic: state.activeTopic,
        activeTab: state.activeTab,
        quizProgress: state.quizProgress
      })
    }
  )
);
