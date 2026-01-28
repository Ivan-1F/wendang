import { expect, test, describe } from 'bun:test'
import { pathToSlug, slugsEqual } from './slug'

describe('pathToSlug', () => {
  test('removes .mdx extension', () => {
    expect(pathToSlug('introduction.mdx')).toEqual(['introduction'])
  })

  test('removes route groups (parentheses folders)', () => {
    expect(pathToSlug('(core)/introduction.mdx')).toEqual(['introduction'])
    expect(pathToSlug('(core)/(getting-started)/introduction.mdx')).toEqual(['introduction'])
  })

  test('preserves non-route-group segments', () => {
    expect(pathToSlug('guides/setup.mdx')).toEqual(['guides', 'setup'])
    expect(pathToSlug('(core)/guides/setup.mdx')).toEqual(['guides', 'setup'])
  })

  test('handles nested paths with mixed segments', () => {
    expect(pathToSlug('(core)/(api)/reference/auth.mdx')).toEqual(['reference', 'auth'])
    expect(pathToSlug('docs/(advanced)/features/hooks.mdx')).toEqual(['docs', 'features', 'hooks'])
  })

  test('handles path without route groups', () => {
    expect(pathToSlug('api/reference/endpoints.mdx')).toEqual(['api', 'reference', 'endpoints'])
  })
})

describe('slugsEqual', () => {
  test('returns true for equal slugs', () => {
    expect(slugsEqual(['introduction'], ['introduction'])).toBe(true)
    expect(slugsEqual(['guides', 'setup'], ['guides', 'setup'])).toBe(true)
    expect(slugsEqual([], [])).toBe(true)
  })

  test('returns false for different lengths', () => {
    expect(slugsEqual(['introduction'], [])).toBe(false)
    expect(slugsEqual(['a', 'b'], ['a'])).toBe(false)
  })

  test('returns false for different values', () => {
    expect(slugsEqual(['introduction'], ['setup'])).toBe(false)
    expect(slugsEqual(['guides', 'setup'], ['guides', 'intro'])).toBe(false)
  })
})
