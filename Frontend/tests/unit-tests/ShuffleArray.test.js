import pkg from '@jest/globals';
const { describe, it, expect, beforeAll, afterAll, jest } = pkg;
import { shuffleArray } from '../../src/utils/shuffleArray.js';

describe('shuffleArray', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  describe('Positive cases', () => {
    it('should return a new array with the same elements', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(original);

      expect(shuffled).toHaveLength(original.length);
      expect([...shuffled].sort()).toEqual([...original].sort());
    });

    it('should not mutate the original array', () => {
      const original = [1, 2, 3, 4, 5];
      const copy = [...original];
      shuffleArray(original);
      expect(original).toEqual(copy);
    });

    it('should return a different order most of the time', () => {
      const input = [1, 2, 3, 4, 5];
      let differentCount = 0;

      for (let i = 0; i < 10; i++) {
        const shuffled = shuffleArray(input);
        if (shuffled.join() !== input.join()) {
          differentCount++;
        }
      }

      expect(differentCount).toBeGreaterThan(0);
    });
  });


  describe('Negative cases', () => {
    it('should throw error if input is not an array (string)', () => {
      expect(() => shuffleArray('abc')).toThrow(TypeError);
    });

    it('should throw error if input is null', () => {
      expect(() => shuffleArray(null)).toThrow(TypeError);
    });

    it('should throw error if input is undefined', () => {
      expect(() => shuffleArray(undefined)).toThrow(TypeError);
    });

    it('should throw error if input is a number', () => {
      expect(() => shuffleArray(123)).toThrow(TypeError);
    });
  });


  describe('Boundary cases', () => {
    it('should handle empty array', () => {
      const shuffled = shuffleArray([]);
      expect(shuffled).toEqual([]);
    });

    it('should handle array with one element', () => {
      const shuffled = shuffleArray([42]);
      expect(shuffled).toEqual([42]);
    });
  });


  describe('Edge cases', () => {
    it('should handle arrays with the same values correctly', () => {
      const input = [1, 2, 2, 3, 3, 3];
      const shuffled = shuffleArray(input);
  
      expect(shuffled).toHaveLength(input.length);
  
      const inputSorted = [...input].sort();
      const shuffledSorted = [...shuffled].sort();
  
      expect(shuffledSorted).toEqual(inputSorted);
    });
  });
});
