export type GeminiUsageProcessedFile = {
  path: string
  mtimeMs: number
  size: number
}

export type GeminiUsageLocationBreakdown = {
  locationKey: string
  projectLabel: string
  repoId: string | null
  worktreeId: string | null
  eventCount: number
  inputTokens: number
  cachedInputTokens: number
  outputTokens: number
  reasoningOutputTokens: number
  totalTokens: number
  hasInferredPricing: boolean
}

export type GeminiUsageModelBreakdown = {
  modelKey: string
  modelLabel: string
  hasInferredPricing: boolean
  eventCount: number
  inputTokens: number
  cachedInputTokens: number
  outputTokens: number
  reasoningOutputTokens: number
  totalTokens: number
}

export type GeminiUsageLocationModelBreakdown = {
  locationKey: string
  modelKey: string
  modelLabel: string
  repoId: string | null
  worktreeId: string | null
  eventCount: number
  inputTokens: number
  cachedInputTokens: number
  outputTokens: number
  reasoningOutputTokens: number
  totalTokens: number
  hasInferredPricing: boolean
}

export type GeminiUsageSession = {
  sessionId: string
  firstTimestamp: string
  lastTimestamp: string
  primaryModel: string | null
  hasMixedModels: boolean
  primaryProjectLabel: string
  hasMixedLocations: boolean
  primaryWorktreeId: string | null
  primaryRepoId: string | null
  eventCount: number
  totalInputTokens: number
  totalCachedInputTokens: number
  totalOutputTokens: number
  totalReasoningOutputTokens: number
  totalTokens: number
  hasInferredPricing: boolean
  locationBreakdown: GeminiUsageLocationBreakdown[]
  modelBreakdown: GeminiUsageModelBreakdown[]
  locationModelBreakdown: GeminiUsageLocationModelBreakdown[]
}

export type GeminiUsageDailyAggregate = {
  day: string
  model: string | null
  projectKey: string
  projectLabel: string
  repoId: string | null
  worktreeId: string | null
  eventCount: number
  inputTokens: number
  cachedInputTokens: number
  outputTokens: number
  reasoningOutputTokens: number
  totalTokens: number
  hasInferredPricing: boolean
}

export type GeminiUsagePersistedFile = GeminiUsageProcessedFile & {
  sessions: GeminiUsageSession[]
  dailyAggregates: GeminiUsageDailyAggregate[]
  /** Event keys this file counted. Resumed/forked rollouts or transcripts copy earlier
   *  records into new files; ownership keeps each record counted by exactly one
   *  cached file across incremental scans. */
  ownedEventKeys: string[]
  /** True when this file saw events already claimed by another file. When that
   *  owner disappears, only deferred files need reparse to reclaim — not the
   *  entire corpus. */
  hasDeferredClaims: boolean
}

export type GeminiUsagePersistedState = {
  schemaVersion: number
  worktreeFingerprint: string | null
  processedFiles: GeminiUsagePersistedFile[]
  sessions: GeminiUsageSession[]
  dailyAggregates: GeminiUsageDailyAggregate[]
  scanState: {
    enabled: boolean
    lastScanStartedAt: number | null
    lastScanCompletedAt: number | null
    lastScanError: string | null
  }
}

export type GeminiUsageParsedEvent = {
  sessionId: string
  timestamp: string
  /** Raw-record identity (timestamp + token tuples) used to dedupe the same
   *  event copied across fork/resume session files. */
  eventKey: string
  model: string | null
  cwd: string | null
  hasInferredPricing: boolean
  inputTokens: number
  cachedInputTokens: number
  outputTokens: number
  reasoningOutputTokens: number
  totalTokens: number
}

export type GeminiUsageAttributedEvent = GeminiUsageParsedEvent & {
  day: string
  projectKey: string
  projectLabel: string
  repoId: string | null
  worktreeId: string | null
}
