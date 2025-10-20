import { BaseEntity } from "@/types/base-entity";

export interface WritingSubmissionInterface extends BaseEntity {
  examId: string | null;
  taskNumber: number | null;
  questionText: string | null;
  questionFile: string | null;
  answerText: string | null;
  answerFile: string | null;
}

export interface SpeakingSubmissionInterface extends BaseEntity {
  examId: string;
  taskNumber: number;
  questionText: string | null;
  questionFile: string | null;
  answerFile: string | null;
  answerFileUrl: string | null;
}

export interface ExamInterface extends BaseEntity {
  examSessionId: string;
  speakingSubmissions: SpeakingSubmissionInterface[];
  writingSubmissions: WritingSubmissionInterface[];
  name: string | null;
}

export interface ScoringSystemInterface extends BaseEntity {
  userId: string | null;
  name: string | null;
  description: string | null;
  speakingTaskFactors: number[];
  writingTaskFactors: number[];
}

export interface ExamSessionInterface extends BaseEntity {
  userId: string | null;
  scoringSystemId: string | null;
  exams: ExamInterface[];
  name: string | null;
  description: string | null;
}

export interface ScoringResultInterface extends BaseEntity {
  submissionType: SubmissionType | null;
  examId: string | null;
  submissionId: string | null;
  model: ScoringModel | null;
  overall: number | null;
  explanation: string | null;
  processingTime: number | null;
  usageInfo:
    | {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
      model: string;
      cost_usd: number;
    }
    | null;

  // Writing-specific scores
  organization: number | null;
  vocabulary: number | null;
  grammar: number | null;

  // Speaking-specific scores
  pronunciation: number | null;
  fluency: number | null;
  content: number | null;

}

export enum ScoringJobStatus {
  NOT_BEGUN = "not_begun",
  QUEUED = "queued",
  PROCESSING = "processing",
  DONE = "done",
  ERROR = "error",
}

export enum ScoringQueueName {
  WRITING_GEMINI_PRO_SCORING = "writing-gemini-pro-scoring",
  WRITING_AI4LIFE_MODEL_SCORING = "writing-ai4life-model-scoring",
  SPEAKING_CHATGPT_4O_AUDIO_SCORING = "speaking-chatgpt-4o-audio-scoring",
  SPEAKING_AI4LIFE_MODEL_SCORING = "speaking-ai4life-model-scoring",
}

export enum SubmissionType {
  WRITING = "writing",
  SPEAKING = "speaking",
}

export enum ScoringModel {
  GEMINI_PRO = "gemini-pro",
  AI4LIFE_WRITING = "ai4life-writing",
  CHATGPT_4O_AUDIO = "chatgpt-4o-audio",
  AI4LIFE_SPEAKING = "ai4life-speaking",
}

export interface ScoringJobInterface extends BaseEntity {
  jobId: string | null;
  queueName: ScoringQueueName | null;
  status: ScoringJobStatus;
  examId: string;
  examSessionId: string;
  submissionId: string;
  submissionType: SubmissionType | null;
  queuedAt: Date | null;
  startedAt: Date | null;
  completedAt: Date | null;
  failedAt: Date | null;
  attempts: number;
  errorMessage: string | null;
  errorStack: any;
  scoringResultId: string | null;
  metadata?: any;
}
