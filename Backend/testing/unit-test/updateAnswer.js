// updateAnswer.test.js - fixed to use surveyController and Session
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { updateAnswer } from '../../Controllers/surveyController.js';
import Session from '../../Models/participantModel.js';

const mockFn = () => {
  const fn = (...args) => fn.mock.calls.push(args);
  fn.mock = { calls: [] };
  fn.mockReturnValue = val => (fn.returnVal = val, fn);
  fn.mockResolvedValue = val => {
    fn.callImplementation = async () => val;
    return fn;
  };
  fn.mockRejectedValue = err => {
    fn.callImplementation = async () => { throw err; };
    return fn;
  };
  return fn;
};

const createMockRes = () => {
  const res = {};
  res.status = mockFn();
  res.json = mockFn();
  res.status.mockReturnValue(res);
  return res;
};

const mockNext = mockFn();

const baseReq = {
  params: {
    sessionId: 'session123',
    questionId: 'question123'
  },
  body: {
    answer: 'Updated answer',
    answerType: 'text',
    skipped: false
  }
};

describe('updateAnswer: Unit Test', () => {
  beforeEach(() => {
    mockNext.mock.calls = [];
  });

  it('should update the answer successfully', async () => {
    const mockSession = {
      _id: 'session123',
      responses: [{
        questionId: 'question123',
        participantAnswer: null,
        answerType: null,
        skipped: true
      }],
      save: async () => {},
    };

    Session.findById = async () => mockSession;

    const res = createMockRes();
    await updateAnswer(baseReq, res, mockNext);

    console.log('RES.STATUS CALLS:', res.status.mock.calls);
    console.log('RES.JSON CALLS:', res.json.mock.calls);

    assert.equal(res.status.mock.calls[0][0], 201);
    assert.deepEqual(res.json.mock.calls[0][0], {
      message: 'Answer updated',
      responses: mockSession.responses
    });
  });

  it('should return 404 if session is not found', async () => {
    Session.findById = async () => null;

    const res = createMockRes();
    await updateAnswer(baseReq, res, mockNext);

    const err = mockNext.mock.calls[0][0];
    assert.equal(err.statusCode, 404);
    assert.equal(err.message, 'Session not found');
  });

  it('should return 404 if response is not found', async () => {
    const mockSession = {
      _id: 'session123',
      responses: [],
      save: async () => {}
    };

    Session.findById = async () => mockSession;

    const res = createMockRes();
    await updateAnswer(baseReq, res, mockNext);

    const err = mockNext.mock.calls[0][0];
    assert.equal(err.statusCode, 404);
    assert.equal(err.message, 'Answer not found');
  });

  it('should handle unexpected error', async () => {
    Session.findById = async () => { throw new Error('Unexpected'); };

    const res = createMockRes();
    await updateAnswer(baseReq, res, mockNext);

    const err = mockNext.mock.calls[0][0];
    assert.equal(err.message, 'Unexpected');
  });
});
