import { submitDemographics } from '../../utils/submitDemographics';
import axios from 'axios';

jest.mock('axios');

const studyId = '123abc';

test('Positive case: valid submission returns sessionId', async () => {
  axios.post.mockResolvedValue({ data: { sessionId: 'abc123' } });
  const result = await submitDemographics(studyId, { age: '25', gender: 'female' });
  expect(result).toBe('abc123');
});

test('Edge case: missing age returns null', async () => {
  const result = await submitDemographics(studyId, { gender: 'female' });
  expect(result).toBeNull();
});

test('Boundary case: borderline age accepted', async () => {
  axios.post.mockResolvedValue({ data: { sessionId: 'edge456' } });
  const result = await submitDemographics(studyId, { age: '0', gender: 'male' });
  expect(result).toBe('edge456');
});

test('Negative case: server error returns null', async () => {
  axios.post.mockRejectedValue(new Error('network error'));
  const result = await submitDemographics(studyId, { age: '25', gender: 'female' });
  expect(result).toBeNull();
});
