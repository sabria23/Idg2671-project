import { submitAnswer } from '../../Controllers/surveyController';
import Session from '../../Models/participantModel';
import Study from '../../Models/studyModel';

jest.mock('../../Models/participantModel');
jest.mock('../../Models/studyModel');

const mockReq = {
  params: { studyId: 'abc', sessionId: '123', questionId: 'q1' },
  body: { answer: 'A', skipped: false, answerType: 'single' }
};

const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

const mockNext = jest.fn();

test('submitAnswer returns error if session not found', async () => {
  Session.findById.mockResolvedValue(null);

  await submitAnswer(mockReq, mockRes, mockNext);

  expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  expect(mockNext.mock.calls[0][0].message).toMatch(/Session not found/);
});

test('submits answer successfully', async () => {
    const mockSession = { responses: [], save: jest.fn() };
    const mockStudy = { questions: [{ _id: 'q1' }] };
  
    Session.findById.mockResolvedValue(mockSession);
    Study.findById.mockResolvedValue(mockStudy);
  
    await submitAnswer(mockReq, mockRes, mockNext);
  
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Answer submitted' }));
});

test('handles empty answer string', async () => {
    const req = { ...mockReq, body: { answer: '', skipped: false, answerType: 'text' } };
    const mockSession = { responses: [], save: jest.fn() };
    const mockStudy = { questions: [{ _id: 'q1' }] };
  
    Session.findById.mockResolvedValue(mockSession);
    Study.findById.mockResolvedValue(mockStudy);
  
    await submitAnswer(req, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(201);
});

test('fails when deviceInfo is missing', async () => {
    const req = { ...mockReq, body: { demographics: {} } };
    Study.findById.mockResolvedValue({ published: true });
  
    await createSession(req, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
});
  