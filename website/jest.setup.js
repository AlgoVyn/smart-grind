// Jest setup file
import 'jest-environment-jsdom';
import { TextEncoder, TextDecoder } from 'util';

// Create a reusable mock factory
const createLocalStorageMock = () => {
  const mock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  return mock;
};

// Mock fetch globally
global.fetch = jest.fn();

// Set up localStorage mock
global.localStorage = createLocalStorageMock();

// Mock sessionStorage
global.sessionStorage = createLocalStorageMock();

// Mock navigator.clipboard
global.navigator = global.navigator || {};
Object.defineProperty(global.navigator, 'clipboard', {
  value: {
    writeText: jest.fn().mockResolvedValue(),
  },
  writable: true,
});

// Set on window.navigator
global.window.navigator = global.navigator;

// Spy on navigator.clipboard.writeText
jest.spyOn(global.navigator.clipboard, 'writeText');

// Mock window.history
global.window.history = {
  pushState: jest.fn(),
  replaceState: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  go: jest.fn(),
};

// Mock window.location to prevent navigation errors
global.window.location = new URL('http://localhost');


// Mock document.execCommand for clipboard fallback
global.document.execCommand = jest.fn(() => true);

// Spy on document.execCommand
jest.spyOn(global.document, 'execCommand');

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Keep log and error, but mock warn and info
  warn: jest.fn(),
  info: jest.fn(),
};

// Mock crypto.subtle for JWT signing
const mockSign = jest.fn();
const mockImportKey = jest.fn();
const mockVerify = jest.fn();

global.crypto = global.crypto || {};
global.crypto.subtle = {
  importKey: mockImportKey,
  sign: mockSign,
  verify: mockVerify,
};

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
