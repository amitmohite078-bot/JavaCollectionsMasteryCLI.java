export type TopicId = 'ArrayList' | 'LinkedList' | 'HashSet' | 'TreeSet' | 'HashMap' | 'Streams';

export type TabId = 'sandbox' | 'architecture' | 'operations' | 'scenarios' | 'interview' | 'quiz';

export type GlobalView = 'topic' | 'master-matrix' | 'face-offs' | 'decision-wizard';

export type OperationCategory = 'Compare' | 'Insertion' | 'Deletion' | 'Searching' | 'Sorting';

export interface OperationDeepDive {
  name: string;
  category: OperationCategory;
  signature: string;
  timeComplexity: string;
  spaceComplexity: string;
  syntax: string;
  internalWorking: string;
  mechanics: string[];
  pitfalls?: string[];
}

export interface ArchitectureData {
  definition: string;
  coreArchitecture: string;
  basicSyntax: string;
  keyPoints: string[];
  advantages: string[];
  disadvantages: string[];
}

export interface RealWorldScenario {
  id: number;
  domain: string;
  problem: string;
  solution: string;
}

export interface InterviewQA {
  id: number;
  category: 'Service-Based' | 'Product-Based';
  question: string;
  answer: string;
}

export interface QuizQuestion {
  id: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  options: string[];
  correctOption: string;
  explanation: string;
}

export interface TopicContent {
  id: number;
  key: TopicId;
  title: string;
  category: 'List' | 'Set' | 'Map' | 'Stream';
  badge: string;
  complexity: string;
  mindMap: string;
  architecture: ArchitectureData;
  operations: OperationDeepDive[];
  scenarios: RealWorldScenario[];
  interviewQAs: InterviewQA[];
  quizzes: QuizQuestion[];
}

export interface TelemetryLog {
  timestamp: string;
  operation: string;
  timeComplexity: string;
  spaceComplexity: string;
  beforeState: string;
  afterState: string;
  jvmBytesAllocated: number;
  cacheLocalityScore: 'High (L1/L2)' | 'Moderate' | 'Low (Pointer Chasing)';
  gcPressure: 'None (In-Place)' | 'Low (Wrapper Node)' | 'High (Resizing Copy)';
  output: string;
  stepDetails?: string[];
}
