import { describe, it, expect } from 'vitest'
import { generatePlayers } from './players'

describe('generatePlayers', () => {
  it('returns the requested count', () => {
    expect(generatePlayers(50)).toHaveLength(50)
  })

  it('gives every player a unique id', () => {
    const players = generatePlayers(50)
    const ids = new Set(players.map(p => p.id))
    expect(ids.size).toBe(50)
  })

  it('keeps elo within 1000–3000', () => {
    const players = generatePlayers(50)
    players.forEach(p => {
      expect(p.elo).toBeGreaterThanOrEqual(1000)
      expect(p.elo).toBeLessThanOrEqual(3000)
    })
  })

  it('keeps role attributes within 0–10', () => {
    const players = generatePlayers(50)
    const attrs = ['awp', 'entry', 'support', 'igl', 'lurker'] as const
    players.forEach(p => {
      attrs.forEach(attr => {
        expect(p[attr]).toBeGreaterThanOrEqual(0)
        expect(p[attr]).toBeLessThanOrEqual(10)
      })
    })
  })

  it('produces deterministic output for the same seed', () => {
    const a = generatePlayers(10, 123)
    const b = generatePlayers(10, 123)
    expect(a).toEqual(b)
  })

  it('produces different output for different seeds', () => {
    const a = generatePlayers(10, 1)
    const b = generatePlayers(10, 2)
    expect(a).not.toEqual(b)
  })
})
