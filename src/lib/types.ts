export interface ActionItem {
  id: string;
  integrationKey: string;
  name: string;
  additionalData?: string[];
  milestones?: { name: string, id: string }[];
}

export interface Level {
  level: number;
  name: string;
  min: number;
  imageUrl: string;
}

export interface MemberData {
  id: string;
  externalId: string;
  points: number;
  spendablePoints: number;
  currentLevel: Level;
  nextLevel: Level;
}

export interface MemberResponse {
  data: MemberData;
}

export interface Progress {
  currentValue: number;
  targetValue: string;
  completed: boolean;
}

export interface StreakInfo {
  streakDuration: number;
  currentStreak: number;
  streakStartDate: string;
}

export interface Milestone {
  id: string;
  name: string;
  description: string | null;
  completed: boolean;
  rewardPoints: number;
  isStreakBased: boolean;
  progress: Progress[];
  imageUrl: string | null;
  isActive: boolean;
  streakInfo: StreakInfo | null;
}

export interface MilestoneData {
  memberMilestones: Milestone[];
  otherMilestones: Milestone[];
}


export interface MemberMilestone {
  id: string;
  name: string;
  description: string | null;
  completed: boolean;
  rewardPoints: number;
  isStreakBased: boolean;
  progress: Progress[];
  imageUrl: string | null;
  isActive: boolean;
  streakInfo: StreakInfo | null;
}
export interface MemberMilestoneResponse {
  memberMilestones: MemberMilestone[];
  otherMilestones: MemberMilestone[];
}

export interface FormData {
  memberId: string;
  integrationKey: string;
  points: string;
  additionalData: Record<string, string>;
  timestamp: string;
} 