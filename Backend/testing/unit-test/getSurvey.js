import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { deleteStudy } from '../../Controllers/dashController.js';
import { getSurvey } from '../../Controllers/surveyController.js';
import Study from '../../Models/studyModel.js';
import checkStudyAuthorization  from '../../Utils/authHelperFunction.js';

// Mocks
Study.findByIdAndDelete = () => {};
Study.findById = () => {};
checkStudyAuthorization.mock = () => {};

const mockFn = () => {
  const fn = (...args) => fn.mock.calls.push(args);
  fn.mock = { calls: [] };
  fn.mockReturnValue = val => (fn.returnVal = val, fn);
  return fn;
};

const mockRes = () => {
  const res = {};
  res.status = mockFn();
  res.json = mockFn();
  res.status.mockReturnValue(res);
  return res;
};

const mockNext = mockFn();

const baseReq = {
  params: { studyId: 'test1d' },
  user: { _id: 'test4user1d' }
};

describe('deleteStudy: Controller Unit Tests', () => {
  beforeEach(() => {
    mockNext.mock.calls = [];
  });

  it('Positive Case: should delete a study successfully', async () => {
    checkStudyAuthorization.mockResolvedValue = async () => true;
    Study.findByIdAndDelete = async () => ({ _id: 'test1d', title: 'Test Study' });

    const res = mockRes();
    await deleteStudy(baseReq, res, mockNext);

    assert.equal(res.status.mock.calls[0][0], 200);
    assert.deepEqual(res.json.mock.calls[0][0], { message: 'Study deleted successfully' });
  });

  it('Negative Case: should return 404 if study not found', async () => {
    checkStudyAuthorization.mockResolvedValue = async () => true;
    Study.findByIdAndDelete = async () => null;

    const res = mockRes();
    await deleteStudy(baseReq, res, mockNext);

    assert.equal(res.status.mock.calls[0][0], 404);
    assert.deepEqual(res.json.mock.calls[0][0], { message: 'Study not found' });
  });

  it('Negative Case: should return 403 if unauthorized', async () => {
    checkStudyAuthorization.mockRejectedValue = async () => { throw new Error('Unauthorized'); };

    const res = mockRes();
    await deleteStudy(baseReq, res, mockNext);

    assert.equal(mockNext.mock.calls.length, 1);
    assert.equal(mockNext.mock.calls[0][0].message, 'Unauthorized');
  });

  it('Edge Case: should handle missing studyId', async () => {
    const res = mockRes();
    await deleteStudy({ ...baseReq, params: {} }, res, mockNext);

    assert.equal(mockNext.mock.calls.length, 1);
    assert.ok(mockNext.mock.calls[0][0] instanceof Error);
  });
});

describe('getSurvey: Controller Unit Tests', () => {
  beforeEach(() => {
    mockNext.mock.calls = [];
  });

  it('Positive Case: should return question and metadata when valid', async () => {
    Study.findById = async () => ({
      _id: 'test1d',
      published: true,
      title: 'Survey',
      description: 'Test Survey',
      questions: [{ _id: 'q1', text: 'Q1?' }]
    });

    const res = mockRes();
    await getSurvey({ params: { studyId: 'test1d' }, query: { page: 0 } }, res, mockNext);

    assert.equal(res.status.mock.calls[0][0], 200);
    assert.ok(res.json.mock.calls[0][0].title === 'Survey');
  });

  it('Negative Case: should return 404 if study is not found', async () => {
    Study.findById = async () => null;
    const res = mockRes();
    await getSurvey({ params: { studyId: 'notfound' }, query: { page: 0 } }, res, mockNext);

    assert.equal(mockNext.mock.calls[0][0].statusCode, 404);
  });

  it('Negative Case: should return 400 for invalid page number', async () => {
    Study.findById = async () => ({ published: true, questions: [] });
    const res = mockRes();
    await getSurvey({ params: { studyId: 'test1d' }, query: { page: 999 } }, res, mockNext);

    assert.equal(mockNext.mock.calls[0][0].statusCode, 400);
  });

  it('Edge Case: should return 403 if study is not published', async () => {
    Study.findById = async () => ({ published: false });
    const res = mockRes();
    await getSurvey({ params: { studyId: 'unpublished' }, query: { page: 0 } }, res, mockNext);

    assert.equal(mockNext.mock.calls[0][0].statusCode, 403);
  });
});