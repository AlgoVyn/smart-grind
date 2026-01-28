// Jest setup file
import 'jest-environment-jsdom';
import { TextEncoder, TextDecoder } from 'util';

// Mock import.meta.env for Vite environment variables
global.import = {
    meta: {
        env: {
            VITE_API_BASE: '/smartgrind/api',
        },
    },
};

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


// Mock window.open
global.window.open = jest.fn();



// Mock document.execCommand for clipboard fallback
global.document.execCommand = jest.fn(() => true);

// Spy on document.execCommand
jest.spyOn(global.document, 'execCommand');

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Mock warn, info, and error to reduce noise
  warn: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
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

// Mock btoa and atob for base64 encoding
global.btoa = jest.fn((str) => Buffer.from(str, 'binary').toString('base64'));
global.atob = jest.fn((str) => Buffer.from(str, 'base64').toString('binary'));
