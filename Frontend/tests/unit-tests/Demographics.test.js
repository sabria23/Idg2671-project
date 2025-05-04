import { submitDemographics } from '../../src/utils/submitDemographics';
import axios from 'axios';

jest.mock('axios');

const studyId = 'study1d';

describe('submitDemographics', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  describe('Positive cases', () => {
    it('should return sessionId on valid string age', async () => {
      axios.post.mockResolvedValue({ data: { sessionId: 'session1d1' } });

      const result = await submitDemographics(studyId, { age: '25', gender: 'female' });

      expect(result).toBe('session1d1');
    });

    it('should return sessionId on valid numeric age', async () => {
      axios.post.mockResolvedValue({ data: { sessionId: 'session1d2' } });

      const result = await submitDemographics(studyId, { age: 30, gender: 'male' });

      expect(result).toBe('session1d2');
    });
  });


  describe('Negative cases', () => {
    it('should return null on server/network error', async () => {
      axios.post.mockRejectedValue(new Error('network error'));

      const result = await submitDemographics(studyId, { age: '25', gender: 'female' });

      expect(result).toBeNull();
    });

    it('should return null if studyId is missing', async () => {
      const result = await submitDemographics(undefined, { age: '25', gender: 'female' });
      expect(result).toBeNull();
    });

    it('should return null if gender is a number', async () => {
      const result = await submitDemographics(studyId, { age: '25', gender: 1 });
      expect(result).toBeNull();
    });

    it('should return null if age is null', async () => {
      const result = await submitDemographics(studyId, { age: null, gender: 'female' });
      expect(result).toBeNull();
    });

    it('should return null if age is above 130', async () => {
      const result = await submitDemographics(studyId, { age: 150, gender: 'female' });
      expect(result).toBeNull();
    });
  });



  describe('Boundary cases', () => {
    it('should accept lowest valid age "0"', async () => {
      axios.post.mockResolvedValue({ data: { sessionId: 'session1d0edge' } });

      const result = await submitDemographics(studyId, { age: '0', gender: 'male' });

      expect(result).toBe('session1d0edge');
    });

    it('should accept highest realistic age "130"', async () => {
      axios.post.mockResolvedValue({ data: { sessionId: 'session1d130edge' } });

      const result = await submitDemographics(studyId, { age: '130', gender: 'male' });

      expect(result).toBe('session1d130edge');
    });

    it('should return null if age is missing', async () => {
      const result = await submitDemographics(studyId, { gender: 'female' });
      expect(result).toBeNull();
    });

    it('should return null if age is an empty string', async () => {
      const result = await submitDemographics(studyId, { age: '', gender: 'female' });
      expect(result).toBeNull();
    });

    it('should return null if gender is missing', async () => {
      const result = await submitDemographics(studyId, { age: '25' });
      expect(result).toBeNull();
    });

    it('should return null if gender is an empty string', async () => {
      const result = await submitDemographics(studyId, { age: '25', gender: '' });
      expect(result).toBeNull();
    });

    it('should return null if age is a non-numeric string', async () => {
      const result = await submitDemographics(studyId, { age: 'twenty-five', gender: 'female' });
      expect(result).toBeNull();
    });
  });


  describe('Edge cases', () => {
    it('should handle age as a string with leading zeros', async () => {
      axios.post.mockResolvedValue({ data: { sessionId: 'session1d01' } });

      const result = await submitDemographics(studyId, { age: '025', gender: 'female' });
      expect(result).toBe('session1d01');
    });

    it('should handle age as a float string like "25.0"', async () => {
      axios.post.mockResolvedValue({ data: { sessionId: 'sessionFloat' } });
  
      const result = await submitDemographics(studyId, { age: '25.0', gender: 'female' });
      expect(result).toBe('sessionFloat');
    });
  
    it('should ignore extra unexpected fields in demographics object', async () => {
      axios.post.mockResolvedValue({ data: { sessionId: 'sessionExtraField' } });
  
      const result = await submitDemographics(studyId, {
        age: '25',
        gender: 'female',
        hobby: 'reading', 
      });
  
      expect(result).toBe('sessionExtraField');
    });
  
    it('should handle gender with spaces', async () => {
      axios.post.mockResolvedValue({ data: { sessionId: 'sessionCaseInsensitive' } });
  
      const result = await submitDemographics(studyId, { age: '25', gender: ' Male ' });
      expect(result).toBe('sessionCaseInsensitive');
    });

    it('should handle gender with spaces', async () => {
      axios.post.mockResolvedValue({ data: { sessionId: 'sessionCaseInsensitive' } });
  
      const result = await submitDemographics(studyId, { age: '25', gender: 'FEMALE' });
      expect(result).toBe('sessionCaseInsensitive');
    });

  });
});