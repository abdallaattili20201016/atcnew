import '@testing-library/jest-dom';

const { TextEncoder, TextDecoder } = require('util');
const { ReadableStream } = require('web-streams-polyfill/ponyfill');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.ReadableStream = ReadableStream;

// Polyfill for fetch if needed
const fetch = require('node-fetch');
global.fetch = fetch;
