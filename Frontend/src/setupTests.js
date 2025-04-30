// A setup file for MSW hooks for mock testing

import { server } from './__tests__/mocks/server';  
import '@testing-library/jest-dom/extend-expect';

// MSW lifecycle hooks
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
