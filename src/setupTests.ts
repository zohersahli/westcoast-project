import 'jest-environment-jsdom';

// Mock fetch API
Object.defineProperty(window, 'fetch', {
  writable: true,
  value: jest.fn(),
}); 