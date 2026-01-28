import { describe, expect, test } from 'bun:test';
import { connectLinks, normalizeLink } from '@/lib/link';

describe('normalizeLink', () => {
  test('simple', () => {
    expect(normalizeLink('simple')).toBe('/simple');
  });
  test('with / prefix', () => {
    expect(normalizeLink('/simple')).toBe('/simple');
  });
  test('dot', () => {
    expect(normalizeLink('.')).toBe('/');
  });
  test('undefined', () => {
    expect(normalizeLink(undefined)).toBe('/');
  });
});

describe('connectLinks', () => {
  test('simple', () => {
    expect(connectLinks('a', 'b')).toBe('/a/b');
  });
  test('with / prefix', () => {
    expect(connectLinks('/a', 'b')).toBe('/a/b');
    expect(connectLinks('a', '/b')).toBe('/a/b');
    expect(connectLinks('/a', '/b')).toBe('/a/b');
  });
  test('dot', () => {
    expect(connectLinks('a', '.')).toBe('/a');
    expect(connectLinks('.', 'b')).toBe('/b');
    expect(connectLinks('.', '.')).toBe('/');
  });
  test('undefined', () => {
    expect(connectLinks(undefined, undefined)).toBe('/');
    expect(connectLinks('a', undefined)).toBe('/a');
    expect(connectLinks(undefined, 'b')).toBe('/b');
  });
});
