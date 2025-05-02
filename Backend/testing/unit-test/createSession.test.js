import { createSession } from '../../Controllers/surveyController';
import Study from '../../Models/studyModel';
import Session from '../../Models/participantModel';

jest.mock('../../Models/studyModel');
jest.mock('../../Models/participantModel');

const mockReq = {
  params: { studyId: 'abc' },
  body: { deviceInfo: 'Phone', demographics: {} }
};

const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

const mockNext = jest.fn();

test('createSession returns error if study not found', async () => {
  Study.findById.mockResolvedValue(null);
  await createSession(mockReq, mockRes, mockNext);
  expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
});

test('createSession returns error if study is not published', async () => {
  Study.findById.mockResolvedValue({ published: false });
  await createSession(mockReq, mockRes, mockNext);
  expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
});

test('createSession creates session with valid input', async () => {
  Study.findById.mockResolvedValue({ published: true });
  Session.mockImplementation(() => ({ save: jest.fn(), _id: 'abc' }));

  await createSession(mockReq, mockRes, mockNext);

  expect(mockRes.status).toHaveBeenCalledWith(201);
  expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
    message: 'Session created successfully',
    sessionId: 'abc'
  }));
});