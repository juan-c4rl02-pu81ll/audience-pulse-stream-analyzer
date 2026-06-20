/**
 * Core interface definitions for the YouTube Video & Live Analytics Dashboard
 */

export interface VideoMetrics {
  views: number;
  peakConcurrentViewers?: number;
  avgWatchTimePercent: number; // e.g. 64 (for 64%)
  avgWatchTimeSeconds: number; // e.g. 1720 (seconds)
  engagementRate: number;     // e.g. 8.4 (for 8.4%)
  subscriberGain: number;     // e.g. 1420
  likesRatio: number;         // e.g. 98.7 (% likes)
  chatRatePerMinute?: number; // e.g. 145 (only for live or high engagement)
}

export interface RetentionPoint {
  timestampSeconds: number;
  timestampLabel: string; // e.g. "05:00"
  retentionPercentage: number; // e.g. 100 to 0
}

export interface RetentionAnnotation {
  id: string;
  timestampSeconds: number;
  timestampLabel: string;
  type: 'peak' | 'drop' | 'plateau';
  title: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  timestampLabel: string; // e.g. "14:20"
  timestampSeconds: number;
  username: string;
  message: string;
  sentiment: 'positive' | 'negative' | 'question' | 'neutral';
  impactScore: number; // scale 1-10
}

export interface DiscussionTrend {
  topic: string;
  volumePercentage: number; // e.g. 35
  averageSentiment: 'positive' | 'negative' | 'question' | 'neutral';
  description: string;
}

export interface StrategicApproach {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  contentType: 'shorts' | 'followup_video' | 'community_post' | 'newsletter' | 'live_event';
  expectedImpact: string;
}

export interface VideoAnalysisResult {
  url: string;
  videoId: string;
  title: string;
  channelName: string;
  durationSeconds: number;
  durationLabel: string; // e.g. "45:30" or "LIVE"
  isLive: boolean;
  category: string;
  summary: string;
  metrics: VideoMetrics;
  retentionCurve: RetentionPoint[];
  annotations: RetentionAnnotation[];
  chatMessages: ChatMessage[];
  criticalTrends: DiscussionTrend[];
  strategicApproaches: StrategicApproach[];
}
