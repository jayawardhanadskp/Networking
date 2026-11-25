import { describe, expect, it } from 'vitest';
import {
  addressType, calculate, checkAnswer, explainSteps, generateQuestion, intToIp, ipClass, ipToInt,
  maskToPrefix, parseInput, prefixForHosts, prefixToMask, seededRng, ALL_KINDS,
} from './subnet';

describe('ip conversion', () => {
  it('converts both ways', () => {
    expect(ipToInt('192.168.1.1')).toBe(3232235777);
    expect(intToIp(3232235777)).toBe('192.168.1.1');
    expect(intToIp(ipToInt('255.255.255.255'))).toBe('255.255.255.255');
    expect(intToIp(ipToInt('0.0.0.0'))).toBe('0.0.0.0');
  });
  it('rejects invalid addresses', () => {
    expect(() => ipToInt('256.1.1.1')).toThrow();
    expect(() => ipToInt('1.2.3')).toThrow();
    expect(() => ipToInt('a.b.c.d')).toThrow();
    expect(() => ipToInt('1.2.3.4.5')).toThrow();
  });
});

describe('masks', () => {
  it('prefix to mask', () => {
    expect(intToIp(prefixToMask(0))).toBe('0.0.0.0');
    expect(intToIp(prefixToMask(8))).toBe('255.0.0.0');
    expect(intToIp(prefixToMask(20))).toBe('255.255.240.0');
    expect(intToIp(prefixToMask(26))).toBe('255.255.255.192');
    expect(intToIp(prefixToMask(30))).toBe('255.255.255.252');
    expect(intToIp(prefixToMask(32))).toBe('255.255.255.255');
    expect(() => prefixToMask(33)).toThrow();
  });
  it('mask to prefix', () => {
    expect(maskToPrefix('255.255.255.0')).toBe(24);
    expect(maskToPrefix('255.255.248.0')).toBe(21);
    expect(maskToPrefix('255.0.255.0')).toBeNull();
    expect(maskToPrefix('255.255.255.1')).toBeNull();
  });
});

describe('calculate', () => {
  it('192.168.1.130/26', () => {
    const r = calculate('192.168.1.130', 26);
    expect(r.network).toBe('192.168.1.128');
    expect(r.broadcast).toBe('192.168.1.191');
    expect(r.firstHost).toBe('192.168.1.129');
    expect(r.lastHost).toBe('192.168.1.190');
    expect(r.usableHosts).toBe(62);
    expect(r.mask).toBe('255.255.255.192');
    expect(r.wildcard).toBe('0.0.0.63');
  });
  it('172.16.45.200/20', () => {
    const r = calculate('172.16.45.200', 20);
    expect(r.network).toBe('172.16.32.0');
    expect(r.broadcast).toBe('172.16.47.255');
    expect(r.firstHost).toBe('172.16.32.1');
    expect(r.lastHost).toBe('172.16.47.254');
    expect(r.usableHosts).toBe(4094);
    expect(r.wildcard).toBe('0.0.15.255');
  });
  it('10.20.5.25/24 and /16 and /8', () => {
    expect(calculate('10.20.5.25', 24).network).toBe('10.20.5.0');
    expect(calculate('10.20.5.25', 24).usableHosts).toBe(254);
    expect(calculate('10.20.5.25', 16).broadcast).toBe('10.20.255.255');
    const a = calculate('10.0.0.1', 8);
    expect(a.broadcast).toBe('10.255.255.255');
    expect(a.usableHosts).toBe(16777214);
  });
  it('/30 point-to-point', () => {
    const r = calculate('192.168.10.9', 30);
    expect(r.network).toBe('192.168.10.8');
    expect(r.broadcast).toBe('192.168.10.11');
    expect(r.firstHost).toBe('192.168.10.9');
    expect(r.lastHost).toBe('192.168.10.10');
    expect(r.usableHosts).toBe(2);
  });
  it('/31 and /32 edge cases', () => {
    const r31 = calculate('10.0.0.7', 31);
    expect(r31.network).toBe('10.0.0.6');
    expect(r31.usableHosts).toBe(2);
    expect(r31.firstHost).toBe('10.0.0.6');
    expect(r31.lastHost).toBe('10.0.0.7');
    const r32 = calculate('10.0.0.7', 32);
    expect(r32.network).toBe('10.0.0.7');
    expect(r32.usableHosts).toBe(1);
  });
  it('/0 covers everything', () => {
    const r = calculate('8.8.8.8', 0);
    expect(r.network).toBe('0.0.0.0');
    expect(r.broadcast).toBe('255.255.255.255');
  });
  it('high addresses do not go negative', () => {
    const r = calculate('255.255.255.200', 25);
    expect(r.network).toBe('255.255.255.128');
    expect(r.broadcast).toBe('255.255.255.255');
  });
});

describe('classes and types', () => {
  it('classes', () => {
    expect(ipClass(ipToInt('10.1.1.1'))).toBe('A');
    expect(ipClass(ipToInt('127.0.0.1'))).toBe('A');
    expect(ipClass(ipToInt('172.16.0.1'))).toBe('B');
    expect(ipClass(ipToInt('192.168.0.1'))).toBe('C');
    expect(ipClass(ipToInt('224.0.0.5'))).toBe('D (multicast)');
    expect(ipClass(ipToInt('240.0.0.1'))).toBe('E (reserved)');
  });
  it('private ranges', () => {
    expect(addressType(ipToInt('172.31.255.255'))).toBe('Private (RFC 1918)');
    expect(addressType(ipToInt('172.32.0.1'))).toBe('Public');
    expect(addressType(ipToInt('192.168.100.1'))).toBe('Private (RFC 1918)');
    expect(addressType(ipToInt('169.254.10.10'))).toBe('Link-local / APIPA');
    expect(addressType(ipToInt('127.0.0.1'))).toBe('Loopback');
    expect(addressType(ipToInt('100.64.0.1'))).toBe('Carrier-grade NAT (shared)');
  });
});

describe('parseInput', () => {
  it('accepts CIDR and mask formats', () => {
    expect(parseInput('192.168.1.10/26')).toEqual({ ip: '192.168.1.10', prefix: 26 });
    expect(parseInput(' 192.168.1.10 / 26 ')).toEqual({ ip: '192.168.1.10', prefix: 26 });
    expect(parseInput('192.168.1.10 255.255.255.192')).toEqual({ ip: '192.168.1.10', prefix: 26 });
  });
  it('rejects bad input', () => {
    expect(() => parseInput('192.168.1.10/33')).toThrow();
    expect(() => parseInput('192.168.1.10 255.0.255.0')).toThrow();
    expect(() => parseInput('hello')).toThrow();
  });
});

describe('prefixForHosts', () => {
  it('finds the smallest fitting subnet', () => {
    expect(prefixForHosts(2)).toBe(30);
    expect(prefixForHosts(3)).toBe(29);
    expect(prefixForHosts(6)).toBe(29);
    expect(prefixForHosts(7)).toBe(28);
    expect(prefixForHosts(50)).toBe(26);
    expect(prefixForHosts(62)).toBe(26);
    expect(prefixForHosts(63)).toBe(25);
    expect(prefixForHosts(254)).toBe(24);
    expect(prefixForHosts(255)).toBe(23);
    expect(prefixForHosts(1000)).toBe(22);
  });
});

describe('explainSteps', () => {
  it('mentions the magic number and the results', () => {
    const s = explainSteps('172.16.45.200', 20).join('\n');
    expect(s).toContain('256 − 240');
    expect(s).toContain('**16**');
    expect(s).toContain('172.16.32.0');
    expect(s).toContain('172.16.47.255');
  });
  it('handles octet-boundary prefixes', () => {
    const s = explainSteps('10.20.5.25', 16).join('\n');
    expect(s).toContain('10.20.0.0');
    expect(s).toContain('10.20.255.255');
  });
});

describe('practice generator', () => {
  it('every generated answer matches the calculator and is accepted', () => {
    const rng = seededRng(42);
    for (let i = 0; i < 500; i++) {
      const q = generateQuestion(rng, ALL_KINDS);
      expect(checkAnswer(q, q.answer)).toBe(true);
      expect(q.steps.length).toBeGreaterThan(0);
      if (q.ip && q.prefix !== undefined) {
        const r = calculate(q.ip, q.prefix);
        const expected: Record<string, string> = {
          network: r.network, broadcast: r.broadcast, firstHost: r.firstHost, lastHost: r.lastHost,
        };
        if (q.kind in expected) expect(q.answer).toBe(expected[q.kind]);
      }
    }
  });
  it('checkAnswer is forgiving about format', () => {
    const q = generateQuestion(seededRng(1), ['prefixForHosts']);
    expect(checkAnswer(q, q.answer.replace('/', ''))).toBe(true);
    expect(checkAnswer(q, '')).toBe(false);
    const h = generateQuestion(seededRng(7), ['hosts']);
    expect(checkAnswer(h, ` ${h.answer} `)).toBe(true);
  });
});
