import { describe, expect, it } from 'vitest'
import { estimateCostUsd } from './gemini-usage-cost-estimate'

describe('gemini-usage-cost-estimate', () => {
  it('calculates standard cost for gemini-2.5-pro under context threshold', () => {
    // 1,000 input tokens at $1.25/M = $0.00125
    // 500 cached input tokens at $0.3125/M = $0.00015625
    // (non-cached input: 1,000 - 500 = 500 tokens at $1.25/M = $0.000625)
    // 250 output tokens at $5.00/M = $0.00125
    // Total = 0.000625 + 0.00015625 + 0.00125 = 0.00203125
    const cost = estimateCostUsd('gemini-2.5-pro', 1_000, 500, 250)
    expect(cost).toBeCloseTo(0.00203125, 6)
  })

  it('calculates cost for gemini-2.5-flash with cached input', () => {
    // 10,000 input tokens with 8,000 cached:
    // non-cached: 2,000 * 0.075 / 1M = 0.00015
    // cached: 8,000 * 0.01875 / 1M = 0.00015
    // output: 5,000 * 0.3 / 1M = 0.0015
    // Total = 0.0018
    const cost = estimateCostUsd('gemini-2.5-flash', 10_000, 8_000, 5_000)
    expect(cost).toBeCloseTo(0.0018, 6)
  })

  it('handles long context (> 128k tokens) tiered pricing', () => {
    // 200,000 input tokens (0 cached):
    // 128,000 at $1.25/M = 0.16
    // 72,000 at $2.50/M = 0.18
    // output: 10,000 at $5.00/M = 0.05
    // Total = 0.39
    const cost = estimateCostUsd('gemini-2.5-pro', 200_000, 0, 10_000)
    expect(cost).toBeCloseTo(0.39, 4)
  })

  it('clamps cached tokens when cachedInputTokens exceeds inputTokens', () => {
    // If cached is 1,500 but input is 1,000, clamped cached is 1,000, non-cached is 0
    const cost = estimateCostUsd('gemini-2.5-pro', 1_000, 1_500, 0)
    // 1,000 * 0.3125 / 1M = 0.0003125
    expect(cost).toBeCloseTo(0.0003125, 6)
  })

  it('returns null for unknown models', () => {
    expect(estimateCostUsd('unknown-model-xyz', 1_000, 0, 500)).toBeNull()
    expect(estimateCostUsd(null, 1_000, 0, 500)).toBeNull()
  })
})
