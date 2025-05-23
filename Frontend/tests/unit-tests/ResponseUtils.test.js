import pkg from '@jest/globals';
const { describe, it, expect, beforeAll, afterAll, jest } = pkg;
import { getResponseCount } from '../../src/utils/responseUtils.js';
import { getResponses } from '../../src/services/studyService.js';

jest.mock('../../src/services/studyService.js');

describe('getResponseCount', () => {
  const studyId = 'study1d';

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {}); 
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  describe('Positive cases', () => {
    it('should return the correct count from response', async () => {
      getResponses.mockResolvedValue({ count: 42 });

      const result = await getResponseCount(studyId);
      expect(result).toBe(42);
    });

    it('should return 0 if count is missing', async () => {
      getResponses.mockResolvedValue({});

      const result = await getResponseCount(studyId);
      expect(result).toBe(0);
    });
  });

  describe('Negative cases', () => {
    it('should return 0 and log error on failure', async () => {
      getResponses.mockRejectedValue(new Error('Network error'));

      const result = await getResponseCount(studyId);
      expect(result).toBe(0);
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching response count:',
        expect.any(Error)
      );
    });
  });

  describe('Edge Cases', () => {
    it('should return 0 if count is undefined', async () => {
      getResponses.mockResolvedValue({});

      const result = await getResponseCount(studyId);
      expect(result).toBe(0);
    });

    it('should return 0 if count is null', async () => {
      getResponses.mockResolvedValue({ count: null });

      const result = await getResponseCount(studyId);
      expect(result).toBe(0);
    });
  });
});
