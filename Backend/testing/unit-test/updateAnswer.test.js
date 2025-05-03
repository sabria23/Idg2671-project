import { updateAnswer } from '../../Controllers/surveyController';
import Session from '../../Models/participantModel';

jest.mock('../../Models/participantModel');

const mockReq = {
  params: {
    sessionId: 'abc123',
    questionId: 'q1'
  },
  body: {
    answer: 'Updated Answer',
    answerType: 'text',
    skipped: false
  }
};

const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

const mockNext = jest.fn();

describe('updateAnswer unit test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update existing response in session', async () => {
    const saveMock = jest.fn();
    const sessionMock = {
      responses: [{
        questionId: 'q1',
        participantAnswer: 'Old answer',
        answerType: 'text',
        skipped: false
      }],
      save: saveMock
    };

    Session.findById.mockResolvedValue(sessionMock);

    await updateAnswer(mockReq, mockRes, mockNext);

    expect(sessionMock.responses[0].participantAnswer).toBe('Updated Answer');
    expect(sessionMock.responses[0].skipped).toBe(false);
    expect(saveMock).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Answer updated',
      responses: sessionMock.responses
    });
  });

  it('should handle session not found', async () => {
    Session.findById.mockResolvedValue(null);
    await updateAnswer(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should handle missing response', async () => {
    Session.findById.mockResolvedValue({ responses: [], save: jest.fn() });
    await updateAnswer(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should nullify participantAnswer if skipped', async () => {
    const saveMock = jest.fn();
    const sessionMock = {
      responses: [{
        questionId: 'q1',
        participantAnswer: 'Old answer',
        answerType: 'text',
        skipped: false
      }],
      save: saveMock
    };

    Session.findById.mockResolvedValue(sessionMock);

    const skippedReq = {
      ...mockReq,
      body: {
        answer: 'Should be null',
        answerType: 'text',
        skipped: true
      }
    };

    await updateAnswer(skippedReq, mockRes, mockNext);

    expect(sessionMock.responses[0].participantAnswer).toBe(null);
    expect(sessionMock.responses[0].skipped).toBe(true);
    expect(saveMock).toHaveBeenCalled();
  });
});
