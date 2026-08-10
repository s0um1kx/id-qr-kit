import { describe, it, expect } from 'vitest';
import { createId } from './id';

describe('createId Uniqueness & Functionality', () => {
  it('should generate IDs with the correct prefix and length', () => {
    const id = createId({ prefix: 'EVT', length: 10 });
    expect(id).toMatch(/^EVT-[a-zA-Z0-9]{10}$/);
  });

  it('should generate 10,000 unique IDs without a single collision', () => {
    const totalRuns = 10000;
    const generatedSet = new Set<string>();

    for (let i = 0; i < totalRuns; i++) {
      const newId = createId({ prefix: 'PASS', length: 8, charset: 'alphanumeric' });
      
      // If the ID already exists in the Set, a collision occurred
      expect(generatedSet.has(newId)).toBe(false);
      
      generatedSet.add(newId);
    }

    // Verify all 10,000 generated IDs are distinct
    expect(generatedSet.size).toBe(totalRuns);
  });
});